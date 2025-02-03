<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    public function search(Request $request)
    {
        $query = News::query();

        if ($request->has('keyword')) {
            $query->where('title', 'LIKE', "%{$request->keyword}%")
                ->orWhere('description', 'LIKE', "%{$request->keyword}%");
        }

        if ($request->has('category')) {
            $query->where(function ($q) use ($request) {
                $q->where('category', 'LIKE', "%{$request->category}%");
            });
        }

        if ($request->has('source')) {
            $query->where('source', $request->source);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('published_at', [$request->start_date, $request->end_date]);
        } elseif ($request->has('start_date')) {
            $query->where('published_at', '>=', $request->start_date);
        } elseif ($request->has('end_date')) {
            $query->where('published_at', '<=', $request->end_date);
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate(10);

        return response()->json($articles);
    }

    public function personalizedFeed(Request $request)
    {
        $user = Auth::user();
        $preferences = $user->userPreference;

        $query = News::query();

        if ($preferences) {
            if (!empty($preferences->preferred_sources)) {
                $query->whereIn('source', $preferences->preferred_sources);
            }

            if (!empty($preferences->preferred_categories)) {
                $query->where(function ($q) use ($preferences) {
                    foreach ($preferences->preferred_categories as $category) {
                        $q->orWhere('category', 'LIKE', "%{$category}%");
                    }
                });
            }

            if (!empty($preferences->preferred_authors)) {
                $query->whereIn('author', $preferences->preferred_authors);
            }
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate(10);

        return response()->json($articles);
    }

}