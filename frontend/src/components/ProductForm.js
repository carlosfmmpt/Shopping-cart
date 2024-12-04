import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/productSlice"; // Para actualizar la lista tras guardar
import axios from "axios";

const ProductForm = ({ productToEdit, onFinish }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Para distinguir entre editar y crear

  const dispatch = useDispatch();

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price);
      setImage(null); // Resetear imagen cuando editas un producto
      setCategory(productToEdit.category);
      setIsEditing(true);
    } else {
      // Limpiar el formulario si no hay producto para editar
      resetForm();
      setIsEditing(false);
    }
  }, [productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación manual para imagen
    if (!isEditing && !image) {
      alert("La imagen es obligatoria para crear un nuevo producto.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    if (image) {
      formData.append('image', image); // Solo incluir imagen si se seleccionó
    }

    try {
      if (isEditing) {
        // Actualizar producto
        await axios.put(`http://localhost:5000/api/products/${productToEdit.id}`, formData);
      } else {
        // Crear producto nuevo
        await axios.post(`http://localhost:5000/api/products`, formData);
      }

      // Actualizar lista de productos
      dispatch(fetchProducts());

      // Limpiar el formulario
      resetForm();

      // Notificar al padre que la acción terminó (si aplica)
      if (onFinish) onFinish();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setImage(null);
  };

  return (
    <div className="flex items-start justify-center bg-gray-100 pt-7 pb-7">
      <div className="w-full max-w-md p-5 bg-white shadow-md rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            {isEditing ? 'Editar Producto' : 'Agregar Producto'}
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required // Campo obligatorio siempre
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required // Campo obligatorio siempre
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              <option value="Electrónica">Electrónica</option>
              <option value="Ropa">Ropa</option>
              <option value="Hogar">Hogar</option>
              <option value="Otros">Todas</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">Imagen</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              required={!isEditing} // Obligatorio solo si estás creando
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">{isEditing ? 'Actualizar' : 'Guardar'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
