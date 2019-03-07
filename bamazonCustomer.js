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
  password: "winston12",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("~ * ~ * ~ * ~ * ~  WELCOME TO BAMAZON!  ~ * ~ * ~ * ~ * ~");
    start();
  });

  function start() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        console.table(results);        
        buyIt();
  });
}


function buyIt() {
    inquirer
    .prompt([
        {
            name: "itemSelected",
            type: "input",
            message: "What is the item_id you'd like to buy?",
            filter: Number
        },
        {
            name: "numberWanted",
            type: "input",
            message: "How many would you like?",
            filter: Number
        }
    ]).then(function(answer) {

     connection.query("SELECT * FROM products", function(err, results) {
         if (err) throw err;

        var itemSelected;
        var numberWanted = answer.numberWanted;

        for (i=0;i<results.length;i++) {
            if (results[i].item_id === parseInt(answer.itemSelected)) {
                itemSelected = results[i];
            }
        }

         if (itemSelected.stk_qty >= parseInt(numberWanted)) {
             connection.query(
                 "UPDATE products SET ? WHERE ?",
                 [
                     {
                         stk_qty: (itemSelected.stk_qty - parseInt(answer.numberWanted))
                     },
                     {
                         item_id: itemSelected.item_id
                     }
                 ],
                 function(err) {
                     if (err) throw err;

                     console.log("Thank you for your business! Your total is $" + parseInt(numberWanted) * itemSelected.price + "!");
                     start();
                 }
             );

         } else {
             console.log("Insufficient quantity!");
             start();
         }
     })
});
}

