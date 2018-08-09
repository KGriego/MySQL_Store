var mysql = require("mysql");
var inquirer = require("inquirer");
var total = 0;
var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "BamazonDB"
});
showOptions();

function showOptions() {
  var id = "";
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) return console.log(err);
    console.log("\n");
    console.table(res);
    console.log("\n");
    inquirer
      .prompt([
        {
          type: "list",
          message: "What is the id of the product you want to buy?",
          name: "userIdChoice"
        }
      ])
      .then(function(userResponse) {
        id = parseInt(userResponse.userIdChoice);
        inquirer
          .prompt([
            {
              type: "input",
              message: "How many items do you want to buy??",
              name: "quantity"
            }
          ])
          .then(function(UsrQuanInput) {
            var query = connection.query(
              "SELECT * FROM products WHERE id = ?",
              [id],
              function(err, res) {
                if (err) return console.log(err);

                var result = res[0];
                var quantity = parseInt(UsrQuanInput.quantity);


                if (quantity <= result.Stock_Quantity) {
                  console.log(result.Stock_Quantity - quantity);
                  total += result.Stock_Quantity - quantity;

                  console.log("\n Your total is: " + total);

                  updateOptions(id, quantity, result.Stock_Quantity);
                } else {
                  console.log("We are out of inventory. We apologize for the inconvience.");
                  showOptions();
                }
              }
            );
          });
      });
  });
}

function updateOptions(productId, quantityAmnt, inStock) {
  connection.query(
    "UPDATE products SET Stock_Quantity = ? WHERE id = ?",
    [inStock - quantityAmnt, productId],
    function(err, res) {
      if (err) return console.log(err);
      showOptions();
    }
  );
}
