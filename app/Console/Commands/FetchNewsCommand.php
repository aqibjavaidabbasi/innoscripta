<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Services\NewsService;

class FetchNewsCommand extends Command
{
    protected $signature = 'news:fetch';
    protected $description = 'Fetch the latest news from external sources';

    public function __construct(private NewsService $newsService)
    {
        parent::__construct();
    }

    public function handle(): void
    {
        $this->newsService->fetchNews();
        $this->info('News fetched successfully!');
    }
}
