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
