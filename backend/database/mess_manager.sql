-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2026 at 08:07 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mess_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mess_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `expense_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `mess_id`, `created_by`, `title`, `amount`, `expense_date`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Groceries', 3200.00, '2026-05-08', 'Weekly grocery purchase for the mess.', '2026-05-07 23:58:10', '2026-05-07 23:58:10'),
(2, 1, 2, 'Gas Refill', 950.00, '2026-05-07', 'Cooking gas refill.', '2026-05-07 23:58:10', '2026-05-07 23:58:10');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fixed_costs`
--

CREATE TABLE `fixed_costs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mess_id` bigint(20) UNSIGNED NOT NULL,
  `month_key` varchar(7) NOT NULL,
  `rent` decimal(12,2) NOT NULL DEFAULT 0.00,
  `khala` decimal(12,2) NOT NULL DEFAULT 0.00,
  `utilities` decimal(12,2) NOT NULL DEFAULT 0.00,
  `wifi` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fixed_costs`
--

INSERT INTO `fixed_costs` (`id`, `mess_id`, `month_key`, `rent`, `khala`, `utilities`, `wifi`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-05', 12000.00, 2500.00, 1800.00, 800.00, 2, 2, '2026-05-07 23:58:10', '2026-05-07 23:58:10');

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mess_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `meal_date` date NOT NULL,
  `meal_type` varchar(20) NOT NULL DEFAULT 'Lunch',
  `quantity` decimal(12,2) NOT NULL DEFAULT 1.00,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`id`, `mess_id`, `user_id`, `meal_date`, `meal_type`, `quantity`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 3, '2026-05-08', 'Lunch', 1.00, 2, '2026-05-07 23:58:10', '2026-05-07 23:58:10'),
(2, 1, 4, '2026-05-08', 'Dinner', 1.00, 2, '2026-05-07 23:58:10', '2026-05-07 23:58:10'),
(3, 1, 3, '2026-05-07', 'Dinner', 1.00, 2, '2026-05-07 23:58:10', '2026-05-07 23:58:10');

-- --------------------------------------------------------

--
-- Table structure for table `messes`
--

CREATE TABLE `messes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `manager_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `mess_request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messes`
--

INSERT INTO `messes` (`id`, `name`, `manager_user_id`, `mess_request_id`, `created_at`, `updated_at`) VALUES
(1, 'Green Leaf Mess', 2, 1, '2026-05-07 23:58:09', '2026-05-07 23:58:10'),
(2, 'Bokul-home', 5, 2, '2026-05-08 00:00:55', '2026-05-08 00:00:56');

-- --------------------------------------------------------

--
-- Table structure for table `mess_requests`
--

CREATE TABLE `mess_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mess_name` varchar(255) NOT NULL,
  `manager_name` varchar(255) DEFAULT NULL,
  `manager_email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `approved_mess_id` bigint(20) UNSIGNED DEFAULT NULL,
  `manager_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mess_requests`
--

INSERT INTO `mess_requests` (`id`, `mess_name`, `manager_name`, `manager_email`, `status`, `approved_mess_id`, `manager_user_id`, `approved_by`, `approved_at`, `rejected_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(1, 'Green Leaf Mess', 'Manager One', 'manager1@mess.com', 'approved', 1, 2, 1, '2026-05-07 23:58:10', NULL, NULL, '2026-05-07 23:58:09', '2026-05-07 23:58:10'),
(2, 'Bokul-home', 'Hasan Imam', 'hasan@gmail.com', 'approved', 2, 5, 1, '2026-05-08 00:00:56', NULL, NULL, '2026-05-08 00:00:29', '2026-05-08 00:00:56');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_04_28_000001_create_mess_requests_table', 1),
(6, '2026_04_28_000002_create_messes_table', 1),
(7, '2026_04_28_000003_add_role_and_mess_fields_to_users_table', 1),
(8, '2026_04_30_000001_create_fixed_costs_table', 1),
(9, '2026_04_30_000002_create_expenses_table', 1),
(10, '2026_04_30_000003_create_meals_table', 1),
(11, '2026_05_03_000004_create_user_transactions_table', 1),
(12, '2026_05_04_000001_add_phone_to_users_table', 1),
(13, '2026_05_06_000001_create_user_deposit_requests_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(8, 'App\\Models\\User', 6, 'mess-manager', 'ef110bd8beaeb498d247d5be73a96d1b3013a9c98c1dc4d0e9da1f329e0c4008', '[\"*\"]', '2026-05-08 00:05:52', NULL, '2026-05-08 00:05:44', '2026-05-08 00:05:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `mess_id` bigint(20) UNSIGNED DEFAULT NULL,
  `must_change_password` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `role`, `mess_id`, `must_change_password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'superadmin@mess.com', NULL, NULL, '$2y$12$eAzAUSgcvCKIeLIDj6xg5ub56c.LWrq0GXMLFEJb8ZoAcTRKw4lK2', 'superAdmin', NULL, 0, NULL, '2026-05-07 23:58:09', '2026-05-07 23:58:09'),
