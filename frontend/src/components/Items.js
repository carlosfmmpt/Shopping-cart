import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productSlice";
import Filters from "./Filters";

const Items = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({ category: "", min: 0, max: Infinity });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Filtrar los productos
  const filteredProducts = items.filter((product) => {
    const matchesCategory = filters.category
      ? product.category === filters.category
      : true;
    const matchesPrice =
      product.price >= Number(filters.min || 0) &&
      product.price <= Number(filters.max || Infinity);
    return matchesCategory && matchesPrice;
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      

      {/* Filtros */}
      <Filters onFilterChange={handleFilterChange} />

      {/* Lista de productos */}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <img
                  src={`http://localhost:5000/${product.image}`}
                  alt={product.name}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
