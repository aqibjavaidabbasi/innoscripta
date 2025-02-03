<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\News;

class FilterController extends Controller
{
    public function categories()
    {
        $categories = News::selectRaw('DISTINCT category')->pluck('category')->filter()->toArray();

        // Explode categories (handling multiple categories in one field), trim spaces, and make unique
        $cleanedCategories = array_unique(array_map('trim', explode(',', implode(',', $categories))));

        return response()->json(['categories' => array_values($cleanedCategories)]);
    }

    public function sources()
    {
        $sources = News::selectRaw('DISTINCT source')->pluck('source')->toArray();
        return response()->json(['sources' => $sources]);
    }

    public function authors()
    {
        $authors = News::selectRaw('DISTINCT author')->pluck('author')->filter()->toArray();

        $cleanedAuthors = array_unique(array_map('trim', explode(',', implode(',', $authors))));

        return response()->json(['authors' => $cleanedAuthors]);
    }
}
