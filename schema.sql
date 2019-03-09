DROP DATABASE bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NOT NULL,
dept_name VARCHAR(50) NOT NULL,
price DECIMAL(4,2) NOT NULL,
stk_qty INT(5) NOT NULL,
PRIMARY KEY (item_id)
)

SELECT * FROM products;
