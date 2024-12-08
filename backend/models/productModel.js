const db = require('../database/db'); // Importar la conexión

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM products', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.create = (product) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO products SET ?', product, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null); // Si no encuentra el producto
      resolve(results[0]);
    });
  });
};

exports.update = (id, product) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE products SET ? WHERE id = ?', [product, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
