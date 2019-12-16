const http = require('http');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dbb = require('./queries');
const hostname = '127.0.0.1';
const port = 3000
const fs = require('fs');//read login file
var pg=require('pg-promise')();
var pug = require('pug');
//onst Plotly= require('plotly')("haley_hartin", "FWN70F2o9HF25cJYmOVQ");
var Chart = require('chart.js');
var moment = require('moment');
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.set('view engine', 'pug');
//app.set('view engine', 'jade');
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
var S = require('string');
//var replacee = require("replace");
const dbConfig={
	host: 'localhost',
	port: 5431,  //probably 5432 for you
	database: 'shalflife2',   //enter in your username password for pg
	user: 'haleyhartin',
	password:'abc123'
};

var db=pg(dbConfig);


var timedata = [];
var chartData = [];
var i=0;
var get;
var sum=0;
var salesdata;
var result;
var totalsalesdata;
var xaxis;

//create six functions for six routes
//app.get('/users', dbb.getUsers)
app.get('/users/:id', dbb.getUserById)
//app.post('/users', dbb.createUser)
app.put('/users/:id', dbb.updateUser)
app.delete('/users/:id', dbb.deleteUser)
app.post('/users', dbb.createUser)
app.post('/order', dbb.updateInventory)
//app.post('/settings', dbb.updatePassword)



var stamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var d = new Date();
var t = d.getHours();
var n = d.getDate();
var day= d.getDay();
var month = d.getMonth();
var year = d.getYear();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months= ['January', 'Feburary', 'March', 'April', 'May','June', 'July', 'August','September','October','November','December'];
var title;
var myname;

app.get('/inventory', (req, res) => {
  var query = "select * from inventory where ingredient_quantity > 10;";
  var query1 = "select * from inventory where ingredient_quantity <= 10";
  db.task('get-everything', task => {
    return task.batch([
      task.any(query),
      task.any(query1)
    ]);
  })
  .then(data => {
    res.render('/Users/haleyhartin/Documents/ShelfLife/views/inventory2.pug', {
      my_title: "Inventory Page",
      inventory_item_Full: data[0],
      inventory_item_AlmostEmpty: data[1]

    })
  })
  .catch(error => {
    console.log("error",error);
    res.render('/Users/haleyhartin/Documents/ShelfLife/views/inventory2.pug', {
      my_title: "Inventory Page",
      inventory_item_Full: "",
      inventory_item_AlmostEmpty: ""
    })
  })
});

app.get('/order_forms', (req, res) => {
  var query = "select * from inventory where ingredient_quantity > 10;";
  var query1 = "select * from inventory where ingredient_quantity <= 10";
  db.task('get-everything', task => {
    return task.batch([
      task.any(query),
      task.any(query1)
    ]);
  })
  .then(data => {
    res.render('/Users/haleyhartin/Documents/ShelfLife/views/order_forms.pug', {
      my_title: "Order Page",
      inventory_item_Full: data[0],
      inventory_item_AlmostEmpty: data[1]

    })
  })
  .catch(error => {
    console.log("error");
    res.render('/Users/haleyhartin/Documents/ShelfLife/views/order_forms.pug', {
      my_title: "Order Page",
      inventory_item_Full: "",
      inventory_item_AlmostEmpty: ""
    })
  })
  console.log("in order forms");
});

app.get('/login', function(req, res) {
    //res.sendFile('views/login.html', ,{root: __dirname })
    res.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/login.html','/Users/haleyhartin/Documents/ShelfLife/resources/css/signin.css')
		console.log('app.get');
		console.log(req.action);
    //res.end();
});

