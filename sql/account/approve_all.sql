INSERT INTO accounts (id, firstName, lastName, email, studentNumber, password, accountType, admin)
SELECT null, firstName, lastName, email, studentNumber, password, accountType, false
FROM accounts_pending
