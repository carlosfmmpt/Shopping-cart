import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/productSlice"; // Para actualizar la lista tras guardar
import axios from "axios";

const ProductForm = ({ productToEdit, onFinish }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Para distinguir entre editar y crear

  const dispatch = useDispatch();

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price);
      setImage(null); // Resetear imagen cuando editas un producto
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
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required // Campo obligatorio siempre
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required // Campo obligatorio siempre
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        required={!isEditing} // Obligatorio solo si estás creando
      />
      <button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
    </form>
  );
};

export default ProductForm;
