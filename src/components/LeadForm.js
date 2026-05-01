import React, { useState } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    m2: '',
    location: '',
    urgency: 'Normal',
    message: '',
    photo: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = '';
      if (formData.photo) {
        const storageRef = ref(storage, `leads/${Date.now()}_${formData.photo.name}`);
        await uploadBytes(storageRef, formData.photo);
        photoUrl = await getDownloadURL(storageRef);
      }

      const leadData = {
        ...formData,
        photo: photoUrl,
        status: 'Yeni',
        createdAt: serverTimestamp(),
        source: 'Web Form'
      };

      await addDoc(collection(db, 'leads'), leadData);

      // Real AI Response
      try {
        const prompt = `Yeni bir müşteri talebi geldi.
        İsim: ${formData.name}
        Bahçe m²: ${formData.m2}
        Konum: ${formData.location}
        Aciliyet: ${formData.urgency}
        Mesaj: ${formData.message}
        
        Lütfen bu müşteriye özel, nazik ve profesyonel bir karşılama mesajı yaz. Bahçesinin büyüklüğüne ve konumuna göre kısa bir ön değerlendirme yap. En kısa zamanda uzman bir ekip arkadaşımızın kendisini arayacağını belirt.`;

        const aiRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
        });
        const aiData = await aiRes.json();
        
        if (aiData.message) {
          setAiResponse(aiData.message);
        } else {
          generateAiResponse(formData); // Fallback to simulation
        }

        // Increment AI Usage Stat
        const statsRef = doc(db, "stats", "ai_usage");
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          await setDoc(statsRef, { count: (docSnap.data().count || 0) + 1 }, { merge: true });
        } else {
          await setDoc(statsRef, { count: 1 });
        }
      } catch (err) {
        console.error("AI Response error:", err);
        generateAiResponse(formData); // Fallback
      }

      setSuccess(true);
      
      setFormData({
        name: '', phone: '', email: '', m2: '', location: '', urgency: 'Normal', message: '', photo: null
      });
    } catch (error) {
      console.error('Lead hatası:', error);
      alert('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const generateAiResponse = (data) => {
    const responses = [
      `Merhaba ${data.name}! ${data.m2 ? `${data.m2} m²'lik` : ''} bahçeniz için talebinizi aldık. ${data.location ? `${data.location} bölgesindeki` : ''} projelerimizde genellikle en kaliteli çözümleri sunuyoruz. Uzman ekibimiz en kısa zamanda sizi arayacak!`,
      `Harika bir seçim ${data.name}! ${data.urgency === 'Acil' ? 'Aciliyetinizi anlıyoruz, ekiplerimizi hemen yönlendiriyoruz.' : 'Planlamanızı birlikte yapalım.'} Bahçeniz için en uygun bitki seçimi ve tasarım önerileriyle en kısa sürede yanınızdayız.`,
      `Yeşilİz Peyzaj'a hoş geldiniz ${data.name}. ${data.m2} m² alanınız için harika tasarım fikirlerimiz var. AI sistemimiz şu an analiz yapıyor, temsilcimiz detaylar için en kısa sürede sizi aramak üzere.`
    ];
    setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
  };

  if (success) {
    return (
      <div className="bg-green-50 p-10 md:p-20 rounded-[3rem] text-center border-2 border-green-100 animate-fade-in-up">
        <div className="text-6xl mb-8">🤖</div>
        <h3 className="text-4xl font-black text-green-900 mb-6">AI Analizi Tamamlandı!</h3>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl mb-8 text-left border-l-8 border-green-500">
          <p className="text-xl text-gray-700 font-medium leading-relaxed">
            {aiResponse}
          </p>
        </div>
        <p className="text-green-700 font-black uppercase tracking-widest text-sm">
          ⚡ En kısa zamanda size dönüş yapacağız...
        </p>
        <button onClick={() => setSuccess(false)} className="mt-12 text-green-900 font-bold underline hover:text-green-700 transition">Yeni bir form doldur</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 transition-colors">
      <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Ücretsiz Keşif İste</h3>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input
            required
            type="text"
            placeholder="Adınız Soyadınız"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none transition font-bold text-gray-800"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            required
            type="tel"
            placeholder="Telefon Numaranız"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none transition font-bold text-gray-800"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input
            type="text"
            placeholder="Bahçe m² (Örn: 250)"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none transition font-bold text-gray-800"
            value={formData.m2}
            onChange={(e) => setFormData({...formData, m2: e.target.value})}
          />
          <input
            type="text"
            placeholder="Konum (İlçe/Semt)"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none transition font-bold text-gray-800"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div className="space-y-4">
          <select
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none transition font-bold text-gray-800"
            value={formData.urgency}
            onChange={(e) => setFormData({...formData, urgency: e.target.value})}
          >
            <option value="Normal">Aciliyet: Normal</option>
            <option value="Acil">Aciliyet: Hemen (1-3 Gün)</option>
            <option value="Planlama">Aciliyet: Planlama (Gelecek Ay)</option>
          </select>
          <div className="relative">
            <label className="block text-xs font-black text-gray-400 mb-2 ml-2 uppercase">Bahçe Fotoğrafı (Opsiyonel)</label>
            <input
              type="file"
              className="w-full px-6 py-3 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 text-sm font-bold text-gray-500"
              onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
            />
          </div>
              <textarea
                placeholder="Notlarınız..."
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none transition font-bold text-gray-800 h-[100px]"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
        </div>

        <div className="md:col-span-2">
          <button
            disabled={loading}
            className="w-full bg-green-900 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Gönderiliyor...' : 'Teklif Al & AI Keşfi Başlat'}
          </button>
        </div>
      </form>
    </div>
  );
}
