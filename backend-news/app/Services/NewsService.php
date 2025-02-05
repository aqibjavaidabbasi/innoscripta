<?php 

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\News;
use Carbon\Carbon;

class NewsService
{
    private array $sources = [
        'NewsAPI' => 'https://newsapi.org/v2/top-headlines?country=us&apiKey=',
        'Guardian' => 'https://content.guardianapis.com/search?api-key=',
        'NYTimes' => 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=',
    ];

    public function fetchNews(): void
    {
        foreach ($this->sources as $source => $baseUrl) {
            $apiKey = match ($source) {
                'NewsAPI' => env('NEWSAPI_KEY'),
                'Guardian' => env('GUARDIAN_KEY'),
                'NYTimes' => env('NYTIMES_KEY'),
                default => null,
            };

            $url = $baseUrl . $apiKey;
            if ($source === 'Guardian') {
                $url .= '&show-fields=thumbnail,byline&show-tags=keyword,series';
            }
            $response = Http::get($url);

            if ($response->successful()) {
                $this->storeNews($response->json(), $source);
            }
        }
    }

    private function storeNews(array $data, string $source): void
    {
        $articles = match ($source) {
            'NewsAPI' => $data['articles'] ?? [],
            'Guardian' => $data['response']['results'] ?? [],
            'NYTimes' => $data['results'] ?? [],
            default => [],
        };

        foreach ($articles as $article) {
            $newsData = match ($source) {
                'NewsAPI' => [
                    'title' => $article['title'],
                    'description' => $article['description'] ?? null,
                    'url' => $article['url'],
                    'image' => $article['urlToImage'] ?? null,
                    'author' => $this->cleanAuthorName($article['author'] ?? null),
                    'category' => $article['source']['name'] ?? null,
                    'published_at' => Carbon::parse($article['publishedAt']),
                ],
                'Guardian' => [
                    'title' => $article['webTitle'],
                    'description' => null,
                    'url' => $article['webUrl'],
                    'image' => $article['fields']['thumbnail'] ?? null,
                    'author' => $this->cleanAuthorName($article['fields']['byline'] ?? null),
                    'category' => isset($article['tags']) ? implode(', ', array_column($article['tags'], 'webTitle')) : null,
                    'published_at' => Carbon::parse($article['webPublicationDate']),
                ],
                'NYTimes' => [
                    'title' => $article['title'],
                    'description' => $article['abstract'],
                    'url' => $article['url'],
                    'image' => $article['multimedia'][0]['url'] ?? null,
                    'author' => $this->cleanAuthorName($article['byline'] ?? null),
                    'category' => $article['section'] ?? null,
                    'published_at' => Carbon::parse($article['published_date']),
                ],
                default => [],
            };

            News::updateOrCreate(
                ['url' => $newsData['url']], 
                array_merge($newsData, ['source' => $source])
            );
        }
    }

    private function cleanAuthorName($author)
    {
        if (!$author) {
            return null;
        }

        // Remove common unwanted words
        $unwantedWords = ['by', 'now', 'earlier'];
        $author = preg_replace('/\b(' . implode('|', $unwantedWords) . ')\b/i', '', $author);

        // Remove content inside parentheses (e.g., "John Doe (Editor)")
        $author = preg_replace('/\s*\([^)]*\)/', '', $author);

        // Remove "in <CityName>" (Handles any city name)
        $author = preg_replace('/\sin\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/', '', $author);

        // Convert "and" into ", "
        $author = preg_replace('/\s+and\s+/', ', ', $author);

        // Remove duplicate commas
        $author = preg_replace('/,\s*,+/', ',', $author);

        // Trim excessive spaces and any trailing commas
        $author = preg_replace('/\s+/', ' ', trim($author));
        $author = preg_replace('/^,|,$/', '', $author);

        return $author;
    }

    

}
