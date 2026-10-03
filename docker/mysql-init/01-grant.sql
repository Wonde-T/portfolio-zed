-- Runs once, on first initialisation of an empty MySQL data directory.
--
-- The `portfolio` user needs CREATE DATABASE so `prisma migrate dev` can spin
-- up its throwaway shadow database. Production-grade least privilege is not the
-- goal here; this file only serves local development.

GRANT ALL PRIVILEGES ON *.* TO 'portfolio'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;