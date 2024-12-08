// features/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Productos en el carrito
  },
  reducers: {
    addToCart: (state, action) => {
        const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
        if (itemIndex === -1) {
          // Si el producto no existe, lo agregamos
          state.items.push({ ...action.payload, quantity: 1 });
        } else {
          // Si el producto ya está en el carrito, incrementamos la cantidad
          state.items[itemIndex].quantity += 1;
        }
      },
    removeItemFromCart: (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      },
    
    clearCart: (state) => {
      state.items = []; // Vaciar el carrito
    },
    increaseQuantity: (state, action) => {
        const itemIndex = state.items.findIndex(item => item.id === action.payload);
        if (itemIndex !== -1) {
          state.items[itemIndex].quantity += 1;
        }
      },
      decreaseQuantity: (state, action) => {
        const itemIndex = state.items.findIndex(item => item.id === action.payload);
        if (itemIndex !== -1 && state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        }
      },
  },
});

export const { addToCart, removeItemFromCart, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
