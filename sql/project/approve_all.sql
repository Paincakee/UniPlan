INSERT INTO projects (`id`, `userId`, `email`, `title`, `description`, `contactInfo`, `courses`)
SELECT null, userId, email, title, description, contactInfo, courses
FROM projects_pending
