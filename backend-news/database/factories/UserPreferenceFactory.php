<?php

namespace Database\Factories;

use App\Models\UserPreference;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserPreference>
 */
class UserPreferenceFactory extends Factory
{
    protected $model = UserPreference::class;

    public function definition()
    {
        return [
            'user_id' => \App\Models\User::factory(), // Creates a user if not provided
            'preferred_sources' => ['Guardian', 'NewsAPI'],
            'preferred_categories' => ['art', 'Daily Beast'],
            'preferred_authors' => ['Will Unwin', 'Jennifer M. Wood'],
        ];
    }
}
