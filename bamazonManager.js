var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var commandsArr = ["View Products for Sale", "View Low Inventory","Add To Inventory","Add New Product"];

//Create a table with headings: item id, product name, department name, price, quantity in a pretty blue color
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

//list a set of menu items [A) View Products for Sale, B) View Low Inventory, C) Add TO Inventory, D)Add New Product]
//IF A) then show the products table (inquire confirm Would you like to do anything else?, if yes, inquire manager, if no, end)
//If B) View Low Inventory , list all items that are have stock Quantity < 5, inquire confirm Would you like to do anything else?, if yes, inquire manager, if no, end )
//IF C) prompt which item_ID do you want to restock in the store? prompt how many units do you want to add? //update sql and print 'You have added ...units, there are now. ..in stock. Inquire confirm you wanna do anything else,
//IF D) What product name, dept name, price, stock quantity, INSERT into SQL table, print product_name has been added. Do/Inquire anything else? if no, end

function inquireManager() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "managerJob",
        choices: commandsArr
      }
    ])
    .then(function(inquirerResponse) {
      var managerCommand = inquirerResponse.managerJob;
      doCommand(managerCommand);
      // console.log(managerCommand);
    });
}

function doCommand(command) {
  switch (command) {
    //Case:  View Products for Sale
    case commandsArr[0]:
      showProductstable();
      break;
    //CASE: VIEW LOW INVENTORY
    case commandsArr[1]:
  }
}

function showProductstable() {
  connection.query("SELECT * FROM products as solution", function(
    error,
    results
  ) {
    if (error) throw error;
    var productsArr = results;
    productsArr.forEach(product => pushTotable(product));
    console.log(products_table.toString());
    askToDoAgain();
  });
}

function pushTotable(element) {
  products_table.push([
    element.id,
    element.product_name,
    element.department_name,
    ` $ ${element.price}`,
    element.stock_quantity
  ]);
}

function askToDoAgain() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Do you want to do anything else?",
        name: "doAgain"
      }
    ])
    .then(function(inquirerResponse) {
      if (inquirerResponse.doAgain) {
        inquireManager();
      } else {
        connection.end();
      }
    });
}

inquireManager();
