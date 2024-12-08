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
    const { name, price, category } = req.body;
    const file = req.files?.image;

    if (!file) return res.status(400).json({ error: 'Imagen requerida' });

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(__dirname, '../uploads/', fileName);

    file.mv(filePath, async (err) => {
      if (err) return res.status(500).json({ error: 'Error al subir la imagen' });

      const product = {
        name,
        price,
        category,
        image: fileName,
      };

      const result = await ProductModel.create(product);
      res.status(201).json({ id: result.insertId, ...product });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
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

    const updatedProduct = {
      name,
      price,
      category,
      image: fileName,
    };

    await ProductModel.update(id, updatedProduct);
    res.status(200).json({ message: 'Producto actualizado', product: updatedProduct });
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
