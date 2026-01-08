# MyBooks Deployment Guide

## Shared Hosting Deployment

This guide will help you deploy the MyBooks application to shared hosting providers like cPanel, Plesk, or similar environments.

### Prerequisites

Before deployment, ensure your hosting account has:
- PHP 8.1 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Composer (may need to be installed)
- SSH access (recommended but not required)
- Node.js and npm (for building assets)

### Required PHP Extensions

Verify these PHP extensions are enabled:
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
- GD or Imagick (for image processing)

### Step 1: Prepare Your Application

On your local machine:

```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# Build production assets
npm run build

# Create a zip file of your application
# Exclude: node_modules, vendor, .env, .git
```

### Step 2: Upload Files

#### Option A: Using FTP/SFTP
1. Connect to your hosting via FTP/SFTP
2. Upload all files EXCEPT `node_modules` and `.git` folders
3. Place Laravel files in a directory (e.g., `/home/username/laravel`)
4. The `public` directory should be your document root

#### Option B: Using File Manager
1. Log into cPanel or your hosting control panel
2. Navigate to File Manager
3. Upload the zip file
4. Extract it in the appropriate location

### Step 3: Configure Document Root

Your hosting's document root should point to Laravel's `public` directory:

**cPanel:**
1. Go to "Domains" or "Addon Domains"
2. Set document root to `/home/username/laravel/public`

**Alternative (if you can't change document root):**
Move contents of `public` directory to your public_html:
```bash
mv public/* public_html/
mv public/.htaccess public_html/
```

Then edit `public_html/index.php`:
```php
require __DIR__.'/../laravel/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel/bootstrap/app.php';
```

### Step 4: Install Composer Dependencies

If you have SSH access:
```bash
cd /home/username/laravel
composer install --optimize-autoloader --no-dev
```

Without SSH access:
- Upload the `vendor` folder along with your application
- Or use PHP Composer installer script

### Step 5: Set Up Environment File

1. Copy `.env.example` to `.env`
2. Edit `.env` with your hosting details:

```env
APP_NAME=MyBooks
APP_ENV=production
APP_KEY=  # Will generate in next step
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost  # Usually localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true

FILESYSTEM_DISK=public
```

### Step 6: Generate Application Key

With SSH:
```bash
php artisan key:generate
```

Without SSH:
Use Laravel's key generator online or run locally and copy the key to `.env`

### Step 7: Set Up Database

#### Using cPanel phpMyAdmin:
1. Create a new database
2. Create a database user
3. Assign user to database with all privileges
4. Note the database name, username, and password for `.env`

#### Run Migrations:
With SSH:
```bash
php artisan migrate --force
php artisan db:seed --class=CategorySeeder
```

Without SSH:
- Use phpMyAdmin to import SQL dump
- Or use a migration tool like [Laravel Deployer](https://deployer.org)

### Step 8: Configure Storage

```bash
# Create symbolic link for storage
php artisan storage:link
```

Without SSH, manually create a symlink or use:
```php
<?php
// create-storage-link.php in public directory
symlink(__DIR__.'/../storage/app/public', __DIR__.'/storage');
echo "Storage link created!";
```

Visit `yourdomain.com/create-storage-link.php` then delete the file.

### Step 9: Set Permissions

Ensure these directories are writable (755 or 775):
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Step 10: Optimize Laravel

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache
```

### Step 11: Configure .htaccess

Ensure `public/.htaccess` exists with:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### Step 12: Configure SSL

1. In cPanel, go to "SSL/TLS"
2. Install or activate Let's Encrypt SSL certificate
3. Update `APP_URL` in `.env` to use `https://`

### Step 13: Test Your Application

1. Visit your domain
2. Register a new account
3. Try adding a book
4. Test file upload functionality
5. Verify all pages load correctly

### Troubleshooting

#### 500 Internal Server Error
- Check `.env` file exists and is configured
- Verify `APP_KEY` is set
- Check file permissions (755 for directories, 644 for files)
- Check error logs in `storage/logs/laravel.log`

#### Database Connection Error
- Verify database credentials in `.env`
- Ensure database user has proper privileges
- Check `DB_HOST` (usually `localhost` on shared hosting)

#### Images Not Uploading
- Verify `storage/app/public/covers` directory exists
- Check storage link is created
- Verify directory permissions (775)
- Check PHP upload limits in `php.ini`:
  ```
  upload_max_filesize = 10M
  post_max_size = 10M
  ```

#### White Screen / Blank Page
- Enable debug mode temporarily: `APP_DEBUG=true` in `.env`
- Check error logs
- Clear all caches: `php artisan optimize:clear`

#### Assets Not Loading
- Ensure you ran `npm run build` before deployment
- Verify `public/build` directory exists
- Check `APP_URL` in `.env` matches your domain

#### Permission Denied Errors
```bash
# Fix permissions
find storage -type f -exec chmod 644 {} \;
find storage -type d -exec chmod 755 {} \;
find bootstrap/cache -type f -exec chmod 644 {} \;
find bootstrap/cache -type d -exec chmod 755 {} \;
```

### Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Can register and login
- [ ] Can create, edit, and delete books
- [ ] Images upload successfully
- [ ] Search and filters work
- [ ] Dashboard shows statistics
- [ ] Email functionality works (if configured)
- [ ] SSL certificate is active
- [ ] Debug mode is disabled (`APP_DEBUG=false`)
- [ ] Cache is optimized

### Updating Your Application

For future updates:

1. Take a backup of your database
2. Take a backup of your `.env` file
3. Upload new files (excluding `.env`, `vendor`, `node_modules`)
4. Run migrations:
   ```bash
   php artisan migrate --force
   ```
5. Clear and rebuild caches:
   ```bash
   php artisan optimize:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Performance Optimization

#### Enable OPcache
Add to `php.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
```

#### Use Redis/Memcached
If available on your hosting:
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

#### Enable Gzip Compression
Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### Security Best Practices

1. **Never commit `.env`** to version control
2. **Keep debug mode off** in production
3. **Use HTTPS** always
4. **Keep Laravel updated** regularly
5. **Use strong database passwords**
6. **Restrict directory permissions** properly
7. **Enable CSRF protection** (enabled by default)
8. **Validate all user inputs** (handled by form requests)

### Getting Help

If you encounter issues:
1. Check Laravel error logs in `storage/logs/`
2. Enable debug mode temporarily to see detailed errors
3. Consult Laravel documentation: https://laravel.com/docs
4. Open an issue on GitHub repository
5. Contact your hosting provider's support

### Useful Commands Reference

```bash
# Clear all caches
php artisan optimize:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --class=CategorySeeder

# Generate app key
php artisan key:generate

# Create storage link
php artisan storage:link

# Check Laravel version
php artisan --version

# List all routes
php artisan route:list
```

---

**Need more help?** Check the main README.md or open an issue on GitHub.
