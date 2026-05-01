"use client";
import React from "react";
import { addDoc, collection } from "firebase/firestore"; 
import { db } from "../lib/firebase";

export function Randevu() { 
  const gonder = async () => { 
    try {
      await addDoc(collection(db, "randevu"), { tarih: new Date() }); 
      alert("Gönderildi"); 
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu");
    }
  }; 
 
  return ( 
    <div className="space-y-4">
      <input type="text" placeholder="Adınız Soyadınız" className="w-full bg-green-700/50 border border-green-600 p-4 rounded-2xl outline-none focus:bg-green-700 transition placeholder:text-green-300" />
      <input type="tel" placeholder="Telefon Numaranız" className="w-full bg-green-700/50 border border-green-600 p-4 rounded-2xl outline-none focus:bg-green-700 transition placeholder:text-green-300" />
      <button onClick={gonder} className="w-full bg-white text-green-900 font-bold p-4 rounded-2xl hover:bg-green-50 transition shadow-lg"> 
        Hemen Randevu Al 
      </button> 
    </div>
  ); 
} 
