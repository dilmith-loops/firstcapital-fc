-- ==============================================================================
-- First Capital Investor Week Database Schema
-- Production Domain: https://investor.firstcapital.lk/
-- ==============================================================================
-- Run this SQL script in phpMyAdmin or MySQL client to initialize tables.

CREATE TABLE IF NOT EXISTS `quiz_leads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `gender` VARCHAR(20) DEFAULT 'male',
    `result_code` CHAR(2) DEFAULT 'A',
    `result_profile` VARCHAR(100) DEFAULT NULL,
    `matched_product` VARCHAR(255) DEFAULT NULL,
    `answers_json` LONGTEXT DEFAULT NULL,
    `status` VARCHAR(20) DEFAULT 'NEW',
    `notes` TEXT DEFAULT NULL,
    `source` VARCHAR(100) DEFAULT 'Landing Page Quiz'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `app_settings` (
    `setting_key` VARCHAR(100) PRIMARY KEY,
    `setting_value` LONGTEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin portal accounts (passwords stored as password_hash() hashes; created via the
-- one-time setup screen, then managed from the admin portal)
CREATE TABLE IF NOT EXISTS `admin_accounts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(30) NOT NULL DEFAULT 'Manager',
    `status` VARCHAR(20) NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_login` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Per-IP rate limiting for logins and quiz submissions
CREATE TABLE IF NOT EXISTS `rate_limits` (
    `k` VARCHAR(191) PRIMARY KEY,
    `hits` INT NOT NULL DEFAULT 0,
    `window_start` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The old browser-side admin list stored plain-text passwords here; remove it.
DELETE FROM `app_settings` WHERE `setting_key` = 'admin_users';
