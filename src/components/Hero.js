"use client";
import React, { useState, useEffect } from "react"; 
import { getDoc, doc } from "firebase/firestore"; 
import { db } from "../lib/firebase";

export function Hero() { 
  const [data, setData] = useState({
    title: "Doğayı Evinizin Kalbine Getirin",
    subtitle: "Modern tasarımlar ve uzman ekibimizle bahçenizi yaşayan bir sanat eserine dönüştürüyoruz."
  });

  useEffect(() => {
    const fetchHero = async () => {
      const h = await getDoc(doc(db, "settings", "hero"));
      if (h.exists()) setData(h.data());
    };
    fetchHero();
  }, []);

  return (
    <section className="relative h-[95vh] flex items-center pt-16 md:pt-20">
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="max-w-4xl">
          <div className="animate-fade-in-up">
            <span className="bg-white/90 text-green-800 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-black tracking-widest uppercase mb-6 md:mb-8 inline-flex items-center gap-2 backdrop-blur-md border border-green-600/50 shadow-lg">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              Yeşilİz Peyzaj
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-9xl font-black text-gray-900 leading-[0.9] mb-6 md:mb-8 tracking-tighter drop-shadow-2xl">
              {data.title || "Doğayı Kapınıza Getiriyoruz"}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-gray-800 mb-8 md:mb-12 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
              {data.subtitle || "Modern peyzaj çözümleri, bahçe bakımı ve profesyonel tasarım hizmetleri ile yaşam alanlarınıza değer katıyoruz."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-6">
              <button 
                onClick={() => {
                  const formElement = document.getElementById('keşif-formu');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="group bg-green-600 text-white px-6 md:px-8 lg:px-12 py-4 md:py-5 lg:py-6 rounded-2xl md:rounded-3xl font-black text-sm md:text-base lg:text-lg xl:text-xl shadow-[0_20px_50px_rgba(22,163,74,0.3)] hover:bg-green-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 md:gap-3"
              >
                Ücretsiz Keşif İste
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <button 
                onClick={() => window.location.href = '/galeri'}
                className="bg-white/5 backdrop-blur-xl text-white border-2 border-white/20 px-6 md:px-8 lg:px-12 py-4 md:py-5 lg:py-6 rounded-2xl md:rounded-3xl font-black text-sm md:text-base lg:text-lg xl:text-xl hover:bg-white/10 transition-all hover:border-white/40"
              >
                Projelerimiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 md:bottom-10 right-4 md:right-10 z-20 hidden lg:block">
        <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 flex gap-6 md:gap-8">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-white">15+</p>
            <p className="text-xs text-gray-400 font-bold uppercase">Yıllık Deneyim</p>
          </div>
          <div className="h-8 md:h-12 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-black text-white">500+</p>
            <p className="text-xs text-gray-400 font-bold uppercase">Mutlu Müşteri</p>
          </div>
        </div>
      </div>
    </section>
  );
} 
