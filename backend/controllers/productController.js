
const path = require('path');
const fs = require('fs');
const ProductModel = require('../models/productModel');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear producto
const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const file = req.files?.image;

    if (!file) return res.status(400).json({ error: 'Imagen requerida' });

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(__dirname, '../uploads/', fileName);

    file.mv(filePath, async (err) => {
      if (err) return res.status(500).json({ error: 'Error al subir la imagen' });

      const id = await ProductModel.create(name, price, fileName);

      res.status(201).json(
        {
          id,
          name,
          price,
          image: `/uploads/${fileName}` // Asegúrate de que coincida con la ruta donde sirves los archivos
        }
      );
      //console.log('Ruta completa de la imagen despues:', `/uploads/${fileName}`);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const file = req.files?.image;

    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    let fileName = product.image;
    if (file) {
      fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(__dirname, '../uploads/', fileName);
      file.mv(filePath, (err) => {
        if (err) return res.status(500).json({ error: 'Error al subir la imagen' });

        // Eliminar imagen antigua
        fs.unlink(path.join(__dirname, '../uploads/', product.image), () => {});
      });
    }

    await ProductModel.update(id, name, price, fileName);
    res.status(200).json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    await ProductModel.delete(id);

    // Eliminar imagen
    fs.unlink(path.join(__dirname, '../uploads/', product.image), () => {});
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };


{/*
    // obtener sin necesidad de cartModel.js
    const db = require('../config/db');

// Obtener productos del carrito
exports.getCart = (req, res) => {
  const query = 'SELECT * FROM cart INNER JOIN products ON cart.product_id = products.id';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Agregar producto al carrito
exports.addToCart = (req, res) => {
  const { product_id, quantity } = req.body;
  const query = 'INSERT INTO cart (product_id, quantity) VALUES (?, ?)';
  db.query(query, [product_id, quantity], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Producto agregado al carrito', id: results.insertId });
  });
};

// Eliminar producto del carrito
exports.removeFromCart = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cart WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Producto eliminado del carrito' });
  });
};

    
    */}