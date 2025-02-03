# News Aggregator API

## Overview
The **News Aggregator API** is a Laravel 11-based system that collects news articles from multiple sources, allowing users to search, filter, and personalize their news feed.

## Features
- User authentication (Register, Login, Logout) using Laravel Sanctum
- Fetch news from multiple sources (NewsAPI, Guardian, NYTimes)
- Search and filter news by keyword, category, source, and date range
- User preferences for personalized news feed
- Scheduled jobs to fetch the latest news every hour
- API endpoints for retrieving available categories, sources, and authors

## Installation
### Requirements
- PHP 8.2+
- Composer
- Laravel 11
- MySQL 8+

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/news-aggregator.git
   cd news-aggregator
   ```
2. Install dependencies:
   ```sh
   composer install
   ```
3. Copy the environment file and update configurations:
   ```sh
   cp .env.example .env
   ```
4. Generate the application key:
   ```sh
   php artisan key:generate
   ```
5. Configure database in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=news_aggregator
   DB_USERNAME=root
   DB_PASSWORD=
   ```
6. Run migrations:
   ```sh
   php artisan migrate
   ```
7. Seed news sources:
   ```sh
   php artisan db:seed --class=NewsSourceSeeder
   ```
8. Start the application:
   ```sh
   php artisan serve
   ```

## API Endpoints
### Authentication
- **Register**: `POST /api/register`
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password",
    "password_confirmation": "password"
  }
  ```
- **Login**: `POST /api/login`
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password"
  }
  ```
- **Logout**: `POST /api/logout` (Requires Bearer Token)

### News
- **Fetch Articles**: `GET /api/articles`
  - Query Params: `keyword, category, source, start_date, end_date`
- **Get Personalized Feed**: `GET /api/personalized-feed` (Requires authentication)
- **Get Available Categories**: `GET /api/filters/categories`
- **Get Available Sources**: `GET /api/filters/sources`
- **Get Available Authors**: `GET /api/filters/authors`

### User Preferences
- **Update Preferences**: `POST /api/user/preferences`
  ```json
  {
    "preferred_sources": ["Guardian", "NYTimes"],
    "preferred_categories": ["Technology", "Business"],
    "preferred_authors": ["John Doe", "Jane Smith"]
  }
  ```
- **Get Preferences**: `GET /api/user/preferences`

## Headers Required
For API requests requiring authentication, include the following headers:
```yaml
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

## Scheduled Tasks
- Fetch latest news every hour:
  ```sh
  php artisan schedule:work
  ```

## Testing
Run API tests:
```sh
php artisan test
```

## License
This project is licensed under the MIT License.
