<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPreference;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'preferred_sources' => 'array',
            'preferred_categories' => 'array',
            'preferred_authors' => 'array',
        ]);

        $user = Auth::user();
        $preferences = UserPreference::updateOrCreate(
            ['user_id' => $user->id],
            [
                'preferred_sources' => $request->preferred_sources,
                'preferred_categories' => $request->preferred_categories,
                'preferred_authors' => $request->preferred_authors,
            ]
        );

        return response()->json([
            'message' => 'Preferences updated successfully',
            'data' => $preferences
        ]);
    }

    public function getPreferences()
    {
        $preferences = Auth::user()->userPreference;
        return response()->json(['data' => $preferences]);
    }
}
