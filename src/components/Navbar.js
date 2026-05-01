"use client";
import React, { useState, useEffect } from "react";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebase";

export function Navbar() { 
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const trackVisit = async () => {
      const today = new Date().toISOString().split('T')[0];
      const visitKey = `visited_${today}`;
      if (!localStorage.getItem(visitKey)) {
        try {
          const visitRef = doc(db, "stats", "visits");
          await setDoc(visitRef, { count: increment(1) }, { merge: true });
          localStorage.setItem(visitKey, "true");
        } catch (e) {
          console.error("Ziyaretçi takibi hatası:", e);
        }
      }
    };
    trackVisit();
  }, []);

  const navLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Bitkiler", href: "/urunler" },
    { name: "Blog", href: "/blog" },
    { name: "Yaptıklarımız", href: "/galeri" },
  ];

  return ( 
    <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg transition-colors"> 
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex justify-between items-center">
        <h1 className="text-lg md:text-xl lg:text-2xl font-black text-green-900 tracking-tighter flex items-center gap-2">
          <span className="bg-green-100 p-1.5 md:p-2 rounded-xl text-sm md:text-base">🌿</span>
          <span className="hidden sm:inline">Yeşilİz</span> <span className="text-green-600">Peyzaj</span>
        </h1> 
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-xs md:text-sm font-semibold text-gray-600 items-center"> 
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-green-700 transition">{link.name}</a>
          ))}
          <a href="/iletisim" className="bg-green-800 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full hover:bg-green-700 transition text-xs md:text-sm">İletişim</a> 
        </div> 

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 text-2xl md:text-3xl focus:outline-none"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-[90] transition-transform duration-500 md:hidden ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-6 md:gap-8 p-4 md:p-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-2xl md:text-3xl font-black text-gray-900 hover:text-green-600 transition"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="/iletisim" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center bg-green-800 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl shadow-xl shadow-green-900/20"
          >
            İletişim
          </a>
        </div>
      </div>
    </nav> 
  ); 
} 
