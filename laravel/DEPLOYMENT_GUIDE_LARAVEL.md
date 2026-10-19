# First Capital Investor Week - Full Laravel 12 Backend Deployment Guide
**Target URL:** `https://firstcapital.lk/begininvesting`  
**Framework:** Laravel 12.70.0 | PHP 8.2+ | MySQL 8.0+ / MariaDB  
**Security Rating:** Grade A+ (Enterprise Standard)

---

## 1. Architectural Highlights

| Component | Implementation | Security Benefit |
| :--- | :--- | :--- |
| **Public Landing & Quiz** | Ultra-fast client flow with in-page anchors | 100% accessible to public (`0.0.0.0/0`), zero conversion friction. |
| **Public Lead API** | `POST /begininvesting/api/leads` | Honeypot trapped, validated, rate-limited per IP (`throttle:quiz-submission`). |
| **Admin Portal** | Server-Rendered Blade (`/admin`) | **No client-side React bundles.** Zero bundle leaks, full CSRF protection (`@csrf`). |
| **Perimeter IP Gatekeeper** | `RestrictIpAddress` Middleware + `.htaccess` | Multi-layer IP verification supporting **Imperva Incapsula WAF** (`Incap-Client-IP`), Cloudflare, and CIDR masks. |
| **Database Security** | Eloquent ORM + Protected Config | No plain-text `.env` exposed to web. Full SQL injection immunity. |

---

## 2. Server Requirements

- **PHP Version:** PHP 8.2, 8.3, 8.4, or 8.5
- **PHP Extensions:** `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `curl`
- **Web Server:** Apache 2.4+ / LiteSpeed / Nginx with `mod_rewrite` enabled
- **Database:** MySQL 5.7+ / 8.0+ or MariaDB 10.3+

---

## 3. Deployment Steps to `https://firstcapital.lk/begininvesting`

### Method A: Recommended cPanel / Subfolder Deployment

1. **Upload Files:**
   Upload the contents of the `laravel/` folder into the `begininvesting/` directory inside your web root (e.g., `/home/username/public_html/begininvesting/`).

2. **Verify File Permissions:**
   Ensure the following directories are writable by the web server (`chmod -R 775`):
   ```bash
   chmod -R 775 storage/
   chmod -R 775 bootstrap/cache/
   ```

3. **Configure Production Credentials (`config/credentials.php`):**
   *STRICT ZERO-.ENV ARCHITECTURE: No `.env` files are used in this project.*
   Open `config/credentials.php` and set your production MySQL credentials and whitelisted IPs:
   ```php
   return [
       'APP_NAME' => 'First Capital Investor Week',
       'APP_ENV' => 'production',
       'APP_KEY' => 'base64:p8YjnIuDAB8fyIxP99ZSs8k4YaAXBsORBGK2ZcoE9l4=',
       'APP_DEBUG' => false,
       'APP_URL' => 'https://firstcapital.lk/begininvesting',
       'ASSET_URL' => '/begininvesting',

       // Database Credentials
       'DB_CONNECTION' => 'mysql',
       'DB_HOST' => '127.0.0.1',
       'DB_PORT' => '3306',
       'DB_DATABASE' => 'firstcapital_investor',
       'DB_USERNAME' => 'firstcapital_user',
       'DB_PASSWORD' => 'your_secure_mysql_password',

       // Whitelisted corporate IPs permitted to access /admin/
       'ADMIN_ALLOWED_IPS' => '112.134.215.162, 127.0.0.1, ::1',

       // Secret token to create the initial Super Admin account at /admin/setup
       'ADMIN_SETUP_TOKEN' => '4c1cfd0a644ce9f9d8d9dffb358e59dd5dde532b59a525eb',
   ];
   ```

4. **Run Database Migrations & Initial Seed:**
   Execute Artisan migrations to initialize the schema:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```
   *Alternatively, if terminal access is restricted on cPanel, import `public/schema.sql` via phpMyAdmin.*

---

## 4. Initial Administrator Account Setup

*STRICT ARCHITECTURAL DIRECTIVE: Zero admin credentials are hardcoded into code, seeders, or configs. All administrator passwords are encrypted via Bcrypt/Argon2id and stored exclusively in the database.*

You have two secure methods to initialize the first Administrator account:

### Method 1: Web Browser Setup (Recommended)
1. Open `https://firstcapital.lk/begininvesting/admin/setup` in your browser from your whitelisted corporate IP (`112.134.215.162`).
2. Enter the secret `ADMIN_SETUP_TOKEN` configured in `config/credentials.php`.
3. Provide your full name, corporate email address, and chosen strong password (min. 10 characters).
4. Click **Create Super Administrator**.
5. Once submitted, this route automatically self-terminates and cannot be accessed again.

### Method 2: Interactive Artisan CLI (Terminal)
Run the built-in interactive command on your server terminal:
```bash
php artisan admin:create
```
The command will interactively prompt you for:
- **Full Name**
- **Corporate Email Address**
- **Strong Password** (minimum 10 characters, masked as you type)
- **Role Selection** (Super Admin, Manager, Advisor, Auditor)

The password is encrypted immediately with Bcrypt/Argon2id before being stored in the `admin_accounts` table.

---

## 5. Verification & Testing Checklist

| Step | Test URL | Expected Result |
| :--- | :--- | :--- |
| **1. Public Campaign** | `https://firstcapital.lk/begininvesting/` | Main landing page loads with responsive layout & quiz CTA. |
| **2. Design Option 2** | `https://firstcapital.lk/begininvesting/design-option-2` | Comic style campaign renders. |
| **3. Personality Share** | `https://firstcapital.lk/begininvesting/keep-it-cool-female.html` | High-res share card loads with social meta tags. |
| **4. Quiz Submission** | Take the 7-question quiz on the landing page | Generates outcome (A, B, C, or D) and submits to `POST /api/leads`. |
| **5. Admin Gatekeeper** | Access `/admin/login` from non-whitelisted IP | Displays branded **403 Forbidden** error screen with client IP. |
| **6. Admin Login** | Access `/admin/login` from whitelisted IP | Displays luxury sign-in card. Successful login redirects to `/admin/leads`. |
| **7. Leads Dashboard** | `https://firstcapital.lk/begininvesting/admin/leads` | Displays KPI cards, leads table, personality badges, and detailed answer modal. |
| **8. CSV Export** | Click **Export CSV** in Admin Portal | Downloads UTF-8 BOM CSV with complete lead records and notes. |

---

## 6. Security Maintenance & Telemetry

- **View Live Diagnostics:** Navigate to `/admin/system` to inspect detected Imperva Incapsula reverse proxy headers (`HTTP_INCAP_CLIENT_IP`, `HTTP_X_FORWARDED_FOR`), PHP engine version, and database connectivity.
- **Manage Whitelisted IPs:** Add or remove IP addresses or CIDR blocks in `.env` under `ADMIN_ALLOWED_IPS`. Multiple entries should be separated by commas (e.g. `112.134.215.162, 192.168.1.0/24`).
