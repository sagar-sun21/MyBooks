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

MyBooks includes three GitHub Actions workflows to automatically deploy your application to shared hosting when you push code to the main branch. This eliminates manual deployment steps and ensures consistent deployments.

### Overview of Workflows

The repository includes three workflow files in `.github/workflows/`:

1. **deploy-ftp.yml** - FTP deployment with SSH post-deployment commands
2. **deploy-sftp.yml** - SFTP deployment with SSH post-deployment commands  
3. **deploy-no-ssh.yml** - FTP deployment without SSH (manual post-deployment steps)

All workflows automatically:
- Set up PHP 8.1 with required extensions
- Set up Node.js 20
- Install production Composer dependencies
- Install NPM dependencies
- Build production assets
- Deploy files to your hosting

### Choosing the Right Workflow

**Use `deploy-ftp.yml` if:**
- Your hosting provides FTP access
- You have SSH access for running post-deployment commands
- Most common for shared hosting like cPanel with SSH enabled

**Use `deploy-sftp.yml` if:**
- Your hosting provides SFTP (more secure than FTP)
- You have SSH access for running post-deployment commands
- Recommended for better security

**Use `deploy-no-ssh.yml` if:**
- Your hosting only provides FTP access
- You don't have SSH access
- You can run commands manually via cPanel Terminal or hosting control panel

### Setup Instructions

#### Step 1: Enable Your Chosen Workflow

Only one workflow should be active at a time. The other two should be disabled to prevent conflicts.

**Option A: Delete Unused Workflows**
```bash
# If using FTP with SSH, delete the others
rm .github/workflows/deploy-sftp.yml
rm .github/workflows/deploy-no-ssh.yml

# If using SFTP with SSH, delete the others
rm .github/workflows/deploy-ftp.yml
rm .github/workflows/deploy-no-ssh.yml

# If using FTP without SSH, delete the others
rm .github/workflows/deploy-ftp.yml
rm .github/workflows/deploy-sftp.yml
```

**Option B: Rename Unused Workflows**
```bash
# Rename to .yml.disabled to keep them for reference
mv .github/workflows/deploy-sftp.yml .github/workflows/deploy-sftp.yml.disabled
mv .github/workflows/deploy-no-ssh.yml .github/workflows/deploy-no-ssh.yml.disabled
```

#### Step 2: Add Repository Secrets

Navigate to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the required secrets based on your chosen workflow

#### Required Secrets for `deploy-ftp.yml`:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_SERVER` | FTP server hostname | `ftp.yourdomain.com` |
| `FTP_USERNAME` | FTP username | `username@yourdomain.com` |
| `FTP_PASSWORD` | FTP password | `your_ftp_password` |
| `FTP_SERVER_DIR` | Remote directory path | `/public_html/` or `/home/username/laravel/` |
| `SSH_HOST` | SSH server hostname | `yourdomain.com` or `123.45.67.89` |
| `SSH_USERNAME` | SSH username | `username` |
| `SSH_PASSWORD` | SSH password | `your_ssh_password` |
| `SSH_PORT` | SSH port | `22` (default) or custom port |
| `DEPLOY_PATH` | Full path to Laravel on server | `/home/username/laravel` |

#### Required Secrets for `deploy-sftp.yml`:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SFTP_SERVER` | SFTP server hostname | `sftp.yourdomain.com` |
| `SFTP_USERNAME` | SFTP username | `username` |
| `SFTP_PASSWORD` | SFTP password | `your_sftp_password` |
| `SFTP_PORT` | SFTP port | `22` (default) or custom port |
| `SFTP_REMOTE_PATH` | Remote directory path | `/home/username/laravel/` |
| `SSH_HOST` | SSH server hostname | `yourdomain.com` |
| `SSH_USERNAME` | SSH username | `username` |
| `SSH_PASSWORD` | SSH password | `your_ssh_password` |
| `SSH_PORT` | SSH port | `22` |
| `DEPLOY_PATH` | Full path to Laravel on server | `/home/username/laravel` |

#### Required Secrets for `deploy-no-ssh.yml`:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_SERVER` | FTP server hostname | `ftp.yourdomain.com` |
| `FTP_USERNAME` | FTP username | `username@yourdomain.com` |
| `FTP_PASSWORD` | FTP password | `your_ftp_password` |
| `FTP_SERVER_DIR` | Remote directory path | `/public_html/` or `/home/username/laravel/` |

