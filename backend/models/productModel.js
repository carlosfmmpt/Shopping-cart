const db = require('../database/db');

const ProductModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
  },

  create: async (name, price, image) => {
    const [result] = await db.query(
      'INSERT INTO products (name, price, image) VALUES (?, ?, ?)',
      [name, price, image]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, name, price, image) => {
    await db.query(
      'UPDATE products SET name = ?, price = ?, image = ? WHERE id = ?',
      [name, price, image, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
  },
};

module.exports = ProductModel;



{/* Modelo para carrito de compras 
const db = require('../config/db');

// Modelo para obtener los productos del carrito
const getCart = (callback) => {
  const query = `
    SELECT cart.id AS cart_id, products.name, products.price, cart.quantity
    FROM cart
    INNER JOIN products ON cart.product_id = products.id
  `;
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

// Modelo para agregar un producto al carrito
const addToCart = (product_id, quantity, callback) => {
  const query = 'INSERT INTO cart (product_id, quantity) VALUES (?, ?)';
  db.query(query, [product_id, quantity], (err, results) => {
    callback(err, results);
  });
};

// Modelo para eliminar un producto del carrito
const removeFromCart = (id, callback) => {
  const query = 'DELETE FROM cart WHERE id = ?';
  db.query(query, [id], (err, results) => {
    callback(err, results);
  });
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
*/}