(2, 'Manager One', 'manager1@mess.com', '01700000001', NULL, '$2y$12$xpUPInWbkJDdDz3x8Ni3neQaJ6lrzvYjpOgPgAdnmTpESpg9v1fJu', 'manager', 1, 1, NULL, '2026-05-07 23:58:09', '2026-05-07 23:58:09'),
(3, 'Member One', 'member1@mess.com', '01700000002', NULL, '$2y$12$CaX6Xo8/Lv4xkXixgjCMwufq7CIBMh4mcEaOUNxzm3AfErYz6r6su', 'user', 1, 1, NULL, '2026-05-07 23:58:09', '2026-05-07 23:58:09'),
(4, 'Member Two', 'member2@mess.com', '01700000003', NULL, '$2y$12$S2e2svhUWAVw4HAEBKoiV.G4rc.3r/JMTayNfiTwQh.FoV4ZvhJ5a', 'user', 1, 1, NULL, '2026-05-07 23:58:10', '2026-05-07 23:58:10'),
(5, 'Hasan Imam', 'hasan@gmail.com', NULL, NULL, '$2y$12$x9K1yT6EjX1HwqXSc3tcZuakC7cTCIRZt0qmicuYhUOBopsgRspD6', 'manager', 2, 0, NULL, '2026-05-08 00:00:56', '2026-05-08 00:01:48'),
(6, 'Laden', 'laden@gmail.com', NULL, NULL, '$2y$12$3u//ElE4nOtB6OULA/zJzuWMm80TXo8f2cgtJGglQj2WMRQ/pbSAe', 'user', 2, 0, NULL, '2026-05-08 00:02:21', '2026-05-08 00:03:13');

-- --------------------------------------------------------

--
-- Table structure for table `user_deposit_requests`
--

CREATE TABLE `user_deposit_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mess_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_date` date NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'Deposit',
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `requested_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_deposit_requests`
--

INSERT INTO `user_deposit_requests` (`id`, `mess_id`, `user_id`, `transaction_date`, `type`, `amount`, `status`, `requested_by`, `approved_by`, `approved_transaction_id`, `approved_at`, `created_at`, `updated_at`) VALUES
(1, 1, 4, '2026-05-08', 'Deposit', 1500.00, 'approved', 4, 2, NULL, '2026-05-07 23:58:10', '2026-05-07 23:58:10', '2026-05-07 23:58:10');

-- --------------------------------------------------------

--
-- Table structure for table `user_transactions`
--

