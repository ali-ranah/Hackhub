-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2024 at 06:12 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hackshub`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_title` text NOT NULL,
  `creator_id` int(10) UNSIGNED NOT NULL,
  `allowed_time` text NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `location` text NOT NULL,
  `question` text NOT NULL,
  `guidelines` text DEFAULT NULL,
  `description` text NOT NULL,
  `participation_type` enum('individual','team','both') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `numberOfParticipants` int(11) NOT NULL,
  `preferedLanguage` varchar(255) NOT NULL,
  `prizeAmount` decimal(10) NOT NULL,
  `levelOfParticipant` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--


-- --------------------------------------------------------

--
-- Table structure for table `event_categories`
--

CREATE TABLE `event_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `event_categories`
--

-- --------------------------------------------------------

--
-- Table structure for table `event_participants`
--

CREATE TABLE `event_participants` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `guidelines` text DEFAULT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_participants_event_id_foreign` (`event_id`),
  KEY `event_participants_user_id_foreign` (`user_id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Table structure for table `event_team`
--

CREATE TABLE `event_team` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `role_type` enum('organizer','judge') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '20191217170254_01-user.js', 1, '2024-02-19 14:52:36'),
(3, '20191217171230_03-events.js', 1, '2024-02-19 14:52:40'),
(4, '20200114172910_04-event_participants.js', 1, '2024-02-19 14:52:43'),
(5, '20200114214722_04-event-team.js.js', 1, '2024-02-19 14:52:45'),
(6, '20200117140220_08-project_entries.js', 2, '2024-02-19 15:03:21'),
(7, '20200120133700_project_grading.js', 3, '2024-02-19 15:11:18'),
(8, '20200121122331_09-add-comments-column.js', 4, '2024-02-19 15:12:46'),
(9, '20200122141440_11-add-average-column.js', 5, '2024-02-19 15:20:05'),
(10, '20200128093128_12-participant-teams.js', 5, '2024-02-19 15:20:07'),
(11, '20200128095045_13-participant-team-members.js', 5, '2024-02-19 15:20:10'),
(12, '20200130230908_confirm-email.js', 6, '2024-02-19 15:24:34'),
(26, '20200131081920_images.js', 7, '2024-02-19 17:18:55');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `participant_teams`
--

CREATE TABLE `participant_teams` (
  `id` int(10) UNSIGNED NOT NULL,
  `team_name` text NOT NULL,
  `team_lead` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `participant_team_members`
--

CREATE TABLE `participant_team_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `team_member` int(10) UNSIGNED NOT NULL,
  `team_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `project_entries`
--

CREATE TABLE `project_entries` (
  `id` int(10) UNSIGNED NOT NULL,
  `project_title` text NOT NULL,
  `participant_or_team_name` text NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `git_url` varchar(255) DEFAULT NULL,
  `project_writeups` text DEFAULT NULL,
  `submitted_by` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `project_grading`
--

CREATE TABLE `project_grading` (
  `id` int(10) UNSIGNED NOT NULL,
  `project_event_id` int(10) UNSIGNED NOT NULL,
  `project_id` int(10) UNSIGNED NOT NULL,
  `judge_id` int(10) UNSIGNED NOT NULL,
  `product_design` int(11) DEFAULT 0,
  `functionality` int(11) DEFAULT 0,
  `innovation` int(11) DEFAULT 0,
  `product_fit` int(11) DEFAULT 0,
  `extensibility` int(11) DEFAULT 0,
  `presentation` int(11) DEFAULT 0,
  `judge_comments` text DEFAULT NULL,
  `plagiarism_score` float DEFAULT NULL,
  `ai_content` float DEFAULT NULL,
  `average_rating` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `image_url` text DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `region` varchar(20) DEFAULT NULL,
  `C_skill` int(10) DEFAULT 0,
  `Cpp_skill` int(10) DEFAULT 0,
  `JAVA_skill` int(10) DEFAULT 0,
  `PYTHON_skill` int(10) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `bio`, `email`, `fullname`, `verified`, `image_url`, `role`, `DOB`, `country`, `mobile`, `region`) VALUES
(72, NULL, '$2b$15$20BDZWCZ9FtRhKRa5CwTj.q5rrskfUw6FJ9jxJh7PlJIuDLm.kEBS', NULL, 'atrbhrg@hacktonapi.com', NULL, 0, NULL, 'participants', NULL, NULL, NULL, NULL),
(73, NULL, '$2b$15$/GXFjJPfgyxMrNSy/.f3POQspBlg.zgvwKXkX4WSQUcl.3SyxMqD6', NULL, 'jawad@hacktonapi.com', NULL, 0, NULL, 'participants', NULL, NULL, NULL, NULL),
(74, 'khann', '$2b$15$9.wWLuP8AcrlFJ9LcseBOurtgQlBiQmv2WaH3KzJES6Oca08M0.qe', NULL, 'jawadk@hacktonapi.com', 'Jawad Shah', 0, NULL, 'participants', '0000-00-00', 'pakistan', '304830843048', 'asjdkj');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `events_event_title_unique` (`event_title`) USING HASH;

--
-- Indexes for table `event_categories`
--
-- ALTER TABLE `event_categories`
--   ADD PRIMARY KEY (`id`),
--   ADD UNIQUE KEY `event_categories_category_name_unique` (`category_name`);

--
-- Indexes for table `event_participants`
--
--
-- Indexes for table `event_team`
--
ALTER TABLE `event_team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_team_user_id_foreign` (`user_id`),
  ADD KEY `event_team_event_id_foreign` (`event_id`);


--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `participant_teams`
--
ALTER TABLE `participant_teams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `participant_teams_team_name_unique` (`team_name`) USING HASH,
  ADD KEY `participant_teams_team_lead_foreign` (`team_lead`),
  ADD KEY `participant_teams_event_id_foreign` (`event_id`);

--
-- Indexes for table `participant_team_members`
--
ALTER TABLE `participant_team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `participant_team_members_team_member_foreign` (`team_member`),
  ADD KEY `participant_team_members_team_id_foreign` (`team_id`);

--
-- Indexes for table `project_entries`
--
ALTER TABLE `project_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_entries_submitted_by_foreign` (`submitted_by`),
  ADD KEY `project_entries_event_id_foreign` (`event_id`);


--
-- Indexes for table `project_grading`
--
ALTER TABLE `project_grading`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_grading_project_id_judge_id_unique` (`project_id`,`judge_id`),
  ADD KEY `project_grading_judge_id_foreign` (`judge_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `event_categories`
--
-- ALTER TABLE `event_categories`
--   MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `event_participants`
--
ALTER TABLE `event_participants`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `event_team`
--
ALTER TABLE `event_team`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `participant_teams`
--
ALTER TABLE `participant_teams`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participant_team_members`
--
ALTER TABLE `participant_team_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_entries`
--
ALTER TABLE `project_entries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_grading`
--
ALTER TABLE `project_grading`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
--
-- Constraints for table `event_participants`
--
ALTER TABLE `event_participants`
 ADD CONSTRAINT `event_participants_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
 ADD CONSTRAINT `event_participants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Constraints for table `event_team`
--
ALTER TABLE `event_team`
  ADD CONSTRAINT `event_team_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_team_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `participant_teams`
--
ALTER TABLE `participant_teams`
  ADD CONSTRAINT `participant_teams_team_lead_foreign` FOREIGN KEY (`team_lead`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participant_teams_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `participant_team_members`
--
ALTER TABLE `participant_team_members`
  ADD CONSTRAINT `participant_team_members_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `participant_teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participant_team_members_team_member_foreign` FOREIGN KEY (`team_member`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_entries`
--
ALTER TABLE `project_entries`
  ADD CONSTRAINT `project_entries_submitted_by_foreign` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_entries_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_grading`
--
ALTER TABLE `project_grading`
  ADD CONSTRAINT `project_grading_judge_id_foreign` FOREIGN KEY (`judge_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_grading_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `project_entries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
