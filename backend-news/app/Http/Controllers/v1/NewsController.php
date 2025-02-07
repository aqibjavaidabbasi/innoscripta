<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Exception;

class NewsController extends Controller
{
    /**
     * Search for news articles.
     *
     * @group News
     *
     * @queryParam keyword string Search keyword in title or description. Example: "technology"
     * @queryParam category string Filter by category. Example: "Business"
     * @queryParam source string Filter by source. Example: "BBC News"
     * @queryParam author string Filter by author name. Example: "John Doe"
     * @queryParam start_date date Filter articles published after this date. Example: "2024-01-01"
     * @queryParam end_date date Filter articles published before this date. Example: "2024-01-31"
     *
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "title": "Latest Business Trends",
     *       "category": "Business",
     *       "source": "BBC News",
     *       "author": "John Doe",
     *       "published_at": "2024-01-15"
     *     }
     *   ],
     *   "links": { ... },
     *   "meta": { ... }
     * }
     *
     * @response 500 {
     *   "message": "Something went wrong",
     *   "error": "Server error details"
     * }
     */
    public function search(Request $request)
    {
        try {
            $articles = News::query()
                ->when($request->keyword, function ($query, $keyword) {
                    $query->where(function ($q) use ($keyword) {
                        $q->where('title', 'LIKE', "%{$keyword}%")
                          ->orWhere('description', 'LIKE', "%{$keyword}%");
                    });
                })
                ->when($request->category, fn($query, $category) => $query->where('category', 'LIKE', "%{$category}%"))
                ->when($request->source, fn($query, $source) => $query->where('source', $source))
                ->when($request->author, fn($query, $author) => $query->where('author', 'LIKE', "%{$author}%"))
                ->when($request->start_date && $request->end_date, function ($query) use ($request) {
                    $query->whereBetween('published_at', [$request->start_date, $request->end_date]);
                }, function ($query) use ($request) {
                    $query->when($request->start_date, fn($q, $start) => $q->where('published_at', '>=', $start))
                          ->when($request->end_date, fn($q, $end) => $q->where('published_at', '<=', $end));
                })
                ->orderByDesc('published_at')
                ->paginate(10);

            return response()->json($articles, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a personalized news feed based on user preferences.
     *
     * @group News
     *
     * @authenticated
     *
     * @header Authorization Bearer {YOUR_ACCESS_TOKEN}
     *
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "title": "AI Innovations in 2024",
     *       "category": "Technology",
     *       "source": "TechCrunch",
     *       "published_at": "2024-02-01"
     *     }
     *   ],
     *   "links": { ... },
     *   "meta": { ... }
     * }
     *
     * @response 401 {
     *   "message": "Unauthorized"
     * }
     *
     * @response 500 {
     *   "message": "Something went wrong",
     *   "error": "Server error details"
     * }
     */
    public function personalizedFeed(Request $request)
    {
        try {
            $user = Auth::user();
    
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
    
            $preferences = optional($user->userPreference);
    
            $articles = News::query()
                ->when($preferences->preferred_sources, fn($query, $sources) => $query->whereIn('source', $sources))
                ->when($preferences->preferred_categories, function ($query, $categories) {
                    $query->where(function ($q) use ($categories) {
                        foreach ($categories as $category) {
                            $q->orWhere('category', 'LIKE', "%{$category}%");
                        }
                    });
                })
                ->when($preferences->preferred_authors, function ($query, $authors) {
                    $query->where(function ($q) use ($authors) {
                        foreach ($authors as $author) {
                            $q->orWhere('author', 'LIKE', "%{$author}%");
                        }
                    });
                })
                ->orderByDesc('published_at')
                ->paginate(10);
    
            return response()->json($articles, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}