app.post('/auth', function(request, response) {
  console.log('/auth');
	var username = request.body.em;
	var password = request.body.pw;
	console.log(username);
	console.log(password);
  myname='';
	//var popup= require('popups');
	if (username && password) {
		var sql= "SELECT * FROM USERS WHERE user_Name = $1 AND user_Password = $2;";
  	db.any(sql, [username, password])
  			.then(function(results){
						console.log(results.length);
							if (results.length > 0) {
                  var name= 'select restaurant_name from users where user_name=$1;';
                  db.any(name, username)
                			.then(function(results){
                        myname=results[0].restaurant_name;
                      })
                      .catch(function(err){
               				console.log("error",err);
              			 })
									//request.session.loggedin = true;
									//request.session.username = username;
									response.redirect('/work_home');
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
});

app.get('/home', function(request, res) {
  fs.readFile('/Users/haleyhartin/Documents/ShelfLife/views/home.html', 'utf-8', function (err, data) {

                   console.log('timedata:', timedata);
                   console.log('chart data: ', chartData)
                   console.log('name', myname)

                   var resultt = data.replace('{{chartData}}', JSON.stringify(chartData));
                   //console.log('date:', result)
                   var resultt = resultt.replace('{{time}}', JSON.stringify(timedata));
                   var resultt = resultt.replace('{{salesdata}}', JSON.stringify(salesdata));
                   var resultt = resultt.replace('{{Hour}}', JSON.stringify(xaxis));
                   var resultt = resultt.replace('{{name}}', myname);
                   //console.log('date:', result)
                   res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length':resultt.length });
                   //console.log(result);
                   res.write(resultt);
                   res.end();


        });
});

app.get('/send_order', function (req, res) {
  get_dishes='select * from dishes;';
  db.any(get_dishes)
      .then(function(results){
        fs.readFile('/Users/haleyhartin/Documents/ShelfLife/views/send_order.html', 'utf-8', function (err, data) {
          console.log('in funct');
          console.log('total in order:', total)
          if(results.length==1)
          {
            result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
          }
          if(results.length==2)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
          }
          if(results.length==3)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
             result = result.replace('<p hidden>3</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
             console.log(result)
          }
          if(results.length==4)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%"  value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
             result = result.replace('<p hidden>3</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
             result = result.replace('<p hidden>4</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
          }
          if(results.length==5)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%"  value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
             result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%"  value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
             result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%"  value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
             result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%"  value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
          }
          if(results.length==6)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit"  class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%"  value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
             result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
             result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
             result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
             result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
          }
          if(results.length==7)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
             result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
             result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
             result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
             result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
             result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
          }
          if(results.length==8)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
             result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
             result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
             result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
             result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
             result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
             result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
          }
          if(results.length==9)
          {
             result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
             result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
             result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
             result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
             result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
             result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
             result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
             result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
             result = result.replace('<p hidden>9</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[8].dish_name + '" name="'+ results[8].dish_name + '">');
           }
           if(results.length==10)
           {
              result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
              result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
              result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
              result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
              result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
              result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
              result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
              result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
              result = result.replace('<p hidden>9</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[8].dish_name + '" name="'+ results[8].dish_name + '">');
              result = result.replace('<p hidden>10</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[9].dish_name + '" name="'+ results[9].dish_name + '">');
            }
            if(results.length==11)
            {
               result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
               result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
               result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
               result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
               result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
               result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
               result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
               result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
               result = result.replace('<p hidden>9</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[8].dish_name + '" name="'+ results[8].dish_name + '">');
               result = result.replace('<p hidden>10</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[9].dish_name + '" name="'+ results[9].dish_name + '">');
               result = result.replace('<p hidden>11</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[10].dish_name + '" name="'+ results[10].dish_name + '">');

             }
             if(results.length==12)
             {
                result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
                result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
                result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
                result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
                result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
                result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
                result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
                result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
                result = result.replace('<p hidden>9</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[8].dish_name + '" name="'+ results[8].dish_name + '">');
                result = result.replace('<p hidden>10</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[9].dish_name + '" name="'+ results[9].dish_name + '">');
                result = result.replace('<p hidden>11</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[10].dish_name + '" name="'+ results[10].dish_name + '">');
                result = result.replace('<p hidden>12</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[11].dish_name + '" name="'+ results[11].dish_name + '">');

              }
              if(results.length==13)
              {
                 result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
                 result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
                 result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
                 result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
                 result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
                 result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
                 result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
                 result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
                 result = result.replace('<p hidden>9</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[8].dish_name + '" name="'+ results[8].dish_name + '">');
                 result = result.replace('<p hidden>10</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[9].dish_name + '" name="'+ results[9].dish_name + '">');
                 result = result.replace('<p hidden>11</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[10].dish_name + '" name="'+ results[10].dish_name + '">');
                 result = result.replace('<p hidden>12</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[11].dish_name + '" name="'+ results[11].dish_name + '">');
                 result = result.replace('<p hidden>13</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[12].dish_name + '" name="'+ results[12].dish_name + '">');

               }
               if(results.length==14)
               {
                  result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
                  result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
                  result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
                  result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
                  result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
                  result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
                  result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
                  result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
                  result = result.replace('<p hidden>9</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[8].dish_name + '" name="'+ results[8].dish_name + '">');
                  result = result.replace('<p hidden>10</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[9].dish_name + '" name="'+ results[9].dish_name + '">');
                  result = result.replace('<p hidden>11</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[10].dish_name + '" name="'+ results[10].dish_name + '">');
                  result = result.replace('<p hidden>12</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[11].dish_name + '" name="'+ results[11].dish_name + '">');
                  result = result.replace('<p hidden>13</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[12].dish_name + '" name="'+ results[12].dish_name + '">');
                  result = result.replace('<p hidden>14</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[13].dish_name + '" name="'+ results[13].dish_name + '">');

                }
                if(results.length==15)
                {
                   result = data.replace('<p hidden>1</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[0].dish_name + '" name="'+ results[0].dish_name + '">');
                   result = result.replace('<p hidden>2</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[1].dish_name + '" name="'+ results[1].dish_name + '">');
                   result = result.replace('<p hidden>3</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[2].dish_name + '" name="'+ results[2].dish_name + '">');
                   result = result.replace('<p hidden>4</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[3].dish_name + '" name="'+ results[3].dish_name + '">');
                   result = result.replace('<p hidden>5</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[4].dish_name + '" name="'+ results[4].dish_name + '">');
                   result = result.replace('<p hidden>6</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[5].dish_name + '" name="'+ results[5].dish_name + '">');
                   result = result.replace('<p hidden>7</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[6].dish_name + '" name="'+ results[6].dish_name + '">');
                   result = result.replace('<p hidden>8</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[7].dish_name + '" name="'+ results[7].dish_name + '">');
                   result = result.replace('<p hidden>9</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[8].dish_name + '" name="'+ results[8].dish_name + '">');
                   result = result.replace('<p hidden>10</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[9].dish_name + '" name="'+ results[9].dish_name + '">');
                   result = result.replace('<p hidden>11</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[10].dish_name + '" name="'+ results[10].dish_name + '">');
                   result = result.replace('<p hidden>12</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[11].dish_name + '" name="'+ results[11].dish_name + '">');
                   result = result.replace('<p hidden>13</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[12].dish_name + '" name="'+ results[12].dish_name + '">');
                   result = result.replace('<p hidden>14</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[13].dish_name + '" name="'+ results[13].dish_name + '">');
                   result = result.replace('<p hidden>15</p>', '<input type="submit" class="w3-btn myClass" style="width:100%" value="'+ results[14].dish_name + '" name="'+ results[14].dish_name + '">');

                 }

          if(results.length==0){
             result = data.replace('<p hidden>1</p>', 'No menu items to display');
          }

          result = result.replace('{{name}}', myname);


          //var result = result.replace('{{dishname}}', JSON.stringify(results[0].dish_name));
          //console.log(result);
          //res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length':result.length });
          res.write(result);
          //console.log('picked:' , req.body.choose);

        });
      })
      .catch(function(err){
      console.log("error",err);
     })
    total=0;
});



app.post('/menu', function (req, res) {
//var total=0;
  var dish_id;
  var dish;
  var i;
  var x=0;
  //console.log('result', result)
  //console.log('picked:' , req.body)
  dish=JSON.stringify(req.body);
  console.log('string', dish)
  var x = dish.length-5-((dish.length-7)/2)
  //car s1= dish.substring(2,dish.length-);

  var time=stamp;

  dishh= dish.substring(2,x);
  console.log('dish', dishh)

  get_id = 'select dish_id from dishes where dish_name = $1;';
  db.any(get_id, dishh)
      .then(function(results){
        dish_id=results[0].dish_id;
        get_ingredients='select ingredient_quanity, ingredient_id from dish_2_ingredients where dish_id=$1;';
        db.any(get_ingredients, dish_id)
            .then(function(results){
                  console.log('num of ingredients', results.length)
                  for(let i=0; i<results.length; i++){
                    set_inventory='UPDATE inventory SET ingredient_quantity=(SELECT ingredient_quantity FROM inventory WHERE ingredient_id=$1)-(SELECT ingredient_quanity FROM dish_2_ingredients WHERE dish_id=$2 and ingredient_id= $3) WHERE ingredient_id=$4;';
                      db.any(set_inventory, [results[i].ingredient_id, dish_id, results[i].ingredient_id, results[i].ingredient_id])
                      .then(function(results){
                        console.log('worked')
                      })
                      .catch(function(err){
                      console.log("error",err);
                    })
                }
              })
            .catch(function(err){
            console.log("error",err);
            })
        num_orders='select count(order_id) from orders;';
        db.any(num_orders)
          .then(function(results){
               if(results[0].count==null)
               {
                 new_id=1;
               }
               else{
                  new_id=parseInt(results[0].count)+10;
               }
               var time= moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
               order='insert into orders(order_id, user_id, date, dish_id) values($1, $2, $3, $4);';
               db.any(order, [new_id, 150, time, dish_id])
                   .then(function(results){
                     //console.log('order time:', time)
                     get_cost='select dish_cost from dishes where dish_id=$1;';
                     db.any(get_cost, dish_id)
                      .then(function(results){
                        cost=parseInt(results[0].dish_cost)
                        console.log('cost', cost)
                        total=total+cost;
                        console.log('total in menu', total)
                        var money = result.replace('0 ', JSON.stringify(total));
                        res.write(money)
                        //});
                        //console.log('sale time:', time)
                        sales='insert into sales(order_id, dish_id, date, cost) values($1, $2, $3, $4);';
                        db.any(sales, [new_id, dish_id, time, cost])
                         .then(function(results){
                           console.log('inserted')
                         })
                         .catch(function(err){
                          console.log("error",err);
                          })
                     })
                     .catch(function(err){
                      console.log("error",err);
                      })
               })
               .catch(function(err){
                console.log("error",err);
                })

           })

         .catch(function(err){
          console.log("error",err);
          })

})
//console.log('at end')
//res.redirect('/send_order')
});

app.get('/submit', function (req, res) {
  //console.log('in submit', total)
   //res.write('Order submitted. Order Total:')
   //console.log('result:', result)
   res.redirect('/work_home')
   res.end()
});

app.get('/work_home', function(req, res) {
    stamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    d = new Date();
    var str;
    console.log(d)
    t = d.getHours();
    n = d.getDate();
    salesdata=0;
    var x;
    month = d.getMonth() +1 ;
    year = d.getYear();
    console.log('day and month and hour', n, month, t)
    timedata=[];
    chartData=[];
    xaxis='Hour';
    // var i=1;
    var x=0;
    for(let i=0; i<=t; i++)
    {
       get = 'select SUM(cost) from sales where extract(day from date)= $1 and extract(hours from date)= $2 and extract(month from date)=$3;';
       var sum = db.any(get, [n, i,month])
       .then(function(results){
         if (results[0].sum==null){
              // return 0
              chartData.push(0);
            }
        else {

            chartData.push(results[0].sum);
          }
          // return results[0].sum
       })
      .catch(function(err){
          console.log("error",err);
       })


     // sum.then(function(result) {
     //   console.log('i', i)
     //  chartData.push(result);
     // })
     // .catch(function(err){
     //     console.log("error",err);
     //  })
    if(i>12)
    {
      x=i-12;
    }
    timedata.push(x);
    x=x+1;
    }
    sale= 'select sum(cost) from sales where extract(day from date)= $1 and extract(month from date)= $2';
      db.any(sale, [n, month])
        .then(function(results){
          if (results[0].sum==null){
               //console.log('here??')
               salesdata=0;
              }
          else{
            salesdata=results[0].sum;
            console.log('1st salesdata', salesdata)
          }
          //console.log('sum', results[0].sum)
          //console.log('salesdata', salesdata)
          res.redirect('/home');
          res.end();

          })
          .catch(function(err){
          console.log("error",err);
          })

//res.end();

});

app.post('/table', function (req, res) {
    // If it's not showing up, just use req.body to see what is actually being passed.
    chartData=[];
    timedata=[];
    console.log('picked:' , req.body.selectpicker);
    if(req.body.selectpicker=='1'){
      res.redirect('/today')
      res.end();
    }
   if(req.body.selectpicker=='2'){
      res.redirect('/week')
      res.end();
    }
    if(req.body.selectpicker=='3'){
      res.redirect('/month')
      res.end();
    }
    if(req.body.selectpicker=='4'){
      res.redirect('/year')
      res.end();
    }

});

app.get('/today', function(req, res) {
    stamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    d = new Date();
    console.log(d)
    t = d.getHours();
    n = d.getDate();
    month=month+1
    console.log('day, hour', n ,t)
    year = d.getYear();
    timedata=[];
    chartData=[];
    xaxis='Hour';
    title='Daily Sales'
    var i=1;
    var x;
    while (i<=t){
      x=i;
      // for(var i=1; j=t, i<j; i++){
         get = 'select SUM(cost) from sales where extract(day from date)= $1 and extract(hours from date)= $2 and extract(month from date)= $3';
         var sum = db.any(get, [n, i, month])
         .then(function(results){
            if (results[0].sum==null){
                 return 0;
                }
            else{
              return results[0].sum;
            }
        })
        .catch(function(err){
            console.log("error",err);
       })
       sum.then(function(results){
           console.log('pushinhg', results)
           chartData.push(results);
       })
       .catch(function(err){
           console.log("error",err);
       })
      if(i>12)
      {
        x=i-12;
      }
      timedata.push(x);
      i=i+1
      console.log('i,t', i,t)
      }
      i=0;
      var sale= 'select sum(cost) from sales where extract(day from date)= $1 and extract(month from date)= $2;';
      db.any(sale, [n,month])
        .then(function(results){
          if (results[0].sum==null){
               salesdata=0;
              }
          else{
            salesdata=results[0].sum;
          }

          res.redirect('/sales');
          res.end();
        })
        .catch(function(err){
          console.log("error",err);
        })
});

app.get('/week', function(req, res) {
    var x;
    stamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log(stamp);
    timedata=[];
    chartData=[];
    xaxis='Day';
    title= 'Weekly Sales';
      for(i=6; i>=0; i--){
         get = 'select sum(cost) from sales where extract(day from date)= $1 and extract(month from date)=$2;';
         if(n-i<=0)
         {
           x=30-(i-n);
         }
         else{
           x=n-i;
         }
         //console.log('week day', x)
         var sum = db.any(get, [x,month])
         .then(function(results){
           //console.log('day: ', stamp-i);
            if (results[0].sum==null){
                 return 0;
                }
            else{
              return results[0].sum;
            }
        })
        .catch(function(err){
            console.log("error",err);
        })
      sum.then(function(results){
        //console.log('pushinhg', results)
        chartData.push(results);
      })
      if(day-i<0){
        timedata.push(days[7-(i-day)]);
      }
      else{
        timedata.push(days[day-i])
        }
      }
      console.log('chart data: ', chartData)
      sale= 'select sum(cost) from sales where (extract(day from date)= $1 or extract(day from date)= $2 or extract(day from date)= $3 or extract(day from date)= $4 or extract(day from date)= $5 or extract(day from date)= $6 or extract(day from date)= $7) and extract(month from date)= $8;';
      db.any(sale, [n,n-1,n-2,n-3,n-4,n-5,n-6, month])
        .then(function(results){
          if (results[0].sum==null){
               salesdata=0;
              }
          else{
            salesdata=results[0].sum;
            }
            console.log('week sales', salesdata)
            res.redirect('/sales');
            res.end();
          })
        .catch(function(err){
          console.log("error",err);
        })
});

app.get('/month', function(req, res) {
var x;
stamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
console.log('month day', n);
timedata=[];
chartData=[];
summ=0;
xaxis='Day';
title= 'Monthly Sales';
  for(var i=1; i<=n; i++){
     get = 'select sum(cost) from sales where extract(day from date)= $1 and extract(month from date)=$2;';
     db.any(get, [i, month])
     .then(function(results){
        if (results[0].sum==null){
             summ=0;
            }
        else{
          summ=results[0].sum;
        }
    chartData.push(summ);
     console.log('sum1', summ)
      })
    .catch(function(err){
        console.log("error",err);
      })

    //console.log('sum2', summ)

    timedata.push(i);
  }
  sale= 'select sum(cost) from sales where extract(month from date)= $1;';
  db.any(sale, month)
    .then(function(results){
      if (results[0].sum==null){
           salesdata=0;
          }
      else{
        salesdata=results[0].sum;
      }
      })
    .catch(function(err){
      console.log("error",err);
    })
res.redirect('/sales');
});

app.get('/year', function(req, res) {
var x;
console.log('year', year)
stamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
console.log(stamp);
timedata=[];
chartData=[];
title='Yearly Sales';
xaxis='Month';
var i=0;
while(i<12)
{
// for(var i=0; i<12; i++){
     get = 'select sum(cost) from sales where extract(month from date)= $1;';
     var sum = db.any(get, i+1)
    .then(function(results){
        if (results[0].sum==null){
             return 0;
            }
        else{
          return results[0].sum;
        }

        console.log(sum);
        chartData.push(sum);
        //console.log('chart data: ', chartData)
    })
    .catch(function(err){
        console.log("error",err);
    })

    sum.then(function(results){
        console.log('pushinhg', results)
        chartData.push(results);
    })
    .catch(function(err){
        console.log("error",err);
    })
    timedata.push(months[i]);
  i=i+1;
  }
i=0;
  var sale= 'select sum(cost) from sales where extract(year from date)= $1;';
  db.any(sale, '2019' )
    .then(function(results){
      if (results[0].sum==null){
           salesdata=0;
          }
      else{
        salesdata=results[0].sum;
      }
      res.redirect('/sales');
      res.end();
    })
    .catch(function(err){
      console.log("error",err);
  })
});

app.get('/sales1', function(req, res){
  totalsalesdata=0;
  console.log('name', myname)
 console.log('day', n)
  sales= 'select sum(cost) from sales;';
  db.any(sales)
    .then(function(results){
      totalsalesdata=results[0].sum
      sale= 'select sum(cost) from sales where extract(day from date)= $1 and extract(month from date)= $2;';
      db.any(sale, [n ,'12'])
        .then(function(results){
          if (results[0].sum==null){
               salesdata=0;
              }
          else{
            salesdata=results[0].sum;
            }
            fs.readFile('/Users/haleyhartin/Documents/ShelfLife/views/sales1.html', 'utf-8', function (err, data) {

                      //console.log('timedata:', timedata);
                      //console.log('chart data: ', chartData)

                      var resultt = data.replace('{{totalsales}}', JSON.stringify(totalsalesdata));
                      var resultt = resultt.replace('{{sales}}', JSON.stringify(salesdata));
                      var resultt = resultt.replace('{{name}}', myname);
                      //console.log('date:', result)
                      res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length':resultt.length });
                      res.write(resultt);
                     res.end();
              })
            })
            .catch(function(err){
              console.log("error",err);
            })
          })
      .catch(function(err){
      console.log("error",err);
    })


});

app.get('/sales', function(req, res){
     fs.readFile('/Users/haleyhartin/Documents/ShelfLife/views/sales.html', 'utf-8', function (err, data) {

                 console.log('timedata:', timedata);
                 console.log('chart data: ', chartData)

                 var resultt = data.replace('{{chartData}}', JSON.stringify(chartData));
                 //console.log('date:', result)
                 var resultt = resultt.replace('{{time}}', JSON.stringify(timedata));
                 var resultt = resultt.replace('{{title}}', JSON.stringify(title));
                 var resultt = resultt.replace('{{sales}}', JSON.stringify(salesdata));
                 var resultt = resultt.replace('{{axis}}', JSON.stringify(xaxis));
                 //console.log('date:', result)
                 res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length':resultt.length });
                 res.write(resultt);
                res.end();
             });
});

// app.get('/account', function(request, response) {
// 	response.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/account.html')
// });
app.get('/setting', function(request, response) {
    response.sendFile('/Users/haleyhartin/Documents/ShelfLife/views/settings1.html')
});


app.post('/settings', function(request, response) {
    console.log('in here');
    const username = request.body.User_Name;
    const newPassword = request.body.User_Password_New;
    const currentPassword = request.body.User_Password;
    console.log("Username", username);
    console.log("New Password", newPassword);
    console.log("Current Password", currentPassword);
    var sql= 'UPDATE users SET user_password = $1 WHERE user_name = $2 and user_password = $3;';
    db.any(sql, [newPassword, username, currentPassword])
      .then(function(results){
        console.log(username);
        console.log(currentPassword);
        console.log(newPassword);
      })
        .catch(function(err){
          console.log("error",err);
      })
        //response.status(201).send(`User password modified with username: ${username}`)

  response.redirect('/setting');
});

app.post('/updateMenu', function(request, response) {
    console.log('updating menus');
    var num = request.body.numItems;
    console.log('items:', num)
    var dishName = request.body.dishName;
    var dishPrice = request.body.dishPrice;
    var ingredientName = request.body.ingName;
    var ingredientQuanity = request.body.ingAmnt;
    var ingredientCost = request.body.ingCost;
    var numing= request.body.numIngredients;
    var unit = request.body.pets;
    var numIngredients;
    console.log(unit)
    var ingredientID;
    var numdishes;

    var count = 'select * from dishes;';
        db.any(count)
          .then(function(results){
            numdishes=results.length + 1;
            var sql = 'insert into dishes(dish_id, dish_name, dish_cost) values($1, $2, $3);';
            db.any(sql, [numdishes, dishName, parseInt(dishPrice)])
            .then(function(results){
        // for loop for numIngredients
        //   replace ingredientName with ingredientName[i]
               for(let i=0; i<numing; i++)
               {
                  console.log('inserted into dishes');;
                  var x='select * from inventory where ingredient_name= $1;';
                  db.any(x, ingredientName[i])
                  .then(function(results){
                    if(results.length==0)
                    {
                      console.log('i', i)
                      console.log('new ingredient')
                      console.log('quantity', ingredientQuanity[i])
                      console.log('price', ingredientCost[i])
                      console.log('unit', unit[i])
                      console.log('name', ingredientName[i])
                      var j= 'select * from inventory;';
                      db.any(j)
                    	  .then(function(results){
                          var id= results.length + (i+1);
                          console.log('id', id)
                          console.log('id', id)
                          var sql3 = 'insert into inventory(ingredient_id, ingredient_group_id, ingredient_name, ingredient_quantity, ingredient_cost, ingredient_unit) values ($1, $2, $3, $4, $5, $6);';
                    	    db.any(sql3, [parseInt(id), 1, ingredientName[i], 0, parseInt(ingredientCost[i]), unit[i]])
                    	     .then(function(results){
                    	  	     console.log("inserted new ingredient");
                               var sql2 = 'insert into dish_2_ingredients(dish_id, ingredient_id, ingredient_quanity) values ($1, $2, $3);';
                                 db.any(sql2, [numdishes, id, ingredientQuanity[i]])
                                 	 .then(function(results){
                                 	  	console.log("Inserted new into dish to ingredients id", id);
                                 	  })
                                 	   .catch(function(err){
                                 	    	console.log("error", err);
                                 	  })
                    	     })
                    	    .catch(function(err){
                    	    	console.log("error", err)
                    	    })

                        })
                        .catch(function(err){
                        console.log("error, err");
                       })
                  }
                  else
                  {
                    console.log('old ingredient')
                    var id = 'select ingredient_id from inventory where ingredient_name = $1;';
                    db.any(id, ingredientName[i])
                    .then(function(results){
                      ingredientID=results[0].ingredient_id;
                      var sql2 = 'insert into dish_2_ingredients(dish_id, ingredient_id, ingredient_quanity) values ($1, $2, $3);';
                        db.any(sql2, [numdishes, ingredientID, ingredientQuanity[i]])
                        	 .then(function(results){
                        	  	console.log("Inserted old into dish to ingredients id", ingredientID);
                        	  })
                        	   .catch(function(err){
                        	    	console.log("error, err");
                        	  })
                     })


                }
            })
            .catch(function(err){
              console.log("error",err);
             })
           }
           })
          .catch(function(err){
            console.log("error",err);
          })
  //end for loop

      })
      .catch(function(err){
        console.log("error",err);
      })

	    //response.status(201).send('Adding ingredient')
	    response.redirect('/setting');

});


app.listen(3000);
console.log('3000 is the magic port');
