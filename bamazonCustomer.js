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

connection.query("SELECT * FROM products as solution", function(error,results) {
  if (error) throw error;

  for (var i = 0; i < results.length; i++) {
    products_table.push([
      results[i].id,
      results[i].product_name,
      results[i].department_name,
      results[i].price,
      results[i].stock_quantity
    ]);
  }

  console.log(products_table.toString());
});

connection.end();
