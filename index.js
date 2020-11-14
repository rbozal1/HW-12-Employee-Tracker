
//packages
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; 
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
            "remove employee",
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
            case "remove employee":
                removeEmployee();
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
    console.log("Viewing a list of departments\n");
  
    connection.query("SELECT * FROM department ", function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Departments Displayed!\n");
      start();
      
    });
  }

  function addEmployee() {
    console.log("Adding an new Employee\n");
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
          console.log("A new Employee was added!\n");
          start();
        });
      });
  }

  function addDepartment() {
    console.log("Adding a new Department!\n");
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the department that you want to add?"
      }
    ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, res) {
            if (err) throw err;
            console.table(res);
            console.log("A new Department was added!\n");
            start();
        });
    });
  }

  function removeEmployee() {
    console.log("Deleting an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteEmployeeChoices);
  });
  }

  function promptDelete(deleteEmployeeChoices) {

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: deleteEmployeeChoices
        }
      ])
      .then(function (answer) {
  
        var query = `DELETE FROM employee WHERE ?`;
        // when finished prompting, insert a new item into the db with that info
        connection.query(query, { id: answer.employeeId }, function (err, res) {
          if (err) throw err;
  
          console.table(res);
          console.log(res.affectedRows + "Deleted!\n");
  
          start();
        });
        // console.log(query.sql);
      });
  }

  function addRole() {
    console.log("Adding a new role!\n");
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
        connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", [res.title, res.salary, res.department_id], function (err, res) {
          if (err) throw err;
          console.table(res);
          console.log("A new role was added!\n");
          start();
        });
    });

}

function updateEmployeeRole() {
    console.log("Updating an Employee!\n");
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
          console.log("Employee has been updated!\n");
          start();
      });
  });

}

function viewAllRoles(){
    console.log("Viewing Roles!\n");
  connection.query("SELECT role.*, department.name FROM role LEFT JOIN department ON department.id = role.department_id", function (err,res){
    if (err) throw err;
    console.table(res);
    console.log("Roles are displayed!\n");
    start();
  }
  )};
