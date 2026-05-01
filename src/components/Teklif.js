"use client";
import React, { useState, useEffect } from "react";

export function Teklif() {
  const [m2, setM2] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
   const [marketPrices, setMarketPrices] = useState({
     cim_bicme: 15,
     ilaclama: 25,
     gubreleme: 20,
     rulo_cim: 180,
     genel_bakim: 50
   });

   useEffect(() => {
    // İnternetten güncel fiyatları çekme simülasyonu
    const timer = setTimeout(() => {
      setMarketPrices({
        cim_bicme: 18,
        ilaclama: 30,
        gubreleme: 25,
        rulo_cim: 195,
        genel_bakim: 60
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    { id: "cim_bicme", name: "Çim Biçme", price: marketPrices.cim_bicme, icon: "✂️" },
    { id: "ilaclama", name: "İlaçlama", price: marketPrices.ilaclama, icon: "🧪" },
    { id: "gubreleme", name: "Gübreleme", price: marketPrices.gubreleme, icon: "🌱" },
    { id: "rulo_cim", name: "Rulo Çim Uygulama", price: marketPrices.rulo_cim, icon: "📜" },
    { id: "genel_bakim", name: "Periyodik Genel Bakım", price: marketPrices.genel_bakim, icon: "🏡" },
  ];

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculateTotal = () => {
    const totalPerM2 = selectedServices.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (service ? service.price : 0);
    }, 0);
    return totalPerM2 * Number(m2);
  };

  return (
    <section className="py-24 bg-green-900 relative overflow-hidden">
      {/* Dekoratif Arka Plan Parçaları */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-800 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-800 rounded-full blur-3xl -ml-48 -mb-48 opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Sol Taraf: Seçenekler */}
          <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Maliyet Hesaplayıcı</h2>
            <p className="text-gray-500 font-medium mb-10">Hizmetleri seçin ve alan büyüklüğünü girin.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Bahçe Alanı (m²)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    onChange={(e) => setM2(e.target.value)} 
                    placeholder="Örn: 100" 
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-5 rounded-2xl outline-none transition text-xl font-black text-gray-800" 
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xl">m²</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">İstenen Hizmetler</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        selectedServices.includes(service.id)
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-100 bg-white text-gray-600 hover:border-green-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{service.icon}</span>
                        <span className="font-bold text-sm text-left leading-tight">{service.name}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedServices.includes(service.id)
                        ? "bg-green-600 border-green-600"
                        : "border-gray-200"
                      }`}>
                        {selectedServices.includes(service.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Sonuç */}
          <div className="w-full md:w-[400px] bg-gray-50 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-8">Tahmini Maliyet</h3>
              
              <div className="space-y-4 mb-8">
                {selectedServices.length > 0 ? (
                  selectedServices.map(id => {
                    const s = services.find(x => x.id === id);
                    return (
                      <div key={id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">{s.name} (m²)</span>
                        <span className="text-gray-900 font-black">{s.price} ₺</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm font-medium italic">Lütfen hizmet seçiniz...</p>
                )}
                <div className="h-px bg-gray-200 my-4" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">Toplam Birim Fiyat</span>
                  <span className="text-gray-900 font-black">
                    {selectedServices.reduce((sum, id) => sum + services.find(s => s.id === id).price, 0)} ₺/m²
                  </span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-5xl font-black text-green-900 tracking-tighter">
                  {calculateTotal().toLocaleString()} ₺
                </p>
                <p className="text-gray-400 font-bold mt-2 uppercase text-xs tracking-widest">Tahmini Toplam Tutar</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start space-x-3 text-gray-400">
                <span className="text-xl">⚠️</span>
                <p className="text-xs leading-relaxed font-medium italic">
                  * Bu fiyatlar internet üzerindeki ortalama piyasa verilerine dayanmaktadır. Kullanılacak malzemenin kalitesi ve işçilik detaylarına göre kesin fiyat keşif sonrası belirlenir. <br /><br />
                  <strong className="text-gray-500 uppercase tracking-tighter">Not: Fiyatlarımız piyasa koşullarına göre değişiklik gösterebilir.</strong>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
