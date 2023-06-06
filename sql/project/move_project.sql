INSERT INTO `projects` (`id`, `userId`, `email`, `title`, `description`, `contactInfo`, `courses`)
SELECT `id`, `userId`, `email`, `title`, `description`, `contactInfo`, `courses`
FROM `projects_pending` WHERE `id` = '%id%'