#### Step 3: Trigger the Workflow

The workflow triggers automatically when you push to the `main` branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

#### Step 4: Monitor Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Click on the running workflow to see deployment progress
4. Check each step for success or errors

### Workflow Details

#### What Each Workflow Does:

**Build Phase (all workflows):**
1. Checks out your code from the repository
2. Sets up PHP 8.1 with required extensions (bcmath, ctype, fileinfo, json, mbstring, openssl, pdo, pdo_mysql, tokenizer, xml, gd)
3. Sets up Node.js 20 with npm caching
4. Installs Composer dependencies with production optimization flags:
   - `--optimize-autoloader` - Generates optimized class loader
   - `--no-dev` - Excludes development dependencies
   - `--no-interaction` - Non-interactive mode
   - `--prefer-dist` - Downloads distribution packages
5. Installs NPM dependencies using `npm ci` for deterministic builds
6. Builds production assets with `npm run build`

**Deploy Phase (FTP workflows):**
- Uploads files via FTP to your hosting server
- Excludes unnecessary files:
  - `.git*` - Git repository files
  - `node_modules/` - NPM dependencies
  - `.env` - Environment configuration (must be manually created on server)
  - `tests/` - Test files
  - `storage/logs/` - Log files
  - `storage/framework/cache/` - Cache files
  - `storage/framework/sessions/` - Session files
  - `storage/framework/views/` - Compiled view files

**Deploy Phase (SFTP workflow):**
- Uploads files via SFTP (more secure than FTP)
- Uses same file exclusions as FTP

**Post-Deployment (FTP and SFTP with SSH):**
Automatically runs these Laravel commands on your server:
- `php artisan migrate --force` - Runs database migrations
- `php artisan config:cache` - Caches configuration
- `php artisan route:cache` - Caches routes
- `php artisan view:cache` - Caches views
- `php artisan storage:link` - Creates storage symlink

SFTP workflow also runs `php artisan optimize:clear` first to clear all caches before rebuilding them.

**Post-Deployment (No SSH workflow):**
- Displays reminder message with commands to run manually
- You must run the commands via cPanel Terminal or SSH after deployment

### First Deployment Checklist

Before your first automated deployment, complete these manual steps on your server:

