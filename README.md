# MyBooks - Book Management Application

A modern, full-featured book management application built with Laravel 10, Inertia.js, and React. Keep track of your personal library, rate books, manage reading status, and organize your collection by categories.

![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?logo=laravel)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Inertia.js](https://img.shields.io/badge/Inertia.js-1.x-9553E9)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)

## Features

### 📚 Complete Book Management
- **CRUD Operations**: Create, read, update, and delete books from your collection
- **Book Details**: Store title, author, ISBN, description, category, and personal notes
- **Cover Images**: Upload and display book cover images
- **Rating System**: Rate books from 1 to 5 stars with an interactive star rating component
- **Read Status**: Toggle between "Read" and "Unread" status with visual indicators

### 🔍 Search & Filter
- **Real-time Search**: Search books by title, author, or ISBN with debounced input
- **Category Filter**: Filter books by genre/category
- **Status Filter**: Filter by read/unread status
- **Rating Filter**: Filter by star rating
- **Combined Filters**: Apply multiple filters simultaneously

### 📊 Statistics Dashboard
- **Total Books**: View your complete collection count
- **Reading Progress**: Track books read vs. unread
- **Average Rating**: See your average book rating
- **Category Breakdown**: Visualize books by category
- **Quick Actions**: Fast access to add new books or view your library

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Mode**: Full dark mode support throughout the application
- **Interactive Components**: Smooth animations and transitions
- **Loading States**: Visual feedback for async operations
- **Toast Notifications**: Success and error messages via flash messages

### 🔐 Authentication & Authorization
- **User Registration**: Create new accounts
- **Login/Logout**: Secure authentication with Laravel Breeze
- **Protected Routes**: All book operations require authentication
- **User Isolation**: Users can only view and manage their own books
- **Policy-based Authorization**: Fine-grained access control

### 📱 Additional Features
- **Pagination**: Navigate large collections easily
- **Soft Deletes**: Books are soft-deleted for potential recovery
- **Image Validation**: Automatic validation of uploaded cover images
- **Responsive Grid**: Books displayed in beautiful card layout
- **Confirmation Modals**: Prevent accidental deletions

## Tech Stack

### Backend
- **Laravel 10.x**: PHP framework for web artisans
- **MySQL**: Relational database management
- **Laravel Breeze**: Minimal authentication scaffolding
- **Inertia.js Laravel Adapter**: Server-side routing meets client-side rendering

### Frontend
- **React 18.x**: Modern JavaScript library for building user interfaces
- **Inertia.js**: Create fully client-side rendered SPAs without building an API
- **Tailwind CSS 3.x**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components for React
- **Vite**: Next-generation frontend build tool

## Installation

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js >= 16.x and npm
- MySQL >= 5.7 or MariaDB >= 10.3

### Step 1: Clone the Repository
```bash
git clone https://github.com/sagar-sun21/MyBooks.git
cd MyBooks
```

### Step 2: Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### Step 3: Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Configure Database
Edit `.env` file and set your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mybooks
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

### Step 5: Run Migrations and Seeders
```bash
# Create database tables
php artisan migrate

# Seed categories (optional but recommended)
php artisan db:seed --class=CategorySeeder
```

### Step 6: Create Storage Link
```bash
# Create symbolic link for storage
php artisan storage:link
```

### Step 7: Build Assets
```bash
# For development (with hot reload)
npm run dev

# For production
npm run build
```

### Step 8: Start Development Server
```bash
# Start Laravel development server
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## Configuration

### File Upload Settings
The application allows uploading book cover images. Configure upload settings in `config/filesystems.php` if needed.

**Default Settings:**
- Maximum file size: 2MB
- Allowed formats: JPEG, PNG, JPG, GIF
- Storage location: `storage/app/public/covers`

### Categories
The application comes with pre-seeded categories. You can modify them by editing `database/seeders/CategorySeeder.php`:

- Fiction
- Non-Fiction
- Science
- History
- Biography
- Self-Help
- Technology
- Philosophy
- Psychology
- Business
- Romance
- Mystery
- Thriller
- Fantasy
- Science Fiction
- Horror
- Poetry
- Children
- Young Adult
- Cooking
- Travel
- Religion
- Art
- Health & Fitness

## Deployment

### Shared Hosting Deployment

#### 1. Build for Production
```bash
# Build optimized assets
npm run build

# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev
```

#### 2. Configure Environment
```bash
# Set production environment
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Set secure session settings
SESSION_SECURE_COOKIE=true
```

#### 3. Optimize Laravel
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache
```

#### 4. Set Permissions
```bash
# Set correct permissions for storage and cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

#### 5. Apache Configuration
Create or edit `.htaccess` in the public directory:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

#### 6. Required PHP Extensions
Ensure your hosting has these PHP extensions installed:
- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- PDO_MySQL
- Tokenizer
- XML

### VPS/Cloud Deployment
For VPS or cloud deployment (AWS, DigitalOcean, etc.), consider using:
- **Laravel Forge**: Automated server management
- **Laravel Vapor**: Serverless deployment on AWS
- **Docker**: Containerized deployment

## Usage

### Creating Your First Book
1. Register an account or log in
2. Click "Add New Book" from the dashboard or books page
3. Fill in the book details:
   - Title and Author (required)
   - ISBN (optional)
   - Description
   - Upload cover image
   - Select category
   - Mark as read (optional)
   - Add rating (optional)
   - Add personal notes (optional)
4. Click "Create Book"

### Managing Books
- **View All Books**: Navigate to the Books page from the menu
- **Search**: Use the search bar to find books by title, author, or ISBN
- **Filter**: Apply filters by category, status, or rating
- **Edit**: Click "Edit" on any book card or from the detail view
- **Delete**: Click "Delete" (requires confirmation)
- **Toggle Status**: Click "Mark Read/Unread" to update reading status

### Dashboard Statistics
The dashboard provides an overview of your collection:
- Total number of books
- Books you've read
- Books you haven't read yet
- Your average rating across all books
- Breakdown of books by category

## API Endpoints

While this is primarily an Inertia.js application, these routes are available:

### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /register` - Registration page
- `POST /register` - Register new user
- `POST /logout` - Logout user

### Books
- `GET /books` - List all books (with filters)
- `GET /books/create` - Show create form
- `POST /books` - Store new book
- `GET /books/{id}` - Show book details
- `GET /books/{id}/edit` - Show edit form
- PUT/PATCH /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book
- `PATCH /books/{id}/toggle-read` - Toggle read status

### Dashboard
- `GET /dashboard` - Dashboard with statistics

## Database Structure

### Users Table
- id
- name
- email (unique)
- email_verified_at
- password
- remember_token
- timestamps

### Categories Table
- id
- name
- slug (unique)
- timestamps

### Books Table
- id
- user_id (foreign key)
- category_id (foreign key, nullable)
- title
- author
- isbn (nullable)
- description (nullable)
- cover_image (nullable)
- is_read (boolean, default: false)
- rating (integer 1-5, nullable)
- notes (nullable)
- deleted_at (soft delete)
- timestamps

## Development

### Running Tests
```bash
# Run PHPUnit tests
php artisan test
```

### Code Formatting
```bash
# Format code with Laravel Pint
./vendor/bin/pint
```

### Development Commands
```bash
# Clear all caches
php artisan optimize:clear

# Run migrations with fresh database
php artisan migrate:fresh --seed

# Watch for file changes (Vite)
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Built with [Laravel](https://laravel.com)
- Frontend powered by [React](https://reactjs.org) and [Inertia.js](https://inertiajs.com)
- UI components from [Tailwind CSS](https://tailwindcss.com) and [Headless UI](https://headlessui.com)
- Authentication scaffolding by [Laravel Breeze](https://github.com/laravel/breeze)

---

**Made with ❤️ for book lovers**
