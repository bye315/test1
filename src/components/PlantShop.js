"use client";
import React, { useState, useEffect } from "react";

const plants = [
  { id: 1, name: "Mavi Ladin", category: "Ağaç", price: 2500, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800", description: "Dayanıklı ve gösterişli bir dış mekan ağacı." },
  { id: 2, name: "Alev Ağacı", category: "Çalı", price: 450, image: "https://images.unsplash.com/photo-1598901861713-a4ad16a7d737?q=80&w=800", description: "Kırmızı yapraklarıyla bahçenize renk katar." },
  { id: 3, name: "Lavanta", category: "Süs Bitkisi", price: 85, image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?q=80&w=800", description: "Mis kokulu ve az bakım gerektiren bir bitki." },
  { id: 4, name: "Leylandi", category: "Çit", price: 350, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800", description: "Hızlı büyüyen, mahremiyet sağlayan çit bitkisi." },
  { id: 5, name: "Süs Kirazı", category: "Ağaç", price: 1200, image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=800", description: "Bahar aylarında muazzam çiçekler açar." },
  { id: 6, name: "Ortanca", category: "Süs Bitkisi", price: 120, image: "https://images.unsplash.com/photo-1507005313807-26553f360340?q=80&w=800", description: "Gölge alanlar için ideal, renkli çiçekler." },
];

export function PlantShop() {
  const [activeCategory, setActiveCategory] = useState("Hepsi");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (plant) => {
    const existing = cart.find(item => item.id === plant.id);
    if (existing) {
      setCart(cart.map(item => item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...plant, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const filteredPlants = activeCategory === "Hepsi" 
    ? plants 
    : plants.filter(p => p.category === activeCategory);

  return (
    <section id="shop" className="py-32 bg-gray-50 dark:bg-gray-950 transition-colors overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
              Bitki <span className="text-green-600">& Ağaç</span> Mağazası
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              Bahçeniz için en kaliteli bitkileri seçin. Uzman ekibimiz tarafından dikim desteği ile.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {["Hepsi", "Ağaç", "Çalı", "Süs Bitkisi", "Çit"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? "bg-green-900 text-white shadow-xl" 
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPlants.map(plant => (
            <div key={plant.id} className="group bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-green-900 dark:text-green-400 font-black text-xs uppercase tracking-widest">
                  {plant.category}
                </div>
              </div>
              <div className="p-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">{plant.name}</h3>
                  <span className="text-2xl font-black text-green-600">{plant.price}₺</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                  {plant.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-400 dark:text-gray-500 font-bold italic">
            * Listelenen fiyatlar başlangıç fiyatlarıdır. Toplu alımlar için lütfen iletişime geçiniz.
          </p>
        </div>
      </div>
    </section>
  );
}
