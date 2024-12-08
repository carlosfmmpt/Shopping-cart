import React, { useState } from "react";
import ProductList from "./ProductList";
import Items from "./Items";

const Banner = () => {
  const [activeOption, setActiveOption] = useState(""); // Estado para manejar la opción activa

// me activa la opcion y renderiza el componente
  return (
    <div className="h-screen">
      {/* Encabezado */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50">
        <h1 className="text-lg font-semibold">Online Store</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            <button
              onClick={() => setActiveOption("opcion1")}
              className={`py-2 px-4 rounded-md ${
                activeOption === "opcion1" ? "bg-blue-800" : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Admin
            </button>
          </span>
          <span className="text-sm font-medium">
            <button
              onClick={() => setActiveOption("opcion2")}
              className={`py-2 px-4 rounded-md ${
                activeOption === "opcion3" ? "bg-blue-800" : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Items
            </button>
          </span>
          <span className="text-sm font-medium">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Shopping Cart
            </button>
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {activeOption === "opcion1" && (
          <div>
            <h1 className="text-3xl font-semibold text-center mb-6">Product List</h1>
            <ProductList /> {/* Renderiza tu formulario de productos */}
          </div>
        )}
        {activeOption === "opcion2" && (
          <div>
            <h1 className="text-3xl font-semibold text-center mb-6">Items</h1>
            <Items /> {/* Renderiza tu lista de productos */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
