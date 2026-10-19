# Hostinger hPanel Deployment Guide
**Target URL**: `https://ai.loopsintegrated.co/fc`

Everything has been configured and pre-packaged for you into `fc_hpanel_deployment.zip`.

---

## 🚀 Quick 3-Step Deployment via hPanel File Manager

### Step 1: Create the `/fc` Directory
1. Log in to your Hostinger **hPanel**.
2. Navigate to **Websites** -> click **Manage** next to `ai.loopsintegrated.co`.
3. Open **File Manager** (Files -> File Manager).
4. Go to `public_html/`.
5. Click **New Folder** and name it: `fc`.

---

### Step 2: Upload and Extract the Package
1. Double-click to enter the `public_html/fc/` folder.
2. Click **Upload** (top right icon) and upload:
   - File: `fc_hpanel_deployment.zip` (located in your project root).
3. Once uploaded, right-click `fc_hpanel_deployment.zip` and select **Extract**.
   - Choose extraction destination: `public_html/fc/`
4. After extraction is complete, you may delete the `fc_hpanel_deployment.zip` file to save disk space.

---

### Step 3: Verify Folder Permissions
In the File Manager under `public_html/fc/`:
1. Right-click the **`storage`** folder -> **Permissions** -> set to **0775** (Read, Write, Execute for Owner & Group) and check *Update recursively*.
2. Right-click the **`bootstrap/cache`** folder -> **Permissions** -> set to **0775**.
3. Right-click the **`database`** folder -> **Permissions** -> set to **0775** (ensures SQLite database is writable).

---

## ⚙️ Configuration Details (Already Pre-Set)

In `config/credentials.php`, the URLs have already been configured for you:
```php
'APP_URL'   => 'https://ai.loopsintegrated.co/fc',
'ASSET_URL' => '/fc',
```

### Admin Access & IP Whitelist
- Access URL: `https://ai.loopsintegrated.co/fc/admin/login`
- Login Email: `admin@firstcapital.lk`
- Password: `TrQ$BKcvge9M4V8kw5aV`
- If you access the admin portal from an IP not in `ADMIN_ALLOWED_IPS`, you will see the custom `Oops! That page can’t be found.` page. To add your current IP, edit `config/credentials.php` in File Manager and append your IP to `ADMIN_ALLOWED_IPS`.

---

## 🗄️ Database Options

### Option A: Out-of-the-Box SQLite (Zero Setup Required)
The zip package already includes `database/database.sqlite` with:
- All 7 questions & answers
- All 4 personality outcomes
- All 3 investment products (Unit Trust, Government Securities, Equities)
- All 4 testimonials & 8 value propositions
- Super Admin account pre-seeded
- Lead count starting at 0 (clean state)

### Option B: Hostinger MySQL Database (Optional)
If you prefer running on Hostinger's MySQL:
1. In hPanel -> **Databases** -> **MySQL Databases** -> Create a database (e.g. `u123456789_fc`).
2. Go to **phpMyAdmin** and import `schema.sql`.
3. In File Manager, open `public_html/fc/config/credentials.php` and set:
   ```php
   'DB_CONNECTION' => 'mysql',
   'DB_HOST'       => 'localhost',
   'DB_DATABASE'   => 'your_hpanel_db_name',
   'DB_USERNAME'   => 'your_hpanel_db_user',
   'DB_PASSWORD'   => 'your_hpanel_db_password',
   ```

---

## 🌐 URLs Overview
- **Campaign Landing Page**: `https://ai.loopsintegrated.co/fc/`
- **Design Option 2**: `https://ai.loopsintegrated.co/fc/design-option-2`
- **Admin Dashboard**: `https://ai.loopsintegrated.co/fc/admin/leads`
- **Campaign Settings**: `https://ai.loopsintegrated.co/fc/admin/settings`
- **Public Lead API**: `POST https://ai.loopsintegrated.co/fc/api/leads`
