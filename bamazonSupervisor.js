var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");

//list a set of menu options
//A) View Product Sales By dept
//B) Create New Department

//A) View Sales()-> display summarized table of department id, department name, overhead costs, product_sales, total_profit
//total_profit = product_sales - over_head_costs


//B) Create New Department
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bamazon_db"
});

function start() {
    connection.connect(function(err){
        if (err) throw err;
        console.log('You are logged in as supervisor.')
        inquireSupervisor();
    })
}

function inquireSupervisor() {
    var commandsArr = ["View Product Sales By Department", "Create New Department", "Quit"]
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name:"command",
        choices: commandsArr
    }]).then(function(response){
        var supervisorCommand = response.command;
        if (supervisorCommand === commandsArr[0]){
            showProductSales();
        } else if (supervisorCommand === commandsArr[1]) {
            createNewDept();
        } else{
            connection.end();
        }
    })
}

function showProductSales(){

}

function createNewDept(){
    //ask what type of department
    //add department
    inquirer.prompt([{
        type:"input",
        name: "dept_name",
        message: "What is the name of the new department?"
    },{
        type: "input",
        message: "What is the overhead cost for the new department?",
        name: "overhead",
        validate: validateNumber
    }]).then(function(response){
        var overhead_cost = +response.overhead;
        addDept(response.dept_name, overhead_cost);
    })
}

function addDept(name, price){
    connection.query("INSERT INTO departments SET ?",{
        department_name: name,
        over_head_costs: price
    }, function(err){
        if (err) throw err;
        console.log("Department added successfully!");
        inquireSupervisor();
    })
}

function validateNumber(userInput) {
    var reg = /^\d+$/;
    return reg.test(userInput) || "Should be a number!";
}

start();