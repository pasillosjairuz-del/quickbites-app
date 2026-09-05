import React, { useState } from 'react';

export default function FilterModal({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-[300px] bg-[#FAF8ED] rounded-lg overflow-hidden shadow-2xl border border-gray-300 font-sans">
        
        {/* Header */}
        <div className="bg-[#1C6400] text-white p-4">
          <h2 className="text-xl font-extrabold tracking-wider">FILTER LIST</h2>
        </div>

        <div className="p-4 space-y-4 text-gray-800">
          
          {}
          <section>
            <div className="bg-[#FFCC00] text-black font-extrabold px-3 py-1.5 rounded-lg shadow-sm mb-2 text-sm tracking-wide">
              CATEGORY
            </div>
            <div className="space-y-1.5 pl-2 text-xs font-medium">
              {['All Items', 'Rice Meals', 'Favorites', 'Drinks'].map((item) => (
                <label key={item} className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === item}
                    onChange={() => setSelectedCategory(item)}
                    className="w-3.5 h-3.5 accent-[#1C6400]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </section>

          {}
          <section>
            <div className="bg-[#FFCC00] text-black font-extrabold px-3 py-1.5 rounded-lg shadow-sm mb-2 text-sm tracking-wide">
              DIETARY
            </div>
            <div className="space-y-1.5 pl-2 text-xs font-medium">
              {['Meat', 'Poultry', 'Seafood', 'Vegetarian', 'Vegan', 'Pork-Free', 'Beef-Free', 'Nut-Free'].map((item) => (
                <label key={item} className="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-[#1C6400]" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </section>

          {}
          <section>
            <div className="bg-[#FFCC00] text-black font-extrabold px-3 py-1.5 rounded-lg shadow-sm mb-2 text-sm tracking-wide">
              MEAL TIME
            </div>
            <div className="space-y-1.5 pl-2 text-xs font-medium">
              {['Breakfast', 'Lunch', 'Merienda'].map((item) => (
                <label key={item} className="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-[#1C6400]" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </section>

          {}
          <section>
            <div className="bg-[#FFCC00] text-black font-extrabold px-3 py-1.5 rounded-lg shadow-sm text-sm tracking-wide">
              SORT BY:
            </div>
          </section>

          {}
          <button 
            onClick={onClose}
            className="w-full mt-2 bg-[#1C6400] text-white py-1.5 rounded-md text-xs font-bold hover:bg-green-800 transition"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
}