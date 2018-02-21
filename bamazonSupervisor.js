var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var departments_table = new Table({
    head: ["Department Id".cyan, "Department Name".cyan, "Overhead Costs".cyan, "Product Sales".cyan, "Total Profit".cyan]
})
var deptsArr;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bamazon_db"
});

function start() {
  connection.connect(function(err) {
    if (err) throw err;
    console.log("You are logged in as supervisor.");
    inquireSupervisor();
  });
}

function inquireSupervisor() {
  var commandsArr = [
    "View Product Sales By Department",
    "Create New Department",
    "Quit"
  ];
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "command",
        choices: commandsArr
      }
    ])
    .then(function(response) {
      var supervisorCommand = response.command;
      //case show product sales
      if (supervisorCommand === commandsArr[0]) {
        showProductSales();
      } else if (supervisorCommand === commandsArr[1]) {
        createNewDept();
      } else {
        connection.end();
      }
    });
}
function showProductSales() {
    var sqlQuery = "SELECT departments.id, departments.department_name,departments.over_head_costs, SUM(products.product_sales) AS alias, SUM(products.product_sales) - departments.over_head_costs AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.id;"
    connection.query(sqlQuery, function(err, results){
        if (err) throw err;
        deptsArr = results;
        deptsArr.forEach(dept => pushToDeptTable(dept));
        console.log(departments_table.toString());
        inquireSupervisor();
    })
}

function pushToDeptTable(element){
    departments_table.push([element.id, element.department_name, element.over_head_costs, String(element.alias), String(element.total_profit)]);
}

function createNewDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept_name",
        message: "What is the name of the new department?"
      },
      {
        type: "input",
        message: "What is the overhead cost for the new department?",
        name: "overhead",
        validate: validateNumber
      }
    ])
    .then(function(response) {
      var overhead_cost = +response.overhead;
      addDept(response.dept_name, overhead_cost);
    });
}

function addDept(name, price) {
  connection.query(
    "INSERT INTO departments SET ?",
    {
      department_name: name,
      over_head_costs: price
    },
    function(err) {
      if (err) throw err;
      console.log("Department added successfully!");
      inquireSupervisor();
    }
  );
}

function validateNumber(userInput) {
  var reg = /^\d+$/;
  return reg.test(userInput) || "Should be a number!";
}

start();
