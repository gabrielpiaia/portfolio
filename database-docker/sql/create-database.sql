-- Arquivo: sql/create_databases.sql

-- Criação de um banco de dados de exemplo
CREATE DATABASE IF NOT EXISTS database_site;

-- Uso do banco de dados criado
USE database_site;

-- Exemplo de criação de tabela
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT false
);



CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parentId INT,
    FOREIGN KEY (parentId) REFERENCES categories(id)
);


CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    imageUrl VARCHAR(1000),
    content BLOB NOT NULL,
    userId INT NOT NULL,
    categoryId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (categoryId) REFERENCES categories(id)
);