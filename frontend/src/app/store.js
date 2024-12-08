import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice";
import authReducer from '../features/authSlice';
import registerReducer from '../features/registerSlice'; // Asegúrate de importar correctamente
import cartReducer from '../features/cartSlice';


export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    register: registerReducer,
    cart: cartReducer, 


  },
});
