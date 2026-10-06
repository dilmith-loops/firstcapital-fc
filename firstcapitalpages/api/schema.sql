-- First Capital Investor Week Leads Table Schema
-- Run this SQL in Hostinger phpMyAdmin for your database

CREATE TABLE IF NOT EXISTS `quiz_leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `gender` VARCHAR(10) DEFAULT 'male',
  `result_code` CHAR(1) DEFAULT 'A',
  `result_profile` VARCHAR(100) DEFAULT NULL,
  `matched_product` VARCHAR(255) DEFAULT NULL,
  `answers_json` TEXT DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'NEW',
  `notes` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
