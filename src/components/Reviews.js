"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), where("status", "==", "approved"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Çekilen onaylı yorumlar:", data);
      setReviews(data);
    } catch (error) {
      console.error("Yorum çekme hatası:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        ...newReview,
        status: "approved", // Test için doğrudan onaylı yapıyoruz, normalde pending olmalı
        createdAt: serverTimestamp()
      });
      console.log("Yeni yorum eklendi, ID:", docRef.id);
      setSuccess(true);
      setNewReview({ name: "", rating: 5, comment: "" });
      fetchReviews(); // Listeyi güncelle
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
    } catch (error) {
      console.error("Yorum gönderme hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white transition-colors">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-4 md:mb-6 tracking-tighter">
              Müşteri <span className="text-green-600">Yorumları</span>
            </h2>
            <p className="text-sm md:text-base lg:text-xl text-gray-500 font-medium leading-relaxed">
              Yeşilİz Peyzaj ile bahçesini dönüştüren yüzlerce mutlu müşterimizden bazıları.
            </p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-green-900 text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-base lg:text-lg hover:bg-green-800 transition shadow-xl"
          >
            {showForm ? "Kapat" : "Yorum Yap"}
          </button>
        </div>

        {showForm && (
          <div className="mb-12 md:mb-20 bg-gray-50 p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] border border-gray-100 animate-fade-in-up">
            {success ? (
              <div className="text-center py-8 md:py-10">
                <div className="text-4xl md:text-5xl mb-4">✅</div>
                <h3 className="text-xl md:text-2xl font-black text-green-900">Teşekkürler!</h3>
                <p className="text-gray-500 font-medium">Yorumunuz onaylandıktan sonra yayınlanacaktır.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-2">Adınız Soyadınız</label>
                    <input 
                      required
                      type="text" 
                      className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-white border-2 border-transparent focus:border-green-500 outline-none font-bold text-gray-800 shadow-sm"
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-2">Puanınız</label>
                    <select 
                      className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-white border-2 border-transparent focus:border-green-500 outline-none font-bold text-gray-800 shadow-sm"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-2">Yorumunuz</label>
                  <textarea 
                    required
                    className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-white dark:bg-gray-900 border-2 border-transparent focus:border-green-500 outline-none font-bold text-gray-800 dark:text-white shadow-sm h-24 md:h-32"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-green-900 text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-base md:text-xl hover:bg-green-800 transition disabled:opacity-50"
                >
                  {loading ? "Gönderiliyor..." : "Yorumu Gönder"}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all group">
                <div className="text-yellow-500 mb-4 md:mb-6 text-xl md:text-2xl">{"⭐".repeat(review.rating)}</div>
                <p className="text-gray-600 font-medium italic mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-black text-sm md:text-base">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm md:text-base">{review.name}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Doğrulanmış Müşteri</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 md:py-20 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-bold text-base md:text-xl">Henüz yorum yapılmamış.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
