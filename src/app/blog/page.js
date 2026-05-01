"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "blog"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Blog fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 bg-white/40 backdrop-blur-sm transition-colors">
      <div className="container mx-auto px-4 md:px-6">
        <header className="max-w-3xl mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tighter">
            Blog & <span className="text-green-600">Peyzaj Rehberi</span>
          </h1>
          <p className="text-sm md:text-base lg:text-xl text-gray-600 dark:text-gray-400 font-medium">
            Bahçe bakımı, peyzaj mimarlığı ve bitki dünyasına dair uzman görüşleri.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                {post.image && (
                  <div className="h-48 md:h-56 lg:h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex gap-2 mb-3 md:mb-4">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
                      {post.category || "Genel"}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-3 md:mb-4 leading-tight group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 line-clamp-3 font-medium text-sm md:text-base">
                    {post.summary || post.content?.substring(0, 150) + "..."}
                  </p>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-black uppercase text-[10px] md:text-xs tracking-widest hover:gap-4 transition-all"
                  >
                    Devamını Oku
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12 md:py-20 bg-white dark:bg-gray-800 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 font-bold text-base md:text-xl">Henüz yazı eklenmemiş.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
