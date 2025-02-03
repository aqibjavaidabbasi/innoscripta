<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'registerTestUser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(201)
        ->assertJsonStructure(['user', 'access_token']);
    }

    #[Test]
    public function user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'loginTestUser@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'loginTestUser@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
        ->assertJsonStructure(['user', 'access_token']);
    }

    #[Test]
    public function user_can_logout()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logged out successfully']);
    }

    #[Test]
    public function it_fetches_news_articles()
    {
        $response = $this->getJson('/api/articles');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    #[Test]
    public function it_filters_articles_by_keyword()
    {
        $response = $this->getJson('/api/articles?keyword=technology');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    #[Test]
    public function it_filters_articles_by_date_range()
    {
        $response = $this->getJson('/api/articles?start_date=2024-01-01&end_date=2024-02-01');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    #[Test]
    public function it_filters_articles_by_category()
    {
        $response = $this->getJson('/api/articles?category=Sports');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    #[Test]
    public function it_filters_articles_by_source()
    {
        $response = $this->getJson('/api/articles?source=BBC News');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    #[Test]
    public function it_fetches_personalized_news_feed()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/personalized-feed');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    #[Test]
    public function it_fetches_available_categories()
    {
        $response = $this->getJson('/api/filters/categories');

        $response->assertStatus(200)
                 ->assertJsonStructure(['categories']);
    }

    #[Test]
    public function it_fetches_available_sources()
    {
        $response = $this->getJson('/api/filters/sources');

        $response->assertStatus(200)
                 ->assertJsonStructure(['sources']);
    }

    #[Test]
    public function it_fetches_available_authors()
    {
        $response = $this->getJson('/api/filters/authors');

        $response->assertStatus(200)
                 ->assertJsonStructure(['authors']);
    }

    #[Test]
    public function user_can_update_preferences()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/user/preferences', [
            'categories' => ['Technology', 'Sports'],
            'sources' => ['BBC News', 'CNN'],
            'authors' => ['John Doe'],
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Preferences updated successfully']);
    }

    #[Test]
    public function user_can_fetch_preferences()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
    
        // Assuming user preferences exist for this user
        $preferences = \App\Models\UserPreference::factory()->create([
            'user_id' => $user->id,
            'preferred_sources' => ['Guardian', 'NewsAPI'],
            'preferred_categories' => ['art', 'Daily Beast'],
            'preferred_authors' => ['Will Unwin', 'Jennifer M. Wood'],
        ]);
    
        $response = $this->getJson('/api/user/preferences');
    
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'user_id',
                         'preferred_sources',
                         'preferred_categories',
                         'preferred_authors',
                         'created_at',
                         'updated_at'
                     ]
                 ])
                 ->assertJson([
                     'data' => [
                         'id' => $preferences->id,
                         'user_id' => $user->id,
                         'preferred_sources' => ['Guardian', 'NewsAPI'],
                         'preferred_categories' => ['art', 'Daily Beast'],
                         'preferred_authors' => ['Will Unwin', 'Jennifer M. Wood'],
                     ]
                 ]);
    }
    
}
