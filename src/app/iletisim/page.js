"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function IletisimPage() {
  const [contact, setContact] = useState({ address: "", phone: "05467899297", email: "", whatsapp: "05467899297", instagram: "" });

  useEffect(() => {
    const fetchContact = async () => {
      const c = await getDoc(doc(db, "settings", "contact"));
      if (c.exists()) setContact(c.data());
    };
    fetchContact();
  }, []);

  return (
    <main className="container mx-auto py-16 md:py-24 lg:py-32 px-4 md:px-6 bg-white/40 backdrop-blur-sm min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-8 text-green-900 leading-tight">Bize Ulaşın</h1>
          <p className="text-sm md:text-base lg:text-xl text-gray-500 font-medium leading-relaxed mb-6 md:mb-12">
            Sorularınız, projeleriniz veya ücretsiz keşif talepleriniz için her zaman buradayız.
          </p>

          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div className="flex gap-3 md:gap-4 lg:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-green-50 rounded-xl md:rounded-2xl flex items-center justify-center text-green-600 text-lg md:text-xl lg:text-2xl flex-shrink-0">📍</div>
              <div>
                <h4 className="font-black text-gray-800 text-sm md:text-base lg:text-lg mb-1">Adres</h4>
                <p className="text-gray-500 font-medium text-sm md:text-base">{contact.address || "Adres bilgisi eklenmemiş."}</p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 lg:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-green-50 rounded-xl md:rounded-2xl flex items-center justify-center text-green-600 text-lg md:text-xl lg:text-2xl flex-shrink-0">📞</div>
              <div>
                <h4 className="font-black text-gray-800 text-sm md:text-base lg:text-lg mb-1">Telefon</h4>
                <p className="text-gray-500 font-medium text-sm md:text-base">{contact.phone || "Telefon bilgisi eklenmemiş."}</p>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 lg:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-green-50 rounded-xl md:rounded-2xl flex items-center justify-center text-green-600 text-lg md:text-xl lg:text-2xl flex-shrink-0">📧</div>
              <div>
                <h4 className="font-black text-gray-800 text-sm md:text-base lg:text-lg mb-1">E-posta</h4>
                <p className="text-gray-500 font-medium text-sm md:text-base">{contact.email || "E-posta bilgisi eklenmemiş."}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4">
            {contact.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" className="bg-green-600 text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black hover:bg-green-700 transition shadow-xl shadow-green-900/20 text-sm md:text-base lg:text-base text-center">WhatsApp'tan Yaz</a>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" className="bg-pink-600 text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black hover:bg-pink-700 transition shadow-xl shadow-pink-900/20 text-sm md:text-base lg:text-base text-center">Instagram</a>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 md:p-8 lg:p-10 xl:p-16 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 mb-4 md:mb-6 lg:mb-8">Mesaj Gönderin</h3>
          <form className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-xs md:text-sm font-black text-gray-400 uppercase mb-2 md:mb-3 ml-2">Adınız Soyadınız</label>
              <input type="text" className="w-full bg-white border-2 border-transparent p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl outline-none focus:border-green-500 transition font-bold text-gray-800 shadow-sm text-sm md:text-base" placeholder="Ahmet Yılmaz" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-black text-gray-400 uppercase mb-2 md:mb-3 ml-2">Mesajınız</label>
              <textarea className="w-full bg-white border-2 border-transparent p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl outline-none focus:border-green-500 transition h-32 md:h-40 font-bold text-gray-800 shadow-sm text-sm md:text-base" placeholder="Nasıl yardımcı olabiliriz?"></textarea>
            </div>
            <button className="w-full bg-green-900 text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-2xl shadow-green-950/20 hover:bg-green-800 transition transform hover:-translate-y-1">Gönder</button>
          </form>
        </div>
      </div>
      <div className="mt-12 md:mt-20 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl h-[300px] md:h-[400px] lg:h-[500px] relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.883381615566!2d35.5904!3d38.7454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQ0JzQzLjQiTiAzNcKwMzUnMjUuNCJF!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str" 
          className="w-full h-full border-0" 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </div>
    </main>
  );
}
