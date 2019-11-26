const http = require('http');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dbb = require('./queries');
const hostname = '127.0.0.1';
const port = 3000
const fs = require('fs');//read login file
var pg=require('pg-promise')();
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const dbConfig={
	host: 'localhost',
	port: 5431,  //probably 5432 for you
	database: 'shalflife2',   //enter in your username password for pg
	user: 'haleyhartin',
	password:'abc123'
};

var db=pg(dbConfig);
//create six functions for six routes
app.get('/users', dbb.getUsers)
app.get('/users/:id', dbb.getUserById)
app.post('/users', dbb.createUser)
app.put('/users/:id', dbb.updateUser)
app.delete('/users/:id', dbb.deleteUser)



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

app.get('/register', (request, response) => {
  console.log("in register");
  response.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/register2.html')
})

app.get('/home', function(request, response) {
	response.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/home.html')
});

app.listen(3000);
console.log('3000 is the magic port');
//app.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
//});
