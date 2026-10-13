# First Capital Investor Week - Deployment Guide
Target URL: https://investor.firstcapital.lk/

================================================================================
1. UPLOAD FILES
================================================================================
Upload all files from the 'firstcapitalpages' folder (or extract 'firstcapital-production.zip')
directly into the web root (e.g., public_html or document root) of:
https://investor.firstcapital.lk/

Make sure hidden files (.env and .htaccess) and SQL schema (schema.sql) are uploaded!

================================================================================
2. DATABASE SETUP (.env & schema.sql)
================================================================================
Step A - Run schema.sql:
Open phpMyAdmin or your MySQL client, select your database, and run 'schema.sql'.
This creates the required tables:
- 'quiz_leads' (stores quiz submissions, personality profiles, and notes)
- 'app_settings' (stores dynamic questions and admin portal settings)

* Automatic table creation in PHP has been disabled per production security guidelines.

Step B - Configure MySQL in .env:
Open the '.env' file in the root directory and enter your MySQL database credentials:

DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

Step C - Configure SMTP in .env:
Enter your outgoing SMTP mail server credentials to send new quiz submissions to your admin inbox:

SMTP_ENABLED=true
ADMIN_EMAIL=admin@firstcapital.lk
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=ssl
SMTP_USER=leads@firstcapital.lk
SMTP_PASS=your_smtp_password_here

* .htaccess is pre-configured to block public access to .env for security.

================================================================================
3. DIRECTORY STRUCTURE
================================================================================
- index.html                      -> Main Campaign Landing Page
- design-option-2/index.html      -> Design Option 2 (Comic Style)
- admin/index.html                -> Admin Leads Management Portal
- api/leads.php                   -> Secure Lead Capture & Admin API
- api/db.php                      -> Database Connection Script
- api/smtp.php                    -> SMTP Email Client (Quiz Results to Admin)
- schema.sql                      -> MySQL Database Table Definitions (Run once)
- .env                            -> MySQL & SMTP Configuration (EDIT THIS)
- .htaccess                       -> Apache/LiteSpeed URL Rewrites & Security
- share-*.jpg                     -> High-Resolution Personality Cards

================================================================================
4. VERIFICATION
================================================================================
Once uploaded, verify by visiting:
- https://investor.firstcapital.lk/
- https://investor.firstcapital.lk/admin/
- Test the quiz: your lead will appear immediately in the Admin Portal!
