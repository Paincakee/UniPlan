SELECT `studentNumber` FROM `accounts` WHERE `studentNumber` = '%studentNumber%'
UNION
SELECT `studentNumber` FROM `accounts_pending` WHERE `studentNumber` = '%studentNumber%'
