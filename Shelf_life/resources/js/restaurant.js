\\node js file 
\\testing entering info into database 


var express= require('express'),
app=express();
var pg=require('pg-promise')();
const dbConfig= {
	host: 'localhost',
	port: 5431,  //probably 5432 for you
	database: 'shalflife2',   //enter in name of your database
	user: 'haleyhartin',   //enter in your username password for pg
	password:'abc123'
};

var db= pg(dbConfig);
//testing for entering specific values
var insert = "INSERT INTO USERS(Restaurant_Id, Name, Phone, Address_line_1, Address_line_2, User_Name, User_Password) VALUES (13, 'In n Out', '3034444425', '2800 15th st', 'C0 80303', 'Mark_Davis', 'CO 80303');";
var select = 'SELECT * FROM USERS;';
	db.any(insert)
		.catch(function(err)
		{
			console.log("can't insert",err);
		})
	db.any(select)
		.then(function(rows){
			for(i=0; i<rows.length; i++)
			{
				console.log(rows[i]);
			}
			})
		.catch(function(err){
			console.log("error message",err);
		});
