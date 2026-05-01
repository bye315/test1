"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Hero } from "../components/Hero";
import { Teklif } from "../components/Teklif";
import { Randevu } from "../components/Randevu";
import { LeadForm } from "../components/LeadForm";
import { Reviews } from "../components/Reviews";
import { BeforeAfter } from "../components/BeforeAfter";

export default function Home() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await getDocs(collection(db, "services"));
        setServices(s.docs.map(x => ({ id: x.id, ...x.data() })));
        
        const p = await getDocs(collection(db, "products"));
        setProducts(p.docs.map(x => ({ id: x.id, ...x.data() })));
      } catch (error) {
        console.error("Firebase Veri Çekme Hatası:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white/20 backdrop-blur-sm">
      <Hero />
      
      {/* Hizmetler Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 lg:mb-24 gap-6 md:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-green-900 mb-4 md:mb-8 tracking-tighter">Hayalinizdeki Bahçeyi<br/>Tasarlıyoruz</h2>
              <p className="text-gray-500 text-sm md:text-base lg:text-xl font-medium leading-relaxed">Profesyonel peyzaj mimarlarımız ve uzman ekibimizle yaşam alanlarınızı doğayla sanatsal bir şekilde buluşturuyoruz.</p>
            </div>
            <div className="flex gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all cursor-pointer">←</div>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all cursor-pointer">→</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {services.length > 0 ? (
              services.map((s, idx) => (
                <div key={s.id} className={`group relative bg-gray-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-4 ${idx === 1 ? 'md:mt-12' : ''}`}>
                  <div className="aspect-[4/5] overflow-hidden">
                    {s.image ? (
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-green-50 flex items-center justify-center text-4xl md:text-5xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">🌿</div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-black mb-1 md:mb-2">{s.title}</h3>
                    <p className="text-gray-200 text-xs md:text-sm font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{s.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 opacity-50">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-xl md:rounded-2xl mb-4 md:mb-8" />
                  <div className="h-4 md:h-6 bg-gray-100 rounded-full w-3/4 mb-2 md:mb-4" />
                  <div className="h-3 md:h-4 bg-gray-100 rounded-full w-full mb-1 md:mb-2" />
                  <div className="h-3 md:h-4 bg-gray-100 rounded-full w-5/6" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Teklif />

      {/* Lead Form Section */}
      <section id="keşif-formu" className="py-16 md:py-24 lg:py-32 bg-gray-50/20 backdrop-blur-sm transition-colors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <LeadForm />
          </div>
        </div>
      </section>

      <Reviews />

      <BeforeAfter />

      <Randevu />
    </main>
  );
} 
