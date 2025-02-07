<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use App\Models\News;
use App\Http\Controllers\Controller;

class FilterController extends Controller
{
    /**
     * Get all unique categories.
     *
     * @group Filters
     *
     * @response 200 {
     *  "categories": [
     *      "Technology",
     *      "Health",
     *      "Business",
     *      "Sports"
     *  ]
     * }
     *
     * @response 500 {
     *  "message": "Something went wrong",
     *  "error": "Server error message"
     * }
     */
    public function categories()
    {
        try {
            $categories = News::selectRaw('DISTINCT category')->pluck('category')->filter()->toArray();

            // Explode categories (handling multiple categories in one field), trim spaces, and make unique
            $cleanedCategories = array_unique(array_map('trim', explode(',', implode(',', $categories))));

            return response()->json(['categories' => array_values($cleanedCategories)], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all unique sources.
     *
     * @group Filters
     *
     * @response 200 {
     *  "sources": [
     *      "BBC News",
     *      "Reuters",
     *      "TechCrunch",
     *      "CNN"
     *  ]
     * }
     *
     * @response 500 {
     *  "message": "Something went wrong",
     *  "error": "Server error message"
     * }
     */
    public function sources()
    {
        try {
            $sources = News::selectRaw('DISTINCT source')->pluck('source')->toArray();

            return response()->json(['sources' => $sources], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all unique authors.
     *
     * @group Filters
     *
     * @response 200 {
     *  "authors": [
     *      "John Doe",
     *      "Jane Smith",
     *      "Michael Johnson"
     *  ]
     * }
     *
     * @response 500 {
     *  "message": "Something went wrong",
     *  "error": "Server error message"
     * }
     */
    public function authors()
    {
        try {
            $authors = News::selectRaw('DISTINCT author')->pluck('author')->filter()->toArray();

            // Explode authors (handling multiple authors in one field), trim spaces, and make unique
            $cleanedAuthors = array_unique(array_map('trim', explode(',', implode(',', $authors))));

            return response()->json(['authors' => $cleanedAuthors], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
