# First Capital Investor Week - Deployment Guide
Target URL: https://firstcapital.lk/begininvesting/

================================================================================
1. UPLOAD FILES
================================================================================
Upload all files from the 'firstcapitalpages' folder (or extract 'firstcapital-production.zip')
into the 'begininvesting' folder inside the web root (e.g., public_html/begininvesting/) so it is served at:
https://firstcapital.lk/begininvesting/

Make sure hidden files (.env and .htaccess) and SQL schema (schema.sql) are uploaded!

================================================================================
2. DATABASE SETUP (.env & schema.sql)
================================================================================
Step A - Run schema.sql:
Open phpMyAdmin or your MySQL client, select your database, and run 'schema.sql'.
This creates the required tables:
- 'quiz_leads' (stores quiz submissions, personality profiles, and notes)
- 'app_settings' (stores dynamic questions and admin portal settings)
- 'admin_accounts' (admin portal logins, passwords stored as secure hashes)
- 'rate_limits' (per-IP limits for logins and quiz submissions)

* The API also creates any missing tables automatically on first use.

Step B - Configure MySQL in .env:
Open the '.env' file in the root directory and enter your MySQL database credentials:

DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
ADMIN_SETUP_TOKEN=a_random_string_of_at_least_16_characters

* .htaccess is pre-configured to block public access to .env, .sql, .md and .json files.
  After uploading, confirm https://firstcapital.lk/begininvesting/.env returns "403 Forbidden".
* For extra safety, move .env one folder above the site folder; api/db.php also looks there.

Step C - Create the first admin account:
Open https://firstcapital.lk/begininvesting/admin/ - while no admin exists it shows "Create Administrator".
Enter your name, email, a password (10+ characters) and the ADMIN_SETUP_TOKEN value.
The token stops working as soon as the first admin exists; further admins are added
from the portal's admin users screen.

================================================================================
3. DIRECTORY STRUCTURE
================================================================================
- index.html                      -> Main Campaign Landing Page
- design-option-2/index.html      -> Design Option 2 (Comic Style)
- admin/index.html                -> Admin Leads Management Portal
- api/leads.php                   -> Secure Lead Capture & Admin API
- api/db.php                      -> Database Connection Script
- schema.sql                      -> MySQL Database Table Definitions (Run once)
- .env                            -> MySQL Database Configuration (EDIT THIS)
- .htaccess                       -> Apache/LiteSpeed URL Rewrites & Security
- share-*.jpg                     -> High-Resolution Personality Cards

================================================================================
4. VERIFICATION
================================================================================
Once uploaded, verify by visiting:
- https://firstcapital.lk/begininvesting/
- https://firstcapital.lk/begininvesting/admin/
- Test the quiz: your lead will appear immediately in the Admin Portal!
