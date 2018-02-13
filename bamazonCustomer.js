var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors= require('colors');

var products_table = new Table({
  head: ["Item Id".cyan, "Product Name".cyan, "Department Name".cyan, "Price".cyan, "# In Stock".cyan]
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
  results.forEach(product => pushTotable(product));
  console.log(products_table.toString());
  inquirer.prompt([{
      type: "list", 
      message: "What is the ID of the product you want to buy?",
      name:"productChoice", 
      choices: ["1" , "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10"]
    }, {
      type: "input", 
      message: "How many units would you like to buy?",
      name: "unitsBought"
    }
    ]).then(function(inquirerResponse){
      //note to self returns a string need parseInt to turn back to numbah
      console.log(+inquirerResponse.productChoice + +inquirerResponse.unitsBought);
    } 
    )
});

connection.end();

function pushTotable(element) {
  products_table.push([element.id, element.product_name, element.department_name,` $ ${element.price}`, element.stock_quantity]);
}
