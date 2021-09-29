import { getConnection } from '../connectionManager'

const User = function (user) {
  this.id = user.id
  this.first_name = user.first_name
  this.last_name = user.last_name
  this.email = user.email
  this.address = user.address
}

User.bulkCreate = (req_arr, result) => {
  getConnection().raw(
    'INSERT INTO users(id, first_name, last_name, email, address) VALUES ?',
    [req_arr],
    (err, res) => {
      if (err) {
        console.log('error: ', err)
        result(err, null)
        return
      }

      console.log('created user: ', {
        id: res.insertId,
        number_of_records: req_arr.length
      })
      result(null, { records: req_arr.length, status: 'Sucess' })
    }
  )
}

exports.bulkCreate = (req, res) => {
  const req_arr = Object.values(req.body).map(v => Object.values(v))

  // Validate request (just incase body is not empty)
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    })
  }
  // calling bulkCreate() in customer.models, to save the received data
  User.bulkCreate(req_arr, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while sending data.'
      })
    else res.send(data)
  })
}

/**
 * Get all the users.
 **/
export function getAll () {
  return getConnection()
    .select('*')
    .from('users')
}
