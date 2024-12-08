const db = require('../database/db');

const findUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => { // Cambié "connection" por "db"
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return callback(err, null);
    }
   // console.log('Resultados de la consulta:', results); // Depura los resultados
    callback(null, results);
  });
};

const createUser = (user, callback) => {
  const { username, password } = user;
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], callback);
};

module.exports = { findUserByUsername, createUser };

