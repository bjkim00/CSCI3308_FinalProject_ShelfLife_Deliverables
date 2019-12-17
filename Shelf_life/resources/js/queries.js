
var dt = require('/Users/haleyhartin/Documents/ShelfLife/resources/js/my_modules.js')
const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  port: 5431,  //probably 5432 for you
  database: 'shelflife',   //enter in your username password for pg
  user: 'haleyhartin',
  password:'abc123'
})



const createUser = (request, response) => {
  const Restaurant_Id = 1;
  const {User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2} = request.body//Make sure these name match to the html page
  pool.query('INSERT INTO users(Restaurant_Id, User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2 ) VALUES($1, $2, $3, $4, $5, $6, $7)', [Restaurant_Id, User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2 ], (error, results) => {
    if (error) {
      throw error
    }
    response.redirect('/login');
    //response.end();
  })
}

const updateInventory = (request, response) => {//settings
  console.log("updateInventory");
  var YYYYMMDD = dt.myDate()
  var user_id_node = request.body.user_id_html
  const ingredient_id_node = request.body.ingredient_id_html;
  var ingredient_quantity_node = request.body.ingredient_quantity_html;
  var ingredient_quantity_holder = ingredient_quantity_node;
  pool.query('select ingredient_cost from inventory where ingredient_id = $1',//get the ingredient cost from database
   [ingredient_id_node], (error, results) =>{
    var ingredient_cost_holder = results.rows[0].ingredient_cost;
    pool.query('select ingredient_quantity from inventory where ingredient_id = $1',//get the ingredient quantity from  datebase
    [ingredient_id_node], (error, results) =>{
      ingredient_quantity_node = parseInt(ingredient_quantity_node)+ parseInt(results.rows[0].ingredient_quantity);// turn both variables to INT, then update into database
      pool.query(
        'UPDATE inventory SET ingredient_quantity = $2 WHERE ingredient_id = $1',
        [ingredient_id_node, ingredient_quantity_node],
        (error, results) => {
          console.log('updated inventory', ingredient_id_node, ingredient_quantity_node)
        // console.log("user_id_node: " + user_id_node);
        // console.log("YYYYMMDD: " + YYYYMMDD);
        // console.log("ingredient_quantity_holder: " + ingredient_quantity_holder);
        // console.log("ingredient_cost_holder: " + ingredient_cost_holder);
          pool.query('INSERT INTO order_form(user_id, dateholder, quantity, cost ) VALUES($1, $2, $3, $4);',[user_id_node, YYYYMMDD, ingredient_quantity_holder, ingredient_cost_holder],
                      (error, results) => {
            if (error) {
              throw error
            }
            response.redirect('/inventory');
          })
        }
      )
    })
  })
}


const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}



const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//const createUser = (request, response) => {
  //const Restaurant_Id = 1;
  //const {User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2} = request.body//Make sure these name match to the html page
  //pool.query('INSERT INTO users(Restaurant_Id, User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2 ) VALUES($1, $2, $3, $4, $5, $6, $7)', [Restaurant_Id, User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2 ], (error, results) => {
  //  if (error) {
  //    throw error
  //  }
  //  response.status(201).send(`User added with ID: ${Restaurant_Id}`)
//  })
//
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const auth = (request, response) => {

  const id = parseInt(request.params.id)
  console.log('in /auth')
  var username = request.body.em;
	var password = request.body.pw;
	console.log(username)
	console.log(password)
	//var popup= require('popups');
	if (username && password) {
    pool.query('SELECT * FROM USERS WHERE user_Name = $1 AND user_Password = $2',
    [username, password],
    (error, results) => {
      if (error) {
        console.log("errorrr")
        throw error
      }
      else{
        if (results.length > 0) {
          //request.session.loggedin = true;
          //request.session.username = username;
          response.redirect('/home');
      }else {
          response.redirect('/login');
        }
    }
  })
 }
}

const updatePassword = (request, response) => {
console.log('here')
  const username = request.body.User_Name;
  const newPassword = request.body.User_Password_New;
  const currentPassword = request.body.User_Password;
  console.log("Username", username);
  console.log("New Password", newPassword);
  console.log("Current Password", currentPassword);
  pool.query(
    'UPDATE users SET user_password = $3 WHERE user_name = $1 and user_password = $2;',
    [username, currentPassword, newPassword],
    (error, results) => {
      console.log(username);
      console.log(currentPassword);
      console.log(newPassword);
      if (error) {
        console.log('error in here')
        throw error
      }
      response.status(201).send(`User password modified with username: ${username}`)

    })
response.redirect('/setting');
}


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateInventory
}
