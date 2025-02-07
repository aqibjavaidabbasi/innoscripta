# Innoscripta - News Application

This project is a full-stack news application built with **Laravel** (backend) and **React** (frontend). It is containerized using **Docker** for easy setup and deployment.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
   - [Using Docker](#using-docker)
   - [Without Docker](#without-docker)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
6. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)

---

## Project Structure
```
Innoscripta/
  -> backend-news/ (Laravel backend)
  -> frontend-news/ (React frontend)
  -> docker-compose.yml (Docker Compose configuration)
```

---

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Docker** and **Docker Compose** (for containerized setup)
- **Node.js** (for running the React app without Docker)
- **Composer** (for running the Laravel app without Docker)
- **Git** (for cloning the repository)

---

## Setup Instructions

### Using Docker (Recommended)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/innoscripta.git
   
   cd innoscripta
   ```

2. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

3. Access the applications:
   - **Laravel Backend**: `http://localhost:8000`
   - **React Frontend**: `http://localhost:3000`
`

---

### Without Docker
#### Backend (Laravel)
1. Navigate to the `backend-news` directory:
   ```bash
   cd backend-news
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Copy the `.env.example` file to `.env` and update the database configuration:
   ```bash
   cp .env.example .env
   ```

4. Generate an application key:
   ```bash
   php artisan key:generate
   ```

5. Run migrations:
   ```bash
   php artisan migrate
   ```

6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

#### Frontend (React)
1. Navigate to the `frontend-news` directory:
   ```bash
   cd frontend-news
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

4. Access the React app at `http://localhost:3000`.

---

## Environment Variables
### Backend (Laravel)
Update the `.env` file in the `backend-news` directory with the following:
```env
DB_HOST=mysql
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=secret
```

### Frontend (React)
The backend URL is configured in `frontend-news/src/config/config.ts`. Update the `APP_BASE_URL` variable in this file to point to your Laravel backend:

```typescript
export const APP_BASE_URL = "http://localhost:8000";
```

This variable is used throughout the React app to make API calls to the backend.

---


Here’s the updated **API Endpoints** section for your `README.md` file, based on the provided routes:

---

## API Endpoints
The Laravel backend exposes the following API endpoints:

### Authentication Endpoints
- `POST /api/v1/login` - User login (`V1\AuthController@login`).
- `POST /api/v1/logout` - User logout (`V1\AuthController@logout`).
- `POST /api/v1/register` - User registration (`V1\AuthController@register`).
- `GET /api/v1/user` - Fetch authenticated user details (`V1\AuthController@user`).

### News Endpoints
- `GET /api/v1/articles` - Search news articles (`V1\NewsController@search`).
- `GET /api/v1/personalized-feed` - Fetch personalized news feed (`V1\NewsController@personalizedFeed`).

### Filter Endpoints
- `GET /api/v1/filters/authors` - Fetch available authors (`V1\FilterController@authors`).
- `GET /api/v1/filters/categories` - Fetch available categories (`V1\FilterController@categories`).
- `GET /api/v1/filters/sources` - Fetch available sources (`V1\FilterController@sources`).

### User Preferences Endpoints
- `GET /api/v1/user/preferences` - Fetch user preferences (`V1\UserPreferenceController@show`).
- `POST /api/v1/user/preferences` - Update user preferences (`V1\UserPreferenceController@update`).

---

## API Documentation

The API documentation is available at:  

🔗 [http://localhost:8000/docs](http://localhost:8000/docs)  

Visit this URL to explore the available endpoints, request structures, and response formats.


---

## Running Migrations
Migrations are automatically run when the Docker containers start. To manually run migrations, use:
```bash
docker-compose exec backend php artisan migrate
```

---

## Frontend-Backend Communication
The React frontend communicates with the Laravel backend using the `APP_BASE_URL` environment variable. Ensure this variable is set correctly in the `.env` file.

Example API call in React:
```javascript
fetch(`${process.env.APP_BASE_URL}/api/v1/news`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

---

## Troubleshooting
1. **Docker Build Fails**:
   - Ensure Docker is running and your internet connection is stable.
   - Retry the build command: `docker-compose up --build`.

2. **CORS Issues**:
   - Verify that the `config/cors.php` file in the Laravel backend allows requests from `http://localhost:3000`.

3. **Database Connection Issues**:
   - Ensure the database credentials in the `.env` file are correct.
   - Check if the MySQL container is running: `docker-compose ps`.

---