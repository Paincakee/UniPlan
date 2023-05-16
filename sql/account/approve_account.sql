INSERT INTO `accounts`(`id`, `firstName`, `lastName`, `email`, `studentNumber`, `password`, `accountType`, `admin`) 
VALUES (null, '%firstName%', '%lastName%', '%email%', '%studentNumber%', '%password%', '%accountType%', false)
UNION
DELETE FROM `accounts_pending` WHERE `id` = '%id%'