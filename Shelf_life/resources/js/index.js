const http = require('http');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries');
const hostname = '127.0.0.1';
const port = 3000
const fs = require('fs');//read login file

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//create six functions for six routes
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)


app.get('/login', function(req, res) {
    //res.sendFile('views/login.html', ,{root: __dirname })
    res.sendFile('/Users/maurovargas/Documents/CSCI3308/node-api-postgres/views/login.html','/Users/maurovargas/Documents/CSCI3308/node-api-postgres/resources/css/signin.css')
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
  response.sendFile('/Users/maurovargas/Documents/CSCI3308/node-api-postgres/views/register.html')
})

app.get('/home', function(request, response) {
	response.sendFile('/Users/maurovargas/Documents/CSCI3308/node-api-postgres/views/home.html')
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
