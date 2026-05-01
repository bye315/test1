"use client";
import React, { useState, useEffect } from "react"; 
import { getDocs, collection } from "firebase/firestore"; 
import { db } from "../lib/firebase";

export function Urunler() { 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const p = await getDocs(collection(db, "products"));
      setProducts(p.docs.map(x => ({ id: x.id, ...x.data() })));
    };
    fetchProducts();
  }, []);

  return ( 
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.map(p => (
        <div key={p.id} className="group">
          <div className="aspect-square bg-white rounded-[1rem] md:rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-4 md:mb-6 relative">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-green-50 flex items-center justify-center text-3xl md:text-4xl">🌿</div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-500 flex items-center justify-center">
              <button className="bg-white text-green-900 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl font-black shadow-2xl scale-0 group-hover:scale-100 transition duration-500 text-xs md:text-sm lg:text-base">
                Satın Al
              </button>
            </div>
          </div>
          <div className="text-center px-2 md:px-4">
            <h3 className="text-sm md:text-base lg:text-xl xl:text-2xl font-black text-gray-800 mb-1 md:mb-2">{p.name}</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">{p.desc}</p>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-green-600">{p.price}₺</p>
          </div>
        </div>
      ))}
    </div>
  ); 
} 
