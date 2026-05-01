"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export function BeforeAfter() {
  const [beforeAfterItems, setBeforeAfterItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeforeAfter = async () => {
      try {
        const snapshot = await getDocs(collection(db, "beforeAfter"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBeforeAfterItems(data);
      } catch (error) {
        console.error("Before/After fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeforeAfter();
  }, []);

  if (loading) return null;

  return (
    <section className="py-16 md:py-20 lg:py-32 bg-white/20 backdrop-blur-sm transition-colors overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-4 md:mb-6 tracking-tighter">
            Bahçenin <span className="text-green-600">Öncesi & Sonrası</span>
          </h2>
          <p className="text-sm md:text-base lg:text-xl text-gray-500 font-medium">
            Yeşilİz Peyzaj olarak hayata geçirdiğimiz bahçe dönüşümleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {beforeAfterItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100">
              <div className="relative h-64 md:h-80 lg:h-96">
                <img 
                  src={item.beforeImage} 
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <img 
                  src={item.afterImage} 
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-white/90 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-green-900 font-black text-xs uppercase tracking-widest">
                  Hover ile Sonrası gör
                </div>
              </div>
              <div className="p-6 md:p-8 lg:p-10">
                <h3 className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 mb-3 md:mb-4">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
