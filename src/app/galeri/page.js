"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function GaleriPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Hepsi");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data.length === 0) {
          // Örnek veriler
          setProjects([
            { id: 1, title: "Modern Villa Bahçesi", category: "Peyzaj Tasarımı", image: "https://images.unsplash.com/photo-1558905734-b83d843a1570?q=80&w=800", location: "Kayseri / Talas" },
            { id: 2, title: "Rulo Çim Uygulaması", category: "Uygulama", image: "https://images.unsplash.com/photo-1592150621344-220b29ce9620?q=80&w=800", location: "Kayseri / Hisarcık" },
            { id: 3, title: "Otomatik Sulama Sistemi", category: "Teknik", image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=800", location: "Kayseri" },
            { id: 4, title: "Süs Havuzu ve Şelale", category: "Su Mimarisi", image: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=800", location: "Kayseri / Bahçelievler" },
            { id: 5, title: "Dikey Bahçe Tasarımı", category: "Peyzaj Tasarımı", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800", location: "Kayseri / Merkez" },
            { id: 6, title: "Aydınlatma Projesi", category: "Teknik", image: "https://images.unsplash.com/photo-1566417713940-05a041215973?q=80&w=800", location: "Kayseri / Erciyes" },
          ]);
        } else {
          setProjects(data);
        }
      } catch (error) {
        console.error("Galeri fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ["Hepsi", "Peyzaj Tasarımı", "Uygulama", "Teknik", "Su Mimarisi"];

  const filteredProjects = filter === "Hepsi" 
    ? projects 
    : projects.filter(p => p.category === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 bg-white/40 backdrop-blur-sm transition-colors">
      <div className="container mx-auto px-4 md:px-6">
        <header className="max-w-4xl mb-8 md:mb-12 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 mb-4 md:mb-8 tracking-tighter leading-none">
            Yaptığımız <span className="text-green-600">İşler</span>
          </h1>
          <p className="text-sm md:text-base lg:text-2xl text-gray-500 font-medium leading-relaxed">
            Kayseri Peyzaj olarak hayata geçirdiğimiz referans projelerimiz.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12 lg:mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs lg:text-sm uppercase tracking-widest transition-all ${
                filter === cat 
                ? "bg-green-600 text-white shadow-xl shadow-green-900/20" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group relative rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6 lg:p-10">
                <span className="text-green-400 font-black text-[10px] md:text-xs lg:text-xs uppercase tracking-[0.3em] mb-2 md:mb-4">{project.category}</span>
                <h3 className="text-lg md:text-2xl lg:text-3xl font-black text-white mb-1 md:mb-2">{project.title}</h3>
                <p className="text-gray-300 font-medium flex items-center gap-2 text-xs md:text-sm lg:text-base">
                  <span className="text-lg md:text-xl">📍</span> {project.location}
                </p>
              </div>
              <div className="absolute top-4 md:top-6 lg:top-8 right-4 md:right-6 lg:right-8 bg-white/10 backdrop-blur-md px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-white font-black text-[10px] md:text-xs uppercase tracking-widest border border-white/20">
                Görüntüle
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
