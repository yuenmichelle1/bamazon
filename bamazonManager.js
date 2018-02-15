var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");

//list a set of menu items [A) View Products for Sale, B) View Low Inventory, C) Add TO Inventory, D)Add New Product]
//IF A) then show the products table (inquire confirm Would you like to do anything else?, if yes, inquire manager, if no, end)
//If B) View Low Inventory , list all items that are have stock Quantity < 5, inquire confirm Would you like to do anything else?, if yes, inquire manager, if no, end )
//IF C) prompt which item_ID do you want to restock in the store? prompt how many units do you want to add? //update sql and print 'You have added ...units, there are now. ..in stock. Inquire confirm you wanna do anything else, 
//IF D) What product name, dept name, price, stock quantity, INSERT into SQL table, print product_name has been added. Do/Inquire anything else? if no, end

function inquireManager () {
    inquirer.prompt([{
    type: "list",
    message:"What would you like to do?",
    name:"managerJob",
    choices:["View Products for Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]
}]).then(function(managerResponse){
    console.log(managerResponse.managerJob);
})
}

inquireManager();