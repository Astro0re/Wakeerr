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

-- @block
-- Insert rows into table 'TableName'
INSERT INTO User_ID
( -- columns to insert data into
 [User_ID], [User_Name], [User_Email], [User_Password]
)
VALUES
( -- first row: values for the columns in the list above
 Column1_Value, Column2_Value, Column3_Value
),
( -- second row: values for the columns in the list above
 Column1_Value, Column2_Value, Column3_Value
)
-- add more rows here
GO