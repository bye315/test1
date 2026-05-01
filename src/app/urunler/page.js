import React from "react";
import { Urunler } from "../../components/Urunler";

export default function UrunlerPage() {
  return (
    <main className="container mx-auto py-8 md:py-12 px-4 md:px-6 bg-white/40 backdrop-blur-sm min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-green-800">Bitkiler ve Ürünler</h1>
        <Urunler />
        <div className="mt-8 md:mt-12 p-4 md:p-6 bg-green-50 rounded-xl border border-green-200 text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-green-800 mb-3 md:mb-4">Özel Sipariş</h2>
        <p className="text-green-700 text-sm md:text-base">İstediğiniz bitkiyi bulamadınız mı? Bize ulaşın, sizin için temin edelim.</p>
      </div>
    </main>
  );
}
