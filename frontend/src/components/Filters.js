import React, { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState(1000);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onFilterChange({ category: value, max: priceRange });
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange(value);
    onFilterChange({ category, max: value });
  };

  return (
    <div className="mx-auto max-w-2xl px-2 py-6 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
      {/* Filtro por categoría */}
      <div className="w-[35%]">
        <select
          className="w-full px-4 py-2 border rounded-md"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Todas las categorías</option>
          <option value="Electrónica">Electrónica</option>
          <option value="Ropa">Ropa</option>
          <option value="Hogar">Hogar</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      {/* Filtro por rango de precio */}
      <div className="w-[35%]">
        <label className="block text-gray-700 mb-1">Precio máximo: ${priceRange}</label>
        <input
          className="w-full"
          type="range"
          min="0"
          max="1000"
          step="10"
          value={priceRange}
          onChange={handlePriceChange}
        />
      </div>
    </div>
  );
};

export default Filters;
