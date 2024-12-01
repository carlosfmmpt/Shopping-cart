const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear conexión con la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Verificar conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa con la base de datos de shopping cart.');
    connection.release(); // Liberar la conexión después de verificar
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
  }
})();

module.exports = pool;
