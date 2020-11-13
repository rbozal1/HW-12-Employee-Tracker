USE employeesDB;

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", "100000", "7"), 
("Software Developer", "70000", "2"), 
("Lawyer", "60000", "3"), 
("Accountant", "70000", "6"), 
("Salesperson", "40000", "1");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Doe", "1", "5"), 
("Bill", "Gates", "2", "4"), 
("Tony", "Stark", "3", "2"), 
("Elon", "Musk", "4", "3"),  
 ("Bruce", "Wayne", "5", "6");