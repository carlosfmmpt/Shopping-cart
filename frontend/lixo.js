Product form:


import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/productSlice"; // Puedes usarlo para actualizar la lista tras guardar
import axios from "axios";

const ProductForm = ({ productToEdit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price);
      setImage(null); // Resetear imagen cuando editas un producto
    }
  }, [productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) {
      formData.append('image', image); // Solo incluir imagen si se seleccionó
    }

    try {
      if (productToEdit) {
        // Actualizar producto
        await axios.put(`http://localhost:5000/api/products/${productToEdit.id}`, formData);
      } else {
        // Crear producto nuevo
        await axios.post(`http://localhost:5000/api/products`, formData);
      }
      // Actualizar lista de productos
      dispatch(fetchProducts());

      // Limpiar formulario
      setName('');
      setPrice('');
      setImage(null);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">{productToEdit ? 'Actualizar' : 'Guardar'}</button>
    </form>
  );
};

export default ProductForm;




ProductSlice:



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// Acciones asíncronas
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('price', product.price);
  formData.append('image', product.image);

  const response = await axios.post(API_URL, formData);
  //console.log('Producto guardado:', product.image); //Verifica si llega el producto
  return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, product }) => {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('price', product.price);

  if (product.image) {
    formData.append('image', product.image); // Solo incluye la imagen si se ha actualizado
  }

  const response = await axios.put(`${API_URL}/${id}`, formData);
  return response.data; // Devuelve el producto actualizado desde el backend
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      ;
  },
});

export default productSlice.reducer;



ProductController

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
      console.log('Ruta completa de la imagen despues:', `/uploads/${fileName}`);
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





    ProductList:

    import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../features/productSlice";
import ProductForm from "./ProductForm";
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>


const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    setProductToEdit(product);  // Establecer el producto a editar
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;



  return (
    <div>

<ProductForm productToEdit={productToEdit} />

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">

            {items.map((product) => (

              <div key={product.id}>
           
                  <img src={`http://localhost:5000/${product.image}`} alt="Olive drab green insulated bottle with flared screw lid and flat top." className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]" />
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(product)} className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L10 16l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                    </svg>
                    Eliminar
                  </button>
                </div>

              </div>

            ))}
          </div>
        </div>
      </div>
    </div>


  );
};

export default ProductList;
