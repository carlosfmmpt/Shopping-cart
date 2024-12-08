import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import { Link } from 'react-router-dom';


const Banner = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //console.log(isAuthenticated); // imprime si el slice con authenticated 
  const cartItemsCount = useSelector((state) => state.cart.items.length); // Número de productos en el carrito



  const handleLogout = (e) => {

    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-lg font-semibold">Online Store</h1>
      <div className="flex items-center gap-4">
        {/* Botón para ir al carrito */}
        <button
          className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => navigate('/cart')}
        >
          <span>Carrito</span>
          {cartItemsCount > 0 && (
            <span className="bg-white text-blue-600 rounded-full px-2 py-1 text-xs font-bold">
              {cartItemsCount}
            </span>
          )}
        </button>
        {/* Logout / Login / Items */}
        <span className="text-sm font-medium">
          {isAuthenticated ? (


            <button type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={handleLogout}>
              Logout
            </button>

          ) : (
            <div className="flex items-center gap-4">
              <Link to="/Login">
                <button type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  Login
                </button>
              </Link>
              <Link to="/Items">
                <button type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  Items
                </button>
              </Link>
            </div>

          )}

        </span>

      </div>
    </div>
  );
};

export default Banner;
