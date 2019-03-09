var inquirer = require("inquirer");
var mysql = require("mysql");
var choicesArray = [];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("~ * ~ * ~ * ~ * ~  MANAGER ACCESS - WELCOME TO BAMAZON!  ~ * ~ * ~ * ~ * ~");
    start();
  });


function start() {
    inquirer
    .prompt([
        {
            name: "mgrChoices",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ]).then(function (answer) {
        switch (answer.mgrChoices) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;

            case "Exit":
                exit();
                break;
        }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        console.table(results);        
        start();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        for(i=0;i<results.length;i++) {
            if (results[i].stk_qty <= 5) {
                console.log("~ * ~  LOW INVENTORY!  ~ * ~");
                console.log("Item ID: " + results[i].item_id,
                "\nProduct Name: " + results[i].product_name,
                "\nDepartment Name: " + results[i].dept_name,
                "\nPrice: " + results[i].price,
                "\nStock Quantity: " + results[i].stk_qty
                );
            } else {
                console.log(results[i].product_name + " inventory levels look good!");
            }
        } 
        start();
    });
}

function addInventory() {
    inquirer
    .prompt([
        {
            name: "itemSelected",
            type: "input",
            message: "What is the item_id you'd like to add inventory to?",
            filter: Number,
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }      
        },
        {
            name: "numberToAdd",
            type: "input",
            message: "How many would you like to add?",
            filter: Number,
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }      
        }
    ]).then(function(answer) {

     connection.query("SELECT * FROM products", function(err, results) {
         if (err) throw err;

        var itemSelected;
        var numberToAdd = answer.numberToAdd;

        for (i=0;i<results.length;i++) {
            if (results[i].item_id === parseInt(answer.itemSelected)) {
                itemSelected = results[i];
            }
        }

        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stk_qty: (itemSelected.stk_qty + parseInt(numberToAdd))
                },
                {
                    item_id: itemSelected.item_id
                }
            ],
            function(err) {
                if (err) throw err;

                console.log("A quantity of " + numberToAdd + " has been added to the " + itemSelected.product_name + " inventory!");
                start();
            }
        );
     })
});
}

function addProduct() {
    inquirer
    .prompt([
        {
            name: "prodName",
            type: "input",
            message: "What is the product name?" 
        },
        {
            name: "deptName",
            type: "list",
            message: "What department do you want to add it to?",
            choices: [
                "Poodle Palace",
                "Treats",
                "Doodle Dallies"
            ]
        },
        {
            name: "listPrice",
            type: "input",
            message: "What is the list price?",
            filter: Number,
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name: "quantity",
            type: "input",
            message: "What quantity will be added to stock?",
            filter: Number,
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }      
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.prodName,
                dept_name: answer.deptName, 
                price: answer.listPrice,
                stk_qty: answer.quantity
            },
        function(err) {
            if (err) throw err;

            console.log(answer.prodName + " was successfully added!");
            start();
        }
        );
    })
}

function exit() {
    connection.end();
}

