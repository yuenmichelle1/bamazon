var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var commandsArr = [
  "View Products for Sale",
  "View Low Inventory",
  "Add To Inventory",
  "Add New Product"
];
var productsArr;

//Create a table with headings: item id, product name, department name, price, quantity in a pretty blue color
var products_table = new Table({
  head: [
    "Item Id".cyan,
    "Product Name".cyan,
    "Department Name".cyan,
    "Price".cyan,
    "# In Stock".cyan
  ]
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect();

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
      showLowInventory();
      break;
    //CASE: ADD TO INVENTORY
    case commandsArr[2]:
      inquireItemtoRestock();
      break;
    //CASE: ADD NEW PRODUCT  
    case commandsArr[3]:
      inquireNewProduct();
      break;
    default:
      break;
  }
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

function showProductstable() {
  connection.query("SELECT * FROM products as solution", function(
    error,
    results
  ) {
    if (error) throw error;
    productsArr = results;
    productsArr.forEach(product => pushTotable(products_table, product));
    console.log(products_table.toString());
    askToDoAgain();
  });
}

function pushTotable(table, element) {
  table.push([
    element.id,
    element.product_name,
    element.department_name,
    ` $ ${element.price}`,
    element.stock_quantity
  ]);
}

function showLowInventory() {
  var lowStock_table = new Table({
    head: [
      "Item Id".red,
      "Product Name".red,
      "Department Name".red,
      "Price".red,
      "# In Stock".red
    ]
  });
  connection.query(
    "SELECT * FROM products as solution WHERE stock_quantity < 5",
    function(error, results) {
      if (error) throw error;
      var productsArray = results;
      productsArray.forEach(product => pushTotable(lowStock_table, product));
      console.log(lowStock_table.toString());
      askToDoAgain();
    }
  );
}

function inquireItemtoRestock(arr) {
  connection.query("SELECT * FROM products as solution", function(
    error,
    results
  ) {
    if (error) throw error;
    productsArr = results;
    inquirer
      .prompt([
        {
          type: "list",
          message: "What is the Product Id you want to restock?",
          name: "itemRestockid",
          choices: productsArr.map(product => `${product.id}`)
        },
        {
          type: "input",
          message: "How many Units do you want to add?",
          name: "units",
          validate: validateNumber
        }
      ])
      .then(function(inquirerResponse) {
        var unitsToAdd = +inquirerResponse.units;
        var productId = +inquirerResponse.itemRestockid;
        connection.query(`SELECT stock_quantity FROM products WHERE id = ${productId}`, function (err, results){
          if (err) throw err;
          var currentStock = +results[0].stock_quantity;
          addStock(unitsToAdd + currentStock, productId);
        })
      });
  });
}

function addStock(units, id) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: units
      },
      {
        id: id
      }
    ],
    function(error, results, fields) {
      if (error) throw error;
      console.log(`Your item has been restocked new stock quantity for Product Id ${id} is ${units}`);
      askToDoAgain();
    }
  );
}

function validateNumber(userInput) {
  var reg = /^\d+$/;
  return reg.test(userInput) || "Should be a number!";
}

//IF D) What product name, dept name, price, stock quantity, INSERT into SQL table, print product_name has been added. Do/Inquire anything else? if no, end
function inquireNewProduct(){
  inquirer.prompt([{
    type: "input",
    name: "prod_name",
    message: "What is the product name you want to add?"
  },{
    type: "input",
    name: "dept_name",
    message: "What department should it belong to?"
  },{
    type: "input",
    name: "price",
    message: "What is the product's price?",
    validate: validateNumber
  },{
    type: "input",
    name: "quantity",
    message: "How much units do you want to add to the Inventory?",
    validate: validateNumber
  }]).then(function(response){
    addNewProduct(response);

  })
}
function addNewProduct(answer){
  connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: answer.prod_name,
      department_name: answer.dept_name,
      price: answer.price,
      stock_quantity: answer.quantity
    },function(err) {
      if (err) throw err;
      console.log("Your new product was added successfully!");
      // re-prompt the user for if they want to bid or post
      inquireManager();
    }
  );

}

inquireManager();