- [ ] Create MySQL database and user via cPanel/hosting control panel
- [ ] Note database credentials (name, username, password)
- [ ] Create `.env` file on server by copying `.env.example`
- [ ] Configure `.env` with:
  - Database credentials
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_URL=https://yourdomain.com`
- [ ] Generate application key: `php artisan key:generate`
- [ ] Set proper permissions on `storage/` and `bootstrap/cache/` directories (755 or 775)
- [ ] Configure document root to point to `public/` directory
- [ ] Set up SSL certificate (Let's Encrypt recommended)
- [ ] Add all required GitHub Secrets (see tables above)
- [ ] Disable or delete unused workflow files

**After First Automated Deployment:**
- [ ] Verify files deployed correctly
- [ ] Check that `vendor/` and `public/build/` directories exist
- [ ] Run `php artisan migrate --force` (if using no-SSH workflow)
- [ ] Run `php artisan db:seed --class=CategorySeeder` to seed categories
- [ ] Verify storage symlink: `ls -la public/storage`
- [ ] Test application in browser
- [ ] Register test account and create a book

### Troubleshooting

#### Workflow Fails to Run
- **Check branch name**: Workflows only trigger on push to `main` branch
- **Check workflow syntax**: YAML formatting errors prevent execution
- **Check Actions enabled**: Go to Settings → Actions → General

#### FTP/SFTP Connection Fails
```
Error: Cannot connect to server
```
- Verify `FTP_SERVER` or `SFTP_SERVER` is correct
- Verify `FTP_USERNAME`/`FTP_PASSWORD` or `SFTP_USERNAME`/`SFTP_PASSWORD`
- Check firewall allows connections from GitHub Actions IPs
- Verify `FTP_SERVER_DIR` or `SFTP_REMOTE_PATH` ends with `/`

#### SSH Commands Fail
```
Error: SSH connection failed
```
- Verify `SSH_HOST`, `SSH_USERNAME`, `SSH_PASSWORD`, and `SSH_PORT`
- Check SSH access is enabled on your hosting
- Verify `DEPLOY_PATH` is correct absolute path
- Some shared hosts block SSH access from certain IPs

#### Missing Dependencies After Deployment
```
Error: Class 'Something' not found
```
- Check `vendor/` directory exists on server
- Run `composer install --optimize-autoloader --no-dev` manually on server
- Check PHP version on server matches composer.json requirement (PHP 8.1+)

#### Assets Not Loading
```
Error: 404 Not Found on CSS/JS files
```
- Verify `public/build/` directory exists on server
- Check `npm run build` completed successfully in workflow
- Clear browser cache
- Check `APP_URL` in `.env` matches your domain

#### Database Migration Fails
```
Error: SQLSTATE[HY000] [2002] Connection refused
```
- Verify database credentials in `.env` on server
- Check database exists and user has proper privileges
- Verify `DB_HOST` (usually `localhost` on shared hosting)

#### Permission Denied Errors
```
Error: The stream or file "storage/logs/laravel.log" could not be opened
```
- Run manually on server:
  ```bash
  chmod -R 775 storage
  chmod -R 775 bootstrap/cache
  ```
- Contact hosting support if permissions reset after deployment

#### Deployment Succeeds but Site Shows Errors
- Check `.env` file exists and is configured correctly
- Verify `APP_KEY` is set in `.env`
- Run `php artisan optimize:clear` on server
- Check `storage/logs/laravel.log` for detailed errors
- Temporarily enable `APP_DEBUG=true` to see error details

### Security Notes

#### Protecting Your Secrets
- **Never commit secrets** to your repository
- **Use GitHub Secrets** for all sensitive credentials
- **Rotate passwords regularly** - update secrets when changed
- **Use SSH keys** instead of passwords when possible (requires workflow modification)
- **Limit SSH access** - use dedicated deployment user with minimal permissions

#### Safe Deployment Practices
- **Never deploy `.env`** - it must be manually created on server
- **Never use `dangerous-clean-slate: true`** - can delete server files
- **Test on staging first** - create separate workflow for staging environment
- **Keep backups** - backup database and files before deployments
- **Monitor logs** - check workflow logs and Laravel logs regularly

#### Environment Security
- Set `APP_DEBUG=false` in production `.env`
- Set `APP_ENV=production` in production `.env`
- Use HTTPS only (`SESSION_SECURE_COOKIE=true`)
- Keep Laravel and dependencies updated
- Review deployed files exclude list regularly

#### Workflow Security
- Review workflow files before enabling
- Only grant necessary permissions to deployment users
- Use SFTP instead of FTP when possible
- Monitor GitHub Actions usage and logs
- Disable workflows if not actively deploying

### Advanced Configuration

#### Using SSH Keys Instead of Passwords

For better security, use SSH keys instead of passwords:

1. Generate SSH key pair on your local machine
2. Add public key to server's `~/.ssh/authorized_keys`
3. Add private key as GitHub Secret named `SSH_PRIVATE_KEY`
4. Modify workflow to use `key` instead of `password`:

```yaml
- name: Run post-deployment commands via SSH
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USERNAME }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    port: ${{ secrets.SSH_PORT }}
    script: |
      cd ${{ secrets.DEPLOY_PATH }}
      php artisan migrate --force
      # ... other commands
```

#### Creating Staging Workflow

Copy one of the workflows and modify for staging:

1. Duplicate workflow file (e.g., `deploy-staging-ftp.yml`)
2. Change trigger branch to `develop` or `staging`
3. Add staging-specific secrets (e.g., `STAGING_FTP_SERVER`)
4. Update secret references in workflow

```yaml
on:
  push:
    branches:
      - develop  # Changed from main
```

#### Conditional SSH Commands

Skip certain commands conditionally:

```yaml
- name: Run migrations (only on production)
  if: github.ref == 'refs/heads/main'
  uses: appleboy/ssh-action@v1.0.3
  # ... rest of configuration
```

#### Notifications on Deployment

Add Slack or email notifications:

```yaml
- name: Notify on success
  if: success()
  # Add your notification action here
  
- name: Notify on failure
  if: failure()
  # Add your notification action here
```

---

**Ready to automate?** Follow the setup instructions above and your deployments will be automated!

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
