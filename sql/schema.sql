DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

use employeesDB;

create table department(
id INT NOT NULL AUTO_INCREMENT,
name varchar(30) null,
primary key(id)
);

create table role(
id INT NOT NULL AUTO_INCREMENT,
title varchar(30) null,
salary decimal(10.3) null,
department_id int null,
primary key(id)
);

create table employee (
id INT NOT NULL AUTO_INCREMENT,
first_name varchar(30) null,
last_name  varchar(30) null,
role_id int null,
manager_id int null,
primary key(id)
);