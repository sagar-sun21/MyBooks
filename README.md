# MyBooks - Book Management Application

A modern book management application built with Laravel, Inertia.js, React, and Tailwind CSS.

## Features

- **User Authentication**: Complete auth system with login, registration, and password reset
- **Book Management**: Full CRUD operations for managing your personal book library
- **Book Status Tracking**: Mark books as read or unread with quick toggle
- **Rating System**: Rate books with an interactive 1-5 star rating
- **Categories & Genres**: Organize books by predefined categories
- **Search & Filter**: Search by title, author, or ISBN; filter by category, status, and rating
- **Image Upload**: Upload book cover images with validation and thumbnail support
- **Statistics Dashboard**: View your reading statistics and books by category
- **Responsive Design**: Mobile-first design that works on all devices
- **Soft Deletes**: Safely delete books with the ability to restore

## Tech Stack

- **Backend**: Laravel 10+
- **Frontend**: React 18 with Inertia.js
- **Styling**: Tailwind CSS 3
- **Database**: MySQL
- **Authentication**: Laravel Breeze
- **File Storage**: Laravel Storage with public disk

## Requirements

- PHP >= 8.1
- Composer
- Node.js >= 16.x
- NPM or Yarn
- MySQL >= 5.7 or MariaDB >= 10.3

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sagar-sun21/MyBooks.git
cd MyBooks
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 5. Database Configuration

Update your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mybooks
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Create the database:

```bash
mysql -u your_username -p
CREATE DATABASE mybooks;
exit;
```

### 6. Run Migrations and Seeders

```bash
php artisan migrate --seed
```

This will create all necessary tables and seed the categories table with predefined book categories.

### 7. Create Storage Link

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public` for serving uploaded images.

### 8. Build Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

### 9. Start the Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

## Default Categories

The application comes pre-seeded with the following book categories:

- Fiction, Non-Fiction, Science Fiction, Fantasy
- Mystery, Thriller, Romance, Horror
- Biography, Autobiography, History, Science
- Technology, Self-Help, Business, Philosophy
- Psychology, Poetry, Drama, Children
- Young Adult, Graphic Novel, Comics, Cookbook
- Travel, Art, Music, Sports
- Religion, Spirituality

## Usage

### Creating a Book

1. Navigate to the Books page
2. Click "Add New Book"
3. Fill in the book details:
   - Title (required)
   - Author (required)
   - ISBN (optional)
   - Description (optional)
   - Category (optional)
   - Cover Image (optional, max 2MB)
   - Read Status (checkbox)
   - Rating (1-5 stars, optional)
   - Personal Notes (optional)
4. Click "Save Book"

### Managing Books

- **View All Books**: Grid or list view with thumbnails
- **Search**: Use the search bar to find books by title, author, or ISBN
- **Filter**: Filter by category, read status, or rating
- **Edit**: Click on a book card to view details, then edit
- **Delete**: Delete books with confirmation (soft delete)
- **Toggle Status**: Quick toggle between read/unread status

### Dashboard

View your reading statistics:
- Total number of books
- Books read vs unread
- Average rating
- Books by category distribution

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── BookController.php
│   │   └── CategoryController.php
│   ├── Requests/
│   │   ├── StoreBookRequest.php
│   │   └── UpdateBookRequest.php
│   └── Resources/
│       └── BookResource.php
├── Models/
│   ├── Book.php
│   └── Category.php
└── Policies/
    └── BookPolicy.php

database/
├── migrations/
│   ├── xxxx_create_categories_table.php
│   └── xxxx_create_books_table.php
└── seeders/
    └── CategorySeeder.php

resources/
├── js/
│   ├── Components/
│   │   ├── BookCard.jsx
│   │   ├── BookForm.jsx
│   │   ├── StarRating.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterDropdown.jsx
│   │   ├── ImageUpload.jsx
│   │   └── ConfirmationModal.jsx
│   ├── Layouts/
│   │   ├── AuthenticatedLayout.jsx
│   │   └── GuestLayout.jsx
│   └── Pages/
│       ├── Dashboard.jsx
│       └── Books/
│           ├── Index.jsx
│           ├── Create.jsx
│           ├── Edit.jsx
│           └── Show.jsx
└── css/
    └── app.css
```

## Deployment

### Shared Hosting Deployment

1. **Build for Production**:
   ```bash
   npm run build
   composer install --optimize-autoloader --no-dev
   ```

2. **Environment Configuration**:
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Generate a new `APP_KEY`

3. **Database Setup**:
   ```bash
   php artisan migrate --force --seed
   php artisan storage:link
   ```

4. **File Permissions**:
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

5. **Apache Configuration**:
   The `.htaccess` file in the `public` directory is already configured for Apache.

### Required PHP Extensions

- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML

## API Endpoints

All routes are protected by authentication middleware:

- `GET /books` - List all books (with search & filters)
- `POST /books` - Create a new book
- `GET /books/create` - Show create book form
- `GET /books/{book}` - Show book details
- `GET /books/{book}/edit` - Show edit book form
- `PUT/PATCH /books/{book}` - Update a book
- `DELETE /books/{book}` - Delete a book
- `POST /books/{book}/toggle-read` - Toggle read status
- `GET /api/categories` - Get all categories

## Security

- All routes are protected by authentication
- Users can only view and manage their own books (enforced by BookPolicy)
- Image uploads are validated for type and size
- CSRF protection on all forms
- SQL injection protection through Eloquent ORM
- XSS protection through React escaping

## Troubleshooting

### Images not displaying

```bash
php artisan storage:link
chmod -R 755 storage
```

### Permission errors

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Database connection errors

- Check your `.env` file database credentials
- Ensure MySQL service is running
- Verify database exists

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For support, email sagar.sun21@example.com or open an issue in the GitHub repository.

## Acknowledgments

- Laravel Framework
- Inertia.js
- React
- Tailwind CSS
- Laravel Breeze

---

Built with ❤️ by Sagar Sun