CREATE TABLE `user_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mess_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_date` date NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'Deposit',
  `amount` decimal(12,2) NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_transactions`
--

INSERT INTO `user_transactions` (`id`, `mess_id`, `user_id`, `transaction_date`, `type`, `amount`, `balance`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 3, '2026-05-07', 'Deposit', 3000.00, 5000.00, 2, '2026-05-07 23:58:10', '2026-05-07 23:58:10'),
(2, 1, 4, '2026-05-07', 'Deposit', 2500.00, 2500.00, 2, '2026-05-07 23:58:10', '2026-05-07 23:58:10'),
(3, 1, 3, '2026-05-08', 'Meal Charge', 180.00, 4820.00, 2, '2026-05-07 23:58:10', '2026-05-07 23:58:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_created_by_foreign` (`created_by`),
  ADD KEY `expenses_mess_id_expense_date_index` (`mess_id`,`expense_date`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `fixed_costs`
--
ALTER TABLE `fixed_costs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fixed_costs_mess_id_month_key_unique` (`mess_id`,`month_key`),
  ADD KEY `fixed_costs_created_by_foreign` (`created_by`),
  ADD KEY `fixed_costs_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meals_created_by_foreign` (`created_by`),
  ADD KEY `meals_mess_id_meal_date_index` (`mess_id`,`meal_date`),
  ADD KEY `meals_user_id_meal_date_index` (`user_id`,`meal_date`);

--
-- Indexes for table `messes`
--
ALTER TABLE `messes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messes_manager_user_id_foreign` (`manager_user_id`),
  ADD KEY `messes_mess_request_id_foreign` (`mess_request_id`);

--
-- Indexes for table `mess_requests`
--
ALTER TABLE `mess_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mess_requests_manager_user_id_foreign` (`manager_user_id`),
  ADD KEY `mess_requests_approved_by_foreign` (`approved_by`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_mess_id_foreign` (`mess_id`);

--
-- Indexes for table `user_deposit_requests`
--
ALTER TABLE `user_deposit_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_deposit_requests_requested_by_foreign` (`requested_by`),
  ADD KEY `user_deposit_requests_approved_by_foreign` (`approved_by`),
  ADD KEY `user_deposit_requests_approved_transaction_id_foreign` (`approved_transaction_id`),
  ADD KEY `user_deposit_requests_mess_id_status_index` (`mess_id`,`status`),
  ADD KEY `user_deposit_requests_user_id_status_index` (`user_id`,`status`);

--
-- Indexes for table `user_transactions`
--
ALTER TABLE `user_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_transactions_created_by_foreign` (`created_by`),
  ADD KEY `user_transactions_user_id_transaction_date_index` (`user_id`,`transaction_date`),
  ADD KEY `user_transactions_mess_id_transaction_date_index` (`mess_id`,`transaction_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fixed_costs`
--
ALTER TABLE `fixed_costs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `messes`
--
ALTER TABLE `messes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mess_requests`
--
ALTER TABLE `mess_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_deposit_requests`
--
ALTER TABLE `user_deposit_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_transactions`
--
ALTER TABLE `user_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `expenses_mess_id_foreign` FOREIGN KEY (`mess_id`) REFERENCES `messes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fixed_costs`
--
ALTER TABLE `fixed_costs`
  ADD CONSTRAINT `fixed_costs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fixed_costs_mess_id_foreign` FOREIGN KEY (`mess_id`) REFERENCES `messes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fixed_costs_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `meals`
--
ALTER TABLE `meals`
  ADD CONSTRAINT `meals_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `meals_mess_id_foreign` FOREIGN KEY (`mess_id`) REFERENCES `messes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messes`
--
ALTER TABLE `messes`
  ADD CONSTRAINT `messes_manager_user_id_foreign` FOREIGN KEY (`manager_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messes_mess_request_id_foreign` FOREIGN KEY (`mess_request_id`) REFERENCES `mess_requests` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `mess_requests`
--
ALTER TABLE `mess_requests`
  ADD CONSTRAINT `mess_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `mess_requests_manager_user_id_foreign` FOREIGN KEY (`manager_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_mess_id_foreign` FOREIGN KEY (`mess_id`) REFERENCES `messes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_deposit_requests`
--
ALTER TABLE `user_deposit_requests`
  ADD CONSTRAINT `user_deposit_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_deposit_requests_approved_transaction_id_foreign` FOREIGN KEY (`approved_transaction_id`) REFERENCES `user_transactions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_deposit_requests_mess_id_foreign` FOREIGN KEY (`mess_id`) REFERENCES `messes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_deposit_requests_requested_by_foreign` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_deposit_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_transactions`
--
ALTER TABLE `user_transactions`
  ADD CONSTRAINT `user_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `user_transactions_mess_id_foreign` FOREIGN KEY (`mess_id`) REFERENCES `messes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
