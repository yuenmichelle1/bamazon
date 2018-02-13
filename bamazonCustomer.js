var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

connection.connect();
