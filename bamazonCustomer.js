var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var productsArr;
var customerProductid;
var customerQuantity;
var customerProduct;
var productIds;

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

connection.query("SELECT * FROM products as solution", function(
  error,
  results
) {
  if (error) throw error;
  productsArr = results;
  productsArr.forEach(product => pushTotable(product));
  // productIds = productsArr.map(product => product.id);
  console.log(products_table.toString());
  inquireCustomer();
});


function pushTotable(element) {
  products_table.push([
    element.id,
    element.product_name,
    element.department_name,
    ` $ ${element.price}`,
    element.stock_quantity
  ]);
}

function inquireCustomer() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What is the ID of the product you want to buy?",
        name: "productChoice",
        choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        // choices: productsIds map it
      },
      {
        type: "input",
        message: "How many units would you like to buy?",
        name: "unitsBought"
      }
    ])
    .then(function(inquirerResponse) {
      //note to self returns a string need parseInt to turn back to numbah
      customerProductid = inquirerResponse.productChoice;
      customerQuantity = +inquirerResponse.unitsBought;
      if (Number.isInteger(customerQuantity) && customerQuantity >= 0) {
        fillOrder();
      } else {
        console.log(`Pick a number or at least pick a positive number!`.red);
        inquireCustomer();
      }
    });
}

function fillOrder() {
  var productArrindex = +customerProductid - 1;
  customerProduct = productsArr[productArrindex];
  var customerProduct_name = customerProduct.product_name;
  checkStock();
}

function checkStock() {
  if (customerQuantity <= customerProduct.stock_quantity) {
    updateDB();
  } else {
    console.log(`Insufficient Quantity!`);
    inquireCustomer();
  }
}

function updateDB() {
  var originalStockQuantity = +customerProduct.stock_quantity;
  var newStockQuantity = originalStockQuantity - customerQuantity;
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newStockQuantity
      },
      {
        id: customerProductid
      }
    ],
    function(error, results, fields) {
      if (error) throw error;
      var customerReceipt = customerQuantity * customerProduct.price;
      console.log(
        `Your total cost of your purchase is $${customerReceipt}. Thanks for shopping at BAMazon!`.magenta
      );
      connection.end();
    }
  );
}
