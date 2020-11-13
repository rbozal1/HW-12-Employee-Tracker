const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "asap0921",
    database: "employeesdb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    inquirer.prompt({
        message: "Hello Roger! What would you like to do ?",
        type: "list",
        choices: [
            "view all employees",
            "view all departments",
            "view all roles",
            "add employee",
            "add department",
            "add role",
            "update employee role",
            "QUIT"   
        ],
        name:"answers"
    }).then(function ({answers}) {
        // console.log(answers.choice);
        switch (answers) {
            case "view all employees":
                displayEmployees();
                break;
            case "view all departments":
                displayDept();
                break;
            case "add employee":
                addEmployee();
                break;
            case "add department":
                addDepartment();
                break;    
            case "Remove Employees":
                removeEmployees();
                break;
            case "add role":
                addRole();
                break;
            case "update employee role":
                updateEmployeeRole();
                break;
            case "view all roles":
                viewAllRoles();
                break;    
            case "QUIT":
                connection.end();
                break;                    
        }
    }

)};

function displayEmployees() {
    console.log("Viewing Employees \n");

    connection.query("SELECT employee.first_name, employee.last_name, role.title AS \"role\", managers.first_name AS \"manager\" FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee managers ON employee.manager_id = managers.id GROUP BY employee.id", function(err,res) {
        if (err) throw err;


        console.table(res);
        console.log("Employees displayed!\n");
        start();
    }); 

}

function displayDept() {
    console.log("Viewing employees by department\n");
  
    connection.query("SELECT * FROM department ", function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Departments Displayed!\n");
      start();
      
    });
  }

  function addEmployee() {

    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employees first name?"
      },
      {
          type: "input",
          name: "lastName",
          message: "What is the employees last name?"
      },
      {
          type: "number",
          name: "roleId",
          message: "What is the employees role ID"
      },
      {
          type: "number",
          name: "managerId",
          message: "What is the employees manager's ID?" 
        }
      ])
      .then(function (res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], function (err, res) {
          if (err) throw err;
  
          console.table(res);
  
          start();
        });
      });
  }

  function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the department that you want to add?"
      }
    ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
    });
  }

  function addRole() {
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        }, {
            message: "enter salary:",
            type: "number",
            name: "salary"
        }, {
            message: "enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [res.title, res.salary, res.department_id], function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
        });
    });

}

function updateEmployeeRole() {
  inquirer.prompt([
      {
          message: "which employee would you like to update? (use first name only for now)",
          type: "input",
          name: "name"
      }, {
          message: "enter the new role ID:",
          type: "number",
          name: "role_id"
      }
  ]).then(function (res) {
      connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [res.role_id, res.name], function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
      });
  });

}

function viewAllRoles(){
  connection.query("SELECT role.*, department.name FROM role LEFT JOIN department ON department.id = role.department_id", function (err,res){
    if (err) throw err;
    console.table(res);
    start();
  }
  )};
