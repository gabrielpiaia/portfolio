-- Arquivo: sql/mysql-init.sql

CREATE USER 'gabriel2'@'%' IDENTIFIED BY 'gabriel123!@#';
GRANT ALL PRIVILEGES ON *.* TO 'gabriel2'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
