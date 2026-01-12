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

## Automated Deployment with GitHub Actions

MyBooks includes a single, optimized GitHub Actions workflow that automatically deploys your application to shared hosting via FTP when you push code to the main branch.

### Overview

**Single Workflow Approach:**
- The `deploy.yml` workflow is designed for shared hosting without SSH access
- Files are deployed via FTP using `SamKirkland/FTP-Deploy-Action@v4.3.5`
- The `vendor` folder is **excluded** from upload for faster deployments
- Manual post-deployment steps are required to install dependencies and run Laravel commands

**Why Vendor Folder Is Excluded:**
- Uploading `vendor` folder via FTP = 10-30 minutes (5,000+ files)
- Running `composer install` on server = 30-60 seconds
- **Result: 90% faster deployments!**

**What Gets Deployed:**
- All application code
- Built assets in `public/build/` (from `npm run build`)
- Configuration files
- Database migrations and seeders

**What Doesn't Get Deployed:**
- `vendor/` - Composer dependencies (installed on server)
- `node_modules/` - NPM dependencies (not needed, assets are built)
- `.git/` - Git repository files
- `tests/` - Test files
- `.env` - Environment file (must exist on server)
- `.github/` - GitHub Actions workflows
- Cache and log files in `storage/`

### Quick Setup Guide

#### Step 1: Add GitHub Secrets

1. Go to: https://github.com/sagar-sun21/MyBooks/settings/secrets/actions
2. Click "New repository secret"
3. Add these four secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_SERVER` | FTP server hostname | `ftp.yourdomain.com` |
| `FTP_USERNAME` | FTP username | `username@yourdomain.com` |
| `FTP_PASSWORD` | FTP password | `your_ftp_password` |
| `FTP_SERVER_DIR` | Remote directory path | `/public_html/mybooks/` or `/home/username/laravel/` |

**Important:** Ensure `FTP_SERVER_DIR` ends with a trailing slash `/`

#### Step 2: Push to Main Branch

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The workflow will trigger automatically and:
1. Set up PHP 8.1 with required extensions
2. Set up Node.js 20 with npm cache
3. Install NPM dependencies with `npm ci`
4. Build production assets with `npm run build`
5. Deploy files via FTP (excluding vendor, node_modules, etc.)

#### Step 3: Monitor Deployment

1. Go to: https://github.com/sagar-sun21/MyBooks/actions
2. Click on the latest workflow run
3. Watch the deployment progress (~2-3 minutes)
4. Green checkmark = successful deployment
5. Red X = failed (check logs for errors)

#### Step 4: Run Post-Deployment Commands

**CRITICAL:** After deployment completes, you must run these commands on your server.

Choose one of three options:

**Option A: Via cPanel Terminal (Recommended)**

1. Log into cPanel
2. Go to "Terminal" or "Advanced → Terminal"
3. Navigate to your Laravel directory:
   ```bash
   cd public_html/mybooks  # or your path
   ```
4. Run the commands below

**Option B: Via SSH (if available)**

```bash
ssh username@yourdomain.com
cd /home/username/laravel  # or your path
# Run commands below
```

**Option C: Create a Deployment Script**

Create a file `deploy.php` in your Laravel root directory:

```php
<?php
// deploy.php - Run post-deployment tasks
// IMPORTANT: Delete this file after use or protect it with a secret token

$commands = [
    'composer install --optimize-autoloader --no-dev 2>&1',
    'php artisan migrate --force 2>&1',
    'php artisan optimize:clear 2>&1',
    'php artisan config:cache 2>&1',
    'php artisan route:cache 2>&1',
    'php artisan view:cache 2>&1',
];

echo "<pre>";
foreach ($commands as $command) {
    echo "\n" . str_repeat('=', 50) . "\n";
    echo "Running: $command\n";
    echo str_repeat('=', 50) . "\n";
    passthru($command);
}
echo "</pre>";

echo "\n\n✅ Deployment tasks completed!\n";
echo "⚠️  REMEMBER TO DELETE THIS FILE NOW!\n";
```

Then visit: `https://yourdomain.com/deploy.php` after each deployment.

**⚠️ SECURITY WARNING:** Delete `deploy.php` immediately after use!

**Required Commands:**

```bash
# 1. Install Composer dependencies (CRITICAL - vendor folder not uploaded)
composer install --optimize-autoloader --no-dev

# 2. Run database migrations
php artisan migrate --force

# 3. Clear all caches
php artisan optimize:clear

# 4. Build optimized caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Create storage link (first deployment only)
php artisan storage:link
```

### Why This Approach?

**Faster Deployments:**
- Traditional FTP upload of `vendor` folder with 5,000+ files takes 10-30 minutes
- Running `composer install` on the server takes only 30-60 seconds
- **90% faster deployment times!**

**Other Excluded Folders:**
- `node_modules` - Not needed; built assets are in `public/build/`
- `.git` - Not needed on production server
- `tests` - Not needed on production server
- Cache and log files - Generated fresh on server

**Rsync-like Behavior:**
- Only changed files are uploaded
- Unchanged files are skipped
- Keeps deployments fast after the first upload

