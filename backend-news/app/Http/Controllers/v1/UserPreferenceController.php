<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use App\Models\UserPreference;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class UserPreferenceController extends Controller
{
    /**
     * Update user preferences.
     *
     * @group User Preferences
     *
     * @authenticated
     *
     * @header Authorization Bearer {YOUR_ACCESS_TOKEN}
     *
     * @bodyParam preferred_sources array Optional list of preferred news sources. Example: ["BBC News", "CNN"]
     * @bodyParam preferred_categories array Optional list of preferred categories. Example: ["Technology", "Business"]
     * @bodyParam preferred_authors array Optional list of preferred authors. Example: ["John Doe", "Jane Smith"]
     *
     * @response 200 {
     *   "message": "Preferences updated successfully",
     *   "data": {
     *     "user_id": 1,
     *     "preferred_sources": ["BBC News", "CNN"],
     *     "preferred_categories": ["Technology", "Business"],
     *     "preferred_authors": ["John Doe", "Jane Smith"]
     *   }
     * }
     */
    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'preferred_sources' => 'array|nullable',
            'preferred_categories' => 'array|nullable',
            'preferred_authors' => 'array|nullable',
        ]);

        $user = Auth::user();

        $preferences = UserPreference::updateOrCreate(
            ['user_id' => $user->id],
            [
                'preferred_sources' => $validated['preferred_sources'] ?? [],
                'preferred_categories' => $validated['preferred_categories'] ?? [],
                'preferred_authors' => $validated['preferred_authors'] ?? [],
            ]
        );

        return response()->json([
            'message' => 'Preferences updated successfully',
            'data' => $preferences,
        ], 200);
    }

    /**
     * Retrieve user preferences.
     *
     * @group User Preferences
     *
    * @authenticated
     *
     * @header Authorization Bearer {YOUR_ACCESS_TOKEN}
     *
     * @response 200 {
     *   "data": {
     *     "user_id": 1,
     *     "preferred_sources": ["BBC News", "CNN"],
     *     "preferred_categories": ["Technology", "Business"],
     *     "preferred_authors": ["John Doe", "Jane Smith"]
     *   }
     * }
     *
     * @response 404 {
     *   "message": "No preferences found"
     * }
     */
    public function getPreferences()
    {
        $preferences = Auth::user()->userPreference;

        return $preferences
            ? response()->json(['data' => $preferences], 200)
            : response()->json(['message' => 'No preferences found'], 404);
    }
}
