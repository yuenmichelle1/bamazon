-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect animals_db --
USE bamazon_db;


CREATE TABLE products (
  id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30),
  price INTEGER(10),
  -- How much of product is available in stroes --
  stock_quantity INTEGER,
  -- Sets id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kitchenaid Mixer", "Home and Kitchen", 230, 20),  ("firestick", "Electronics", 50, 10),  ("Wonder Woman Action Figure", "Toys and Games", 11, 5),  ("Barbie Doctor Playset", "Toys and Games", 35, 100),  ("Basketball Hoop", "Sports and Fitness", 28, 40),  ("Dartboard", "Sports and Fitness", 42, 42),  ("Hunger Games Trilogy", "Books", 25, 18) ,  ("Fifty Shades of Grey", "Books", 30, 2),  ("Gucci Clutch", "Fashion", 400, 20),  ("Converse Chuck Taylors", "Fashion", 35, 35)

SELECT * FROM products;