### First Deployment Checklist

**Before First Deployment:**

- [ ] Add all four GitHub Secrets (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR`)
- [ ] Ensure FTP credentials are correct and tested
- [ ] Verify `FTP_SERVER_DIR` path exists on your server
- [ ] Create `.env` file on server manually (copy from `.env.example`)
- [ ] Update `.env` with production settings:
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_URL=https://yourdomain.com`
- [ ] Create database and user via cPanel
- [ ] Update `.env` with database credentials
- [ ] Run `php artisan key:generate` on server
- [ ] Set proper permissions on `storage/` and `bootstrap/cache/` (775)
- [ ] Configure document root to point to `public/` directory
- [ ] Set up SSL certificate (Let's Encrypt recommended)

**After First Deployment:**

- [ ] Verify files uploaded successfully
- [ ] Check that `public/build/` directory exists with assets
- [ ] Run `composer install --optimize-autoloader --no-dev` on server
- [ ] Run `php artisan migrate --force` to create database tables
- [ ] Run `php artisan db:seed --class=CategorySeeder` to seed categories
- [ ] Run `php artisan storage:link` to create storage symlink
- [ ] Verify storage symlink: `ls -la public/storage`
- [ ] Clear and rebuild caches:
  ```bash
  php artisan optimize:clear
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  ```
- [ ] Test application in browser
- [ ] Register a test account
- [ ] Try creating a book with image upload
- [ ] Verify all features work correctly

### Subsequent Deployments

After each push to main branch:

1. **GitHub Actions runs automatically** (2-3 minutes)
   - Builds frontend assets
   - Uploads changed files via FTP
   
2. **Run commands on server** (choose one option):
   - Via cPanel Terminal
   - Via SSH
   - Using the `deploy.php` script
   
3. **Required commands:**
   ```bash
   # Always run if composer.json or composer.lock changed
   composer install --optimize-autoloader --no-dev
   
   # Always run if database migrations added
   php artisan migrate --force
   
   # Always run to refresh caches
   php artisan optimize:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

**Quick Post-Deployment:**
If you know nothing changed in dependencies or database, you can run just:
```bash
php artisan optimize:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

### Monitoring Deployments

**View Deployment Status:**
1. Go to: https://github.com/sagar-sun21/MyBooks/actions
2. Click on the latest workflow run
3. View each step's progress and logs

**Deployment Steps:**
- ✓ Checkout code
- ✓ Setup PHP 8.1
- ✓ Setup Node.js 20
- ✓ Install NPM dependencies
- ✓ Build production assets
- ✓ Deploy via FTP
- ✓ Post-deployment instructions

**Interpreting Results:**
- 🟢 Green checkmark = Deployment successful
- 🔴 Red X = Deployment failed (click to see error logs)
- 🟡 Yellow circle = Deployment in progress

**Check Logs:**
- Click on any step to see detailed logs
- "Deploy via FTP" step shows which files were uploaded
- "Post-deployment instructions" reminds you of manual steps

### Troubleshooting

#### FTP Connection Failed

```
Error: Cannot connect to FTP server
```

**Solutions:**
- Verify `FTP_SERVER` is correct (e.g., `ftp.yourdomain.com`)
- Check that FTP port 21 is not blocked
- Ensure FTP is enabled in cPanel (cPanel → FTP Accounts)
- Try passive mode: Contact hosting if active mode fails
- Check firewall: Some hosts block GitHub Actions IPs
- Verify `FTP_USERNAME` and `FTP_PASSWORD` are correct

#### Files Not Updating on Server

```
Deployment succeeds but changes don't appear
```

**Solutions:**
- Check `FTP_SERVER_DIR` path is correct and ends with `/`
- Verify FTP user has write permissions to the directory
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Run `php artisan optimize:clear` on server
- Check if files were actually uploaded in workflow logs
- Verify you're checking the correct domain/subdomain

#### 500 Internal Server Error After Deployment

```
Website shows 500 error after deployment
```

**Solutions:**
1. **Run composer install** (most common cause):
   ```bash
   composer install --optimize-autoloader --no-dev
   ```
   
2. **Check .env file exists** and is configured:
   ```bash
   ls -la .env
   cat .env  # Verify APP_KEY is set
   ```
   
3. **Verify APP_KEY is set**:
   ```bash
   php artisan key:generate
   ```
   
4. **Check file permissions**:
   ```bash
   chmod -R 775 storage
   chmod -R 775 bootstrap/cache
   find storage -type f -exec chmod 644 {} \;
   find storage -type d -exec chmod 755 {} \;
   ```
   
5. **Check error logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```
   
6. **Clear all caches**:
   ```bash
   php artisan optimize:clear
   ```

#### Composer Not Found on Server

```
bash: composer: command not found
```

**Solutions:**
- Check if Composer is installed: `composer --version`
- Use full path: `/usr/local/bin/composer install --optimize-autoloader --no-dev`
- Use composer.phar: `php composer.phar install --optimize-autoloader --no-dev`
- Download Composer:
  ```bash
  curl -sS https://getcomposer.org/installer | php
  php composer.phar install --optimize-autoloader --no-dev
  ```
- Contact hosting support to install Composer system-wide
- Some hosts have it at: `/opt/cpanel/composer/bin/composer`

#### Assets (CSS/JS) Not Loading

```
404 Not Found on /build/assets/app-*.js
```

**Solutions:**
- Verify `npm run build` completed in workflow logs
- Check `public/build/` directory exists on server
- Verify `public/build/manifest.json` exists
- Check `APP_URL` in `.env` matches your domain
- Clear browser cache completely
- Check web server serves static files from `public/`

#### Database Migration Fails

```
Error: SQLSTATE[HY000] [2002] Connection refused
```

**Solutions:**
- Verify database credentials in `.env` are correct
- Check database and user exist in cPanel → MySQL Databases
- Ensure database user has all privileges on the database
- Verify `DB_HOST` is usually `localhost` on shared hosting
- Test database connection:
  ```bash
  php artisan tinker
  DB::connection()->getPdo();
  ```

#### Permission Denied Errors

```
Error: The stream or file "storage/logs/laravel.log" could not be opened
```

**Solutions:**
```bash
# Fix storage permissions
chmod -R 775 storage
find storage -type f -exec chmod 644 {} \;
find storage -type d -exec chmod 755 {} \;

# Fix bootstrap/cache permissions
chmod -R 775 bootstrap/cache
find bootstrap/cache -type f -exec chmod 644 {} \;
find bootstrap/cache -type d -exec chmod 755 {} \;

# Ensure correct ownership (if you have access)
chown -R username:username storage
chown -R username:username bootstrap/cache
```

If permissions reset after each deployment, contact hosting support.

#### Workflow Fails to Trigger

**Solutions:**
- Verify you pushed to `main` branch (not `master` or other)
- Check GitHub Actions is enabled: Settings → Actions → General
- Verify workflow file has no YAML syntax errors
- Check you have push access to the repository

#### Build Assets Fails in Workflow

```
Error: npm run build failed
```

**Solutions:**
- Check `package.json` has `"build": "vite build"` script
- Verify `vite.config.js` exists and is valid
- Check Node.js version compatibility
- Review build error logs in workflow output
- Test build locally: `npm install && npm run build`

### Security Notes

#### Protecting Your Credentials

1. **Never commit `.env`** to GitHub
   - The `.env` file contains sensitive credentials
   - Always keep it in `.gitignore`
   - Create `.env` manually on server

2. **Protect GitHub Secrets**
   - Only repository admins should have access
   - Secrets are encrypted and never exposed in logs
   - Rotate FTP password periodically

3. **Delete deploy.php immediately**
   - If using the deploy.php script approach
   - Or protect it with a secret token
   - Never leave it accessible after deployment

4. **Use strong FTP password**
   - At least 16 characters
   - Mix of letters, numbers, symbols
   - Store securely in GitHub Secrets
   - Don't reuse passwords

5. **Keep .env secure on server**
   - Set permissions to 644: `chmod 644 .env`
   - Only readable by web server user
   - Never accessible via web browser

#### Production Security Best Practices

1. **Environment Configuration:**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com
   SESSION_SECURE_COOKIE=true
   ```

2. **Use HTTPS:**
   - Install SSL certificate (Let's Encrypt is free)
   - Force HTTPS in `.htaccess`
   - Set `SESSION_SECURE_COOKIE=true`

3. **File Permissions:**
   - Directories: 755 (rwxr-xr-x)
   - Files: 644 (rw-r--r--)
   - Storage: 775 (rwxrwxr-x)
   - .env: 644 (rw-r--r--)

4. **Keep Updated:**
   - Update Laravel regularly
   - Update Composer dependencies
   - Update npm packages
   - Monitor security advisories

5. **Disable Directory Listing:**
   - Ensure `Options -Indexes` in `.htaccess`
   - Web server should not list directory contents

### Performance Tips

**Deployment Speed:**
- First deployment: ~3-5 minutes (all files uploaded)
- Subsequent deployments: ~1-2 minutes (only changed files)
- Most time spent uploading `public/build` assets
- Consider using SFTP if available (more secure and often faster)

**Optimization Commands:**
After deployment, these commands improve performance:
```bash
# Creates optimized class loader
composer install --optimize-autoloader --no-dev

# Caches configuration (faster config access)
php artisan config:cache

# Caches routes (faster routing)
php artisan route:cache

# Caches views (faster view rendering)
php artisan view:cache

# Enables OPcache if available
# Check php.ini: opcache.enable=1
```

**Additional Performance Tips:**
- Enable OPcache in PHP (ask hosting to enable)
- Use Redis or Memcached for caching (if available)
- Enable Gzip compression in `.htaccess`
- Optimize images before uploading
- Use CDN for static assets (advanced)

**Monitoring Performance:**
- Check `storage/logs/laravel.log` for slow queries
- Monitor database query count
- Use Laravel Telescope for detailed debugging (development only)

---

**Ready to deploy?** Follow the Quick Setup Guide above and automate your deployments!

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
