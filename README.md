# bamazon
An Amazon-like storefront using MySQL. This app will take in orders from customers and deplete stock from the store's inventory.

### Overview
A command line Amazon-like store using `MySQL`, `Node.js`, `inquirer`. Take your pick between being the `bamazonCustomer`, `bamazonManager`, or `bamazonSupervisor`. Note: Overhead costs are pricy, but you can easily make it up with lots of sales.  

## bamazon Customer
* Start by entering `node bamazonCustomer` in your command line. 
* As soon as you enter, a catalog of what is in store will appear. 
> ![bamazon Customer](assets/bamazonCustomerimg.png)
* You will be asked what id of the product you would like to buy and how many units. 
* Once the purchase is successful, you will receive a receipt. 
> ![bamazon Customer1](assets/bamazonCustomer1.gif)
* If the store does not have the correct quantity, CLI will display `Insufficient Quantity!` and prompt you to buy something else. 

