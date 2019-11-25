
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'Dukey7725$$@@',
  port: 5432,
})


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

const createUser = (request, response) => {
  const Restaurant_Id = 1;
  const {User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2} = request.body//Make sure these name match to the html page
  pool.query('INSERT INTO users(Restaurant_Id, User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2 ) VALUES($1, $2, $3, $4, $5, $6, $7)', [Restaurant_Id, User_Name, User_Password, Restaurant_Name, Phone, Address_line_1, Address_line_2 ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${Restaurant_Id}`)
  })
}

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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
