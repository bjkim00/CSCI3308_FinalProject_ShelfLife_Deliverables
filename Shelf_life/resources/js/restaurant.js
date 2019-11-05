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
INSERT INTO INVENTORY(Ingredient_ID, Ingredient_Group_ID,Ingredient_Name,Ingredient_Quantity,Ingredient_Cost,Ingredient_Unit)
INSERT INTO INVENTORY(Ingredient_ID, Ingredient_Group_ID,Ingredient_Name,Ingredient_Quantity,Ingredient_Cost,Ingredient_Unit)
VALUES (1,2,'Cheese',30,0.5,'oz'),(2,1,'steak',15,2,'oz'),(3,3,'bread',5,1,'loaf'),(4,3,'pasta',20,0.1,'oz');

// filling Dish_2_Ingredients
INSERT INTO Dish_2_Ingredients VALUES(1,(SELECT ingredient_id FROM INVENTORY WHERE ingredient_name='pasta'),5);
//summing up each ingredient used in dish
SELECT COUNT(ingredient_quanity) FROM Dish_2_Ingredients WHERE dish_id=1 and ingredient_id=1;
//update inventory
UPDATE inventory SET ingredient_quantity=(SELECT ingredient_quantity FROM inventory WHERE ingredient_id=1)-(SELECT ingredient_quanity FROM dish_2_ingredients WHERE dish_id=1 and ingredient_id=1) WHERE ingredient_id=1;
