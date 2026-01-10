CREATE DATABASE users_todo;

\c users_todo;

CREATE TABLE users (
   id uuid DEFAULT uuidv7() PRIMARY KEY,
   username VARCHAR(255) UNIQUE NOT NULL,
   password TEXT NOT NULL
);