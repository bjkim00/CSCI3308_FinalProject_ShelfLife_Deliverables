var express= require('express'),
app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var http= require('http');
var fs= require('fs');

//const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));
app.use(express.static('public'));

var pg=require('pg-promise')();


const dbConfig={
	host: 'localhost',
	port: 5431,  //probably 5432 for you
	database: 'shalflife2',   //enter in your username password for pg
	user: 'haleyhartin',
	password:'abc123'
};
var db=pg(dbConfig);


app.get('/login', function(req, res) {
    //res.sendFile('views/login.html', ,{root: __dirname })
    res.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/login.html','/Users/haleyhartin/Documents/ShelfLife/resources/css/signin.css')
		console.log('app.get');
		console.log(req.action);
});

app.post('/auth', function(request, response) {
  console.log('/auth');
	var username = request.body.em;
	var password = request.body.pw;
	console.log(username);
	console.log(password);
	//var popup= require('popups');
	if (username && password) {
		var sql= "SELECT * FROM USERS WHERE user_Name = $1 AND user_Password = $2;";
  	db.any(sql, [username, password])
  			.then(function(results){
						console.log(results.length);
							if (results.length > 0) {
									//request.session.loggedin = true;
									//request.session.username = username;
									response.redirect('/home');
						} else {
								response.redirect('/login');
				}
				response.end();
				})
				.catch(function(err){
 				console.log("error",err);
			})
} else {
	response.redirect('/login');
	response.end();
  }
});

app.post('/reg', function(request, response) {
 console.log("redirect");
 response.redirect('/register');
 response.end();
});

app.get('/register', function(request, response) {
  console.log("in register");
	response.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/register.html')
	var _name = 'bob';
	var _phone= '777-777-7777';
	var _address1 = '6728 20th st';
	var _address2 = 'Boulder CO';
	var _username = 'Bob_smith@gmailcom';
	var _password = 'abrhklg';
  var newid = 0;
	var count= "SELECT COUNT(*) FROM USERS;";
	db.any(count)
	.then(function(results){
      console.log(results);
			console.log("count: ", results[0].count);
      newid=Number(results[0].count) + 1;
			console.log("newid: ", newid);
		})


	//var newid= count+1;
	var sql= "INSERT INTO USERS (Restaurant_Id, Name, Phone, Address_line_1, Address_line_2, User_Name, User_Password) VALUES ($1, $2, $3, $4, $5, $6, $7);";
	db.any(sql, [newid, _name, _phone, _address1, _address2, _username, _password ] )
			.then(function(results){
				console.log(_name);
			})
			.catch(function(err){
		console.log("cannot insert",err);
	});
});
app.get('/home', function(request, response) {
	response.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/home.html')
});

app.listen(3000);
console.log('3000 is the magic port');

