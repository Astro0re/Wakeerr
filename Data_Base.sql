-- @block
CREATE DATABASE Wakeerr;
USE Wakeerr;

-- @block
CREATE TABLE User_ID (
    User_ID INT PRIMARY KEY,
    User_Name VARCHAR(255) NOT NULL,
    User_Email VARCHAR(255) NOT NULL,
    User_Password VARCHAR(255) NOT NULL
);

-- @block
CREATE TABLE Score_Info (
    User_ID INT PRIMARY KEY,
    Score INT,
    FOREIGN KEY (User_ID) REFERENCES User_ID(User_ID),
    
);
