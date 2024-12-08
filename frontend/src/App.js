import './App.css';
import Banner from './components/BannerUp';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from './features/authSlice';
import axios from 'axios';
import { useEffect } from 'react';



import Login from './components/users/Login';
import Items from './components/Items';
import ProductList from './components/ProductList';
import Register from './components/users/Register';
import Cart from './components/Cart';

function App() {

  // Obtenemos el estado de autenticación desde Redux
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {

      // Opcional: Verifica si el token sigue siendo válido
      axios
        .get('http://localhost:5000/api/auth/validateToken', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { user } = response.data;
          dispatch(loginSuccess({ token, user }));
        })
        .catch(() => {
          dispatch(logout());
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);



    // Función para proteger rutas (redirige al login si no hay token)
    const ProtectedRoute = ({ children }) => {
      const { isAuthenticated } = useSelector((state) => state.auth);

      if (!isAuthenticated) {
        console.log('Usuario no autenticado, redirigiendo a /login');
        return <Navigate to="/login" />;
      }
  
      return isAuthenticated ? children : <Navigate to="/login" />;
    };

  return (

    <Router>
      <Banner />
      <div>
        <Routes>
        <Route path="/" element={<Navigate to="/items" />} />
        <Route path="/items" element={<Items />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>} />
       



          {/* Ruta predeterminada */}
          <Route path="*" element={<Navigate to={token ? "/products" : "/login"} />} />
          </Routes>

      </div>

    </Router>

  );
}

export default App;
