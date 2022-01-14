--
-- Database: `fys_is108_3_dev`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `chat`
--

CREATE TABLE `chat` (
  `id` int(255) NOT NULL,
  `first_user` int(255) NOT NULL,
  `first_user_opened` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `second_user` int(255) NOT NULL,
  `second_user_opened` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chat_opened_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Gegevens worden geëxporteerd voor tabel `chat`
--

INSERT INTO `chat` (`id`, `first_user`, `first_user_opened`, `second_user`, `second_user_opened`, `chat_opened_at`) VALUES
(19, 13, '2022-01-13 23:56:17', 1, '2022-01-14 15:32:33', '2022-01-13 17:21:50'),
(20, 13, '2022-01-13 23:54:17', 27, '2022-01-13 23:08:29', '2022-01-13 19:25:45');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `names` varchar(255) NOT NULL,
  `lang_short` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Gegevens worden geëxporteerd voor tabel `countries`
--

INSERT INTO `countries` (`id`, `names`, `lang_short`, `created_at`, `updated_at`) VALUES
(1, 'Nederland', 'nl', '2021-11-18 12:04:22', '2021-11-18 12:04:22'),
(2, 'Belgie', 'be', '2021-12-09 09:44:42', '2021-12-09 09:44:42'),
(3, 'Spanje', 'es', '2022-01-13 13:54:28', '2022-01-13 13:54:28'),
(4, 'Griekenland', 'gr', '2022-01-13 14:03:23', '2022-01-13 14:03:23'),
(6, 'Bonaire', 'bq', '2022-01-13 14:05:58', '2022-01-13 14:05:58'),
(7, 'Bulgarije', 'bg', '2022-01-13 14:05:58', '2022-01-13 14:05:58'),
(8, 'Curacao', 'cw', '2022-01-13 14:07:00', '2022-01-13 14:07:00'),
(9, 'Dominicaanse-Republiek', 'do', '2022-01-13 14:07:00', '2022-01-13 14:07:00'),
(10, 'Dubai', 'du', '2022-01-13 14:17:38', '2022-01-13 14:17:38'),
(11, 'Egypte', 'eg', '2022-01-13 14:17:38', '2022-01-13 14:17:38'),
(12, 'Gambia', 'gm', '2022-01-13 14:18:56', '2022-01-13 14:18:56'),
(13, 'Indonesie', 'id', '2022-01-13 14:18:56', '2022-01-13 14:18:56'),
(14, 'Turkije', 'tr', '2022-01-13 14:23:20', '2022-01-13 14:23:20'),
(15, 'Italie', 'it', '2022-01-13 14:23:20', '2022-01-13 14:23:20'),
(16, 'Kaapverdie', 'cv', '2022-01-13 14:27:00', '2022-01-13 14:27:00'),
(17, 'Macedonie', 'mk', '2022-01-13 14:27:00', '2022-01-13 14:27:00'),
(18, 'Portugal', 'pt', '2022-01-13 14:28:26', '2022-01-13 14:28:26'),
(19, 'Verenigde-Arabische-Emiraten', 'uae', '2022-01-13 14:28:26', '2022-01-13 14:28:26');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `intressed`
--

CREATE TABLE `intressed` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Gegevens worden geëxporteerd voor tabel `intressed`
--

INSERT INTO `intressed` (`id`, `name`) VALUES
(1, 'Voetbal'),
(2, 'Programming'),
(3, 'Java');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `messages`
--

CREATE TABLE `messages` (
  `msg_id` int(255) NOT NULL,
  `chat_id` int(255) NOT NULL,
  `from_user_id` int(255) NOT NULL,
  `to_user_id` int(255) NOT NULL,
  `msg` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message_send_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Gegevens worden geëxporteerd voor tabel `messages`
--

INSERT INTO `messages` (`msg_id`, `chat_id`, `from_user_id`, `to_user_id`, `msg`, `message_send_at`) VALUES
(174, 19, 1, 13, 'PGRpdiBjbGFzcz0nY2hhdF9fYmxvY2snPjxkaXYgY2xhc3M9J2Jsb2NrX19oZWFkZXInPjxoMj5EaXQgemlqbiBtaWpuIHJlaXMgdm9vcmtldXJlbjo8L2gyPjwvZGl2PjxkaXYgY2xhc3M9J2Jsb2NrX19jb250ZW50Jz4gPGRpdiBjbGFzcz0nYmxvY2tfX3ByZWZlcmVuY2VzJz5OZWRlcmxhbmQsQmVsZ2llLFNwYW5qZTwvZGl2PjwvZGl2PjwvZGl2Pg==', '2022-01-14 05:42:23'),
(175, 19, 1, 13, 'PGRpdiBjbGFzcz0nY2hhdF9fYmxvY2sgc2hhcmVkQmxvY2snPiA8ZGl2IGNsYXNzPSdibG9ja19faGVhZGVyJz48aDI+T256ZSB2b29ya2V1cmVuIGtvbWVuIG92ZXJlZW4gb3A6PC9oMj48L2Rpdj48ZGl2IGNsYXNzPSdibG9ja19fY29udGVudCc+IDxkaXYgY2xhc3M9J2Jsb2NrX19zaGFyZWRDb3VudHJ5Jz5CZWxnaWU8L2Rpdj48YSBocmVmPSdodHRwczovL2NvcmVuZG9uLm5sL0JlbGdpZSc+QmVraWprIGRlYWwgb3AgY29yZW5kb248L2E+PC9kaXY+PC9kaXY+', '2022-01-14 06:18:16');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `request`
--

CREATE TABLE `request` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `to_user` int(11) NOT NULL,
  `requested_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `account_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user',
  `birthday` date DEFAULT NULL,
  `country_origin_id` int(11) DEFAULT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','neutral','') NOT NULL DEFAULT 'neutral',
  `bio` longtext,
  `email_verified_at` datetime DEFAULT NULL,
  `public` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Gegevens worden geëxporteerd voor tabel `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `password`, `email`, `account_type`, `birthday`, `country_origin_id`, `profile`, `gender`, `bio`, `email_verified_at`, `public`) VALUES
(1, 'Test', 'gebruiker', 'd672d4c71df14f48c164d304423440a5d4ff5dd2f45f557d24027b5c387f2251a4a5e17869660d7f6f58eb922a08c35d9aaeeb9789c74091b03e2bf1402bf169', 'demo@demo.nl', 'admin', '2005-03-15', 1, 'https://dev-is108-3.fys.cloud/uploads/userprofile_1.png', 'male', '<p><br></p>', '2021-12-08 00:00:00', 1),
(13, 'Jonah', 'Brandwagt', 'abda3eee256255eeda7556fe8ddfc5436aeac4955da362ee2c7d1e70be0cbaeea7fa63b443419af1ed2d83042608e63da868fbb91947e2464a2af927b783f9a1', 'contact@jonahbrandwagt.com', 'user', '2003-10-25', 1, 'https://dev-is108-3.fys.cloud/uploads/userprofile_13.png', 'male', '<p>o;ko</p>', '2021-12-07 17:54:33', 1),
(27, 'Lennard', 'Fonteijn', 'd672d4c71df14f48c164d304423440a5d4ff5dd2f45f557d24027b5c387f2251a4a5e17869660d7f6f58eb922a08c35d9aaeeb9789c74091b03e2bf1402bf169', 'l.c.j.fonteijn@hva.nl', 'user', '2021-12-23', 1, NULL, 'male', NULL, '2021-12-09 13:25:54', 0),
(58, 'Voornaam', 'Weibolt', 'wachtwoord', 'joliweibolt@gmail.com', 'user', '2022-01-12', 1, NULL, 'male', '<p> </p>', NULL, 1);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user_countries`
--

CREATE TABLE `user_countries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `countries_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Gegevens worden geëxporteerd voor tabel `user_countries`
--

INSERT INTO `user_countries` (`id`, `user_id`, `countries_id`) VALUES
(10, 27, 1),
(11, 13, 2),
(24, 13, 13),
(25, 1, 1),
(26, 1, 2),
(27, 1, 3);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user_intressed`
--

CREATE TABLE `user_intressed` (
  `id` int(11) NOT NULL,
  `user_id` int(255) NOT NULL,
  `intressed_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Gegevens worden geëxporteerd voor tabel `user_intressed`
--

INSERT INTO `user_intressed` (`id`, `user_id`, `intressed_id`, `created_at`, `updated_at`) VALUES
(16, 1, 3, '2022-01-01 18:34:15', '2022-01-01 18:34:15'),
(17, 1, 2, '2022-01-01 18:34:15', '2022-01-01 18:34:15'),
(18, 1, 2, '2022-01-13 10:58:16', '2022-01-13 10:58:16'),
(21, 13, 1, '2022-01-14 01:01:59', '2022-01-14 01:01:59');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user_matches`
--

CREATE TABLE `user_matches` (
  `id` int(11) NOT NULL,
  `requested_id` int(11) DEFAULT NULL,
  `is_match` enum('yes','no') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'no',
  `user_id` int(11) NOT NULL,
  `matched_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Gegevens worden geëxporteerd voor tabel `user_matches`
--

INSERT INTO `user_matches` (`id`, `requested_id`, `is_match`, `user_id`, `matched_at`) VALUES
(7, 1, 'yes', 58, '2022-01-13 17:21:50'),
(8, 27, 'yes', 13, '2022-01-13 19:25:45'),
(9, 13, 'yes', 1, '2022-01-14 04:46:53');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`first_user`,`second_user`),
  ADD KEY `chat_user_to_idx` (`second_user`);

--
-- Indexen voor tabel `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `intressed`
--
ALTER TABLE `intressed`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`msg_id`),
  ADD KEY `message_user_to_idx` (`to_user_id`),
  ADD KEY `message_user_from_idx` (`from_user_id`);

--
-- Indexen voor tabel `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `country_origin_id` (`country_origin_id`);

--
-- Indexen voor tabel `user_countries`
--
ALTER TABLE `user_countries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `qountries_id` (`countries_id`) USING BTREE;

--
-- Indexen voor tabel `user_intressed`
--
ALTER TABLE `user_intressed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `intressed_id` (`intressed_id`) USING BTREE;

--
-- Indexen voor tabel `user_matches`
--
ALTER TABLE `user_matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`requested_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT voor een tabel `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT voor een tabel `intressed`
--
ALTER TABLE `intressed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT voor een tabel `messages`
--
ALTER TABLE `messages`
  MODIFY `msg_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT voor een tabel `request`
--
ALTER TABLE `request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT voor een tabel `user_countries`
--
ALTER TABLE `user_countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT voor een tabel `user_intressed`
--
ALTER TABLE `user_intressed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT voor een tabel `user_matches`
--
ALTER TABLE `user_matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `message_user_from` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_user_to` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Beperkingen voor tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_country_origin` FOREIGN KEY (`country_origin_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `user_countries`
--
ALTER TABLE `user_countries`
  ADD CONSTRAINT `qountrie_user_intress` FOREIGN KEY (`countries_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `user_qountries` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `user_intressed`
--
ALTER TABLE `user_intressed`
  ADD CONSTRAINT `intress_user` FOREIGN KEY (`intressed_id`) REFERENCES `intressed` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `user_matches`
--
ALTER TABLE `user_matches`
  ADD CONSTRAINT `matches_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
