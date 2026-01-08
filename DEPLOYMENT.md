# MyBooks - Deployment Guide

This guide provides detailed instructions for deploying the MyBooks application to various environments.

## Prerequisites

Before deploying, ensure you have:
- PHP >= 8.1
- Composer
- Node.js >= 16.x
- MySQL >= 5.7 or MariaDB >= 10.3
- Apache or Nginx web server

## Deployment Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/sagar-sun21/MyBooks.git
cd MyBooks

# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install JavaScript dependencies
npm install
```

### 2. Environment Configuration

```bash
# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Edit .env file with your settings
nano .env
```

Update these critical values in `.env`:
```env
APP_NAME=MyBooks
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_DATABASE=mybooks
DB_USERNAME=your_database_user
DB_PASSWORD=your_secure_password

FILESYSTEM_DISK=public
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE mybooks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Run migrations and seeders
php artisan migrate --force
php artisan db:seed --class=CategorySeeder --force
```

### 4. Storage Configuration

```bash
# Create storage link
php artisan storage:link

# Set permissions
chmod -R 755 storage bootstrap/cache
```

### 5. Build Frontend Assets

```bash
# Build for production
npm run build

# Clean up development files (optional)
rm -rf node_modules
rm package-lock.json
```

### 6. Optimize for Production

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache
```

## Shared Hosting Deployment

### File Structure for Shared Hosting

Most shared hosting requires files in `public_html` or similar:

```bash
# Move public folder contents to public_html
mv public/* public_html/

# Update paths in public_html/index.php
# Change:
require __DIR__.'/../vendor/autoload.php';
# To:
require __DIR__.'/vendor/autoload.php';

# Change:
$app = require_once __DIR__.'/../bootstrap/app.php';
# To:
$app = require_once __DIR__.'/bootstrap/app.php';
```

### .htaccess Configuration

The included `.htaccess` file should work for most Apache setups. If needed, here's a complete version:

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

### File Permissions

```bash
# Set proper permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Storage and cache need write permissions
chmod -R 775 storage bootstrap/cache
```

## Nginx Configuration

If using Nginx, add this server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/mybooks/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-apache

# Generate certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

Update `.env`:
```env
APP_URL=https://yourdomain.com
SESSION_SECURE_COOKIE=true
```

## Post-Deployment Verification

### 1. Check Application
- Visit your domain
- Verify the welcome page loads
- Try registering a new user
- Test login functionality

### 2. Test Core Features
- Create a new book
- Upload a book cover image
- Search for books
- Filter by category
- Test pagination

### 3. Verify Security
- Ensure HTTPS is working
- Check file permissions
- Verify database credentials are secure
- Test CSRF protection

## Troubleshooting

### Issue: 500 Internal Server Error

**Solution:**
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Check Apache error logs
tail -f /var/log/apache2/error.log

# Ensure permissions are correct
chmod -R 755 storage bootstrap/cache
```

### Issue: Images Not Displaying

**Solution:**
```bash
# Recreate storage link
rm public/storage
php artisan storage:link

# Check permissions
chmod -R 755 storage/app/public
```

### Issue: CSS/JS Not Loading

**Solution:**
```bash
# Rebuild assets
npm run build

# Clear cache
php artisan cache:clear
php artisan view:clear
```

### Issue: Database Connection Error

**Solution:**
- Verify database credentials in `.env`
- Ensure MySQL service is running
- Check database exists
- Verify user has proper permissions

## Maintenance

### Regular Tasks

```bash
# Update dependencies (periodically)
composer update
npm update
npm run build

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations (after updates)
php artisan migrate --force

# Optimize
php artisan optimize
```

### Backup

```bash
# Backup database
mysqldump -u username -p mybooks > backup_$(date +%Y%m%d).sql

# Backup uploaded files
tar -czf storage_backup_$(date +%Y%m%d).tar.gz storage/app/public
```

## Monitoring

### Log Files
- Application logs: `storage/logs/laravel.log`
- Web server logs: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`

### Performance
```bash
# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
```

## Scaling

### Database Optimization
```sql
-- Add indexes for frequently queried columns
ALTER TABLE books ADD INDEX idx_user_id (user_id);
ALTER TABLE books ADD INDEX idx_category_id (category_id);
ALTER TABLE books ADD INDEX idx_is_read (is_read);
```

### Caching
```bash
# Use Redis for sessions and cache
# Update .env:
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Queue Workers
```bash
# For background jobs
php artisan queue:work --daemon

# Set up supervisor for production
# /etc/supervisor/conf.d/mybooks.conf
[program:mybooks-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/mybooks/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/mybooks/storage/logs/worker.log
```

## Security Checklist

- [ ] APP_DEBUG=false in production
- [ ] Strong APP_KEY generated
- [ ] Database credentials secured
- [ ] HTTPS/SSL enabled
- [ ] File permissions set correctly (755/644)
- [ ] .env file not accessible via web
- [ ] Regular backups configured
- [ ] Error reporting to logs only
- [ ] Security headers configured
- [ ] Firewall configured (if applicable)

## Support

For issues or questions:
- GitHub: https://github.com/sagar-sun21/MyBooks
- Email: sagar.sun21@example.com

---

**Deployment Status**: Production-ready
**Last Updated**: January 2026
