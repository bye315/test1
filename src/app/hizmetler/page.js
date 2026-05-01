"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function HizmetlerPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const s = await getDocs(collection(db, "services"));
        setServices(s.docs.map(x => ({ id: x.id, ...x.data() })));
      } catch (error) {
        console.error("Hizmetler Çekme Hatası:", error);
      }
    };
    fetchServices();
  }, []);

  const trackClick = async (serviceName) => {
    try {
      const statsRef = doc(db, "stats", "service_clicks");
      const docSnap = await getDoc(statsRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        await setDoc(statsRef, { ...data, [serviceName]: (data[serviceName] || 0) + 1 });
      } else {
        await setDoc(statsRef, { [serviceName]: 1 });
      }
    } catch (e) {
      console.error("Click tracking error:", e);
    }
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 bg-white/40 backdrop-blur-sm transition-colors">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 md:mb-12 lg:mb-20 tracking-tighter">Hizmetlerimiz</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {services && services.length > 0 ? (
            services.map((s) => (
              <div 
                key={s.id} 
                className="group bg-gray-50 dark:bg-gray-800 p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => trackClick(s.title)}
              >
                {s.image ? (
                  <img src={s.image} alt={s.title} className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-xl md:rounded-2xl" />
                ) : (
                  <div className="w-full h-48 md:h-56 lg:h-64 bg-green-50 flex items-center justify-center text-green-600 text-2xl md:text-3xl group-hover:bg-green-600 group-hover:text-white transition rounded-xl md:rounded-2xl">🌿</div>
                )}
                <div className="pt-6 md:pt-8 lg:pt-10">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-black text-gray-800 dark:text-white mb-3 md:mb-4">{s.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-sm md:text-base">{s.desc}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 md:py-20">
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Henüz hizmet eklenmemiş.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
