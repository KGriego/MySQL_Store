var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazondb"
});

options();

function options() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What do you want to do?",
        choices: [
          "View products on sale",
          "View low inventory",
          "Add to inventory",
          "Add new product",
          "Quit"
        ],
        name: "choice"
      }
    ])
    .then(function(managerChoice) {
      switch (managerChoice.choice) {
        case "View products on sale":
          viewSales();
          break;
        case "View low inventory":
          viewLow();
          break;
        case "Add to inventory":
          addInv();
          break;
        case "Add new product":
          addProduct();
          break;
        case "Quit":
          connection.end();
          break;
        default:
          console.log(
            "unhandled choice, please see your choice:" + managerChoice.choice
          );
          connection.end();
          break;
      }
    });
}

function viewSales() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) return console.log(err);
    console.log("\n");
    console.table(res);
    console.log("\n");
    options();
  });
}

function viewLow() {
  connection.query("SELECT * FROM products WHERE stock_quantity <5", function(
    err,
    res
  ) {
    if (err) return console.log(err);
    console.log(res);
    if (res.length === 0) {
      console.log("No low inventory");
      options();
    } else {
      console.log("\n");
      console.table(res);
      console.log("\n");
      options();
    }
  });
}

function addInv() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) return console.log(err);
    console.log("\n");
    console.table(res);
    console.log("\n");
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the id of the product you want to add??",
          name: "id"
        },
        {
          type: "input",
          message: "How many do you want to add?",
          name: "Quantity"
        }
      ])
      .then(function(managerQuanInput) {
        var productChosen = managerQuanInput.id;
        var stockQuan = parseInt(managerQuanInput.Quantity);
        var originalQuan = res[productChosen - 1].Stock_Quantity;
        connection.query(
          "UPDATE products SET stock_quantity = ? WHERE id = ?",
          [stockQuan + originalQuan, productChosen],
          function(err, res) {
            if (err) return console.log(err);
            console.log("Stock successfully added!");
            options();
          }
        );
      });
  });
}

function addProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the product?",
        name: "name"
      },
      {
        type: "input",
        message: "What Department does the product go in?",
        name: "department"
      },
      {
        type: "input",
        message: "How much does this product cost?",
        name: "price"
      },
      {
        type: "input",
        message: "Quanity of product?",
        name: "quantity"
      }
    ])
    .then(function(addProductRes) {
      var query = connection.query(
        "INSERT INTO products(Product_Name, Department, Price, Stock_Quantity) VALUES (?,?,?,?)",
        [
          addProductRes.name,
          addProductRes.department,
          addProductRes.price,
          addProductRes.quantity
        ],
        function(err, res) {
          if (err) {
            return console.log(err);
          }
          console.log("Successfully added product: " + addProductRes.name);
          options();
        }
      );
    });
}
