var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var products_table = new Table({
  head: ["Item Id", "Product Name", "Department Name", "Price", "# In Stock"]
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect();

connection.query("SELECT * FROM products as solution", function( error,results) {
  if (error) throw error;

  console.log(products_table.toString());
  console.log(results[0]);
});

connection.end();
