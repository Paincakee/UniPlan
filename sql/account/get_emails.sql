SELECT `email` FROM `accounts` WHERE `email` = '%email%'
UNION
SELECT `email` FROM `accounts_pending` WHERE `email` = '%email%'