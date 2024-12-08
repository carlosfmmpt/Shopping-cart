const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configura tu conexión a la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shopping_cart',
};

const insertUser = async () => {
  const username = 'admin@g.com'; // Email del usuario
  const password = 'admin1'; // Contraseña del usuario

  try {
    // Crear un hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Conectar a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Insertar el usuario en la base de datos
    const query = `
      INSERT INTO users ( username, password)
      VALUES (?, ?);
    `;

    const [result] = await connection.execute(query, [username, hashedPassword]);

    console.log('Usuario insertado con éxito:', result);

    // Cerrar la conexión
    await connection.end();
  } catch (error) {
    console.error('Error al insertar el usuario:', error.message);
  }
};

// Ejecutar la función
insertUser();
