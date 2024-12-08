import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import { clearCart, removeItemFromCart, increaseQuantity, decreaseQuantity } from '../features/cartSlice';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook para redirigir

  // Calcular el total correctamente
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Función para manejar la eliminación de un producto del carrito
  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  // Funciones para aumentar y disminuir cantidades
  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  };

  return (
    <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                {/* Header */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                      Carrito de Compras
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                        aria-label="Cerrar"
                        onClick={() => navigate('/items')} // Redirige al componente Items
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Lista de productos */}
                  {items.length === 0 ? (
                    <p className="mt-8 text-gray-500">El carrito está vacío</p>
                  ) : (
                    <div className="mt-8">
                      <div className="flow-root">
                        <ul  className="-my-6 divide-y divide-gray-200">
                          {items.map((item, index) => (
                            <li key={index} className="flex py-6">
                              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={`http://localhost:5000/${item.image}`}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p> {/* Mostrar precio por la cantidad */}
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  {/* Botones para aumentar y disminuir cantidad */}
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                      onClick={() => handleDecreaseQuantity(item.id)}
                                    >
                                      -
                                    </button>
                                    <span className="text-sm">{item.quantity}</span>
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                      onClick={() => handleIncreaseQuantity(item.id)}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                      onClick={() => handleRemoveItem(item.id)}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumen del carrito */}
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p> {/* Mostrar el total calculado */}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/checkout')}
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Ir a pagar
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      o
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => navigate('/items')}
                      >
                        Continuar comprando
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                  <button
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-md"
                    onClick={() => dispatch(clearCart())}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
