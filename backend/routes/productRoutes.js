const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

// Rutas para productos
router.get('/', getProducts);       // Obtener todos los productos
router.post('/', createProduct);    // Crear un producto nuevo
router.put('/:id', updateProduct);  // Actualizar un producto existente
router.delete('/:id', deleteProduct); // Eliminar un producto

module.exports = router;
