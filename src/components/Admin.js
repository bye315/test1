"use client";
import React, { useState, useEffect } from "react"; 
import { getDocs, collection, addDoc, doc, getDoc, setDoc, deleteDoc, enableNetwork } from "firebase/firestore"; 
import { db } from "../lib/firebase";
import { Garden3D } from "./Garden3D";

export function Admin() { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]); 
  const [heroData, setHeroData] = useState({ title: "", subtitle: "" });
  const [contactData, setContactData] = useState({ address: "", phone: "05467899297", email: "", whatsapp: "05467899297", instagram: "" });
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ dailyVisits: 142, leadCount: 0, aiUsage: 89, wonDeals: 12, topService: "Peyzaj Tasarımı" });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", desc: "", image: "" });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState({ title: "", desc: "", image: "" });

  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", category: "", summary: "", content: "", image: "" });

  const [beforeAfterItems, setBeforeAfterItems] = useState([]);
  const [showBeforeAfterForm, setShowBeforeAfterForm] = useState(false);
  const [newBeforeAfter, setNewBeforeAfter] = useState({ title: "", description: "", beforeImage: "", afterImage: "" });

  useEffect(() => { 
    const init = async () => {
      try {
        await enableNetwork(db);
        await fetchData();
      } catch (e) {
        console.error("Ağ başlatma hatası:", e);
      }
    };
    init();
  }, []); 

  const fetchData = async () => {
    setLoading(true);
    try {
      // Blog yazıları
      const b = await getDocs(collection(db, "blog"));
      setPosts(b.docs.map(x => ({ id: x.id, ...x.data() })));

      // Yorumlar
      const r_docs = await getDocs(collection(db, "reviews"));
      setReviews(r_docs.docs.map(x => ({ id: x.id, ...x.data() })));

      // Before/After
      const ba_docs = await getDocs(collection(db, "beforeAfter"));
      setBeforeAfterItems(ba_docs.docs.map(x => ({ id: x.id, ...x.data() })));
      // Randevular
      try {
        const r = await getDocs(collection(db, "randevu")); 
        setData(r.docs.map((x) => ({ id: x.id, ...x.data() }))); 
      } catch (e) { console.error("Randevu çekme hatası:", e); }

      // Hero
      try {
        const h = await getDoc(doc(db, "settings", "hero"));
        if (h.exists()) setHeroData(h.data());
      } catch (e) { console.error("Hero çekme hatası:", e); }

      // İletişim
      try {
        const c = await getDoc(doc(db, "settings", "contact"));
        if (c.exists()) setContactData(c.data());
      } catch (e) { console.error("İletişim çekme hatası:", e); }

      // Ürünler
      try {
        const p = await getDocs(collection(db, "products"));
        setProducts(p.docs.map(x => ({ id: x.id, ...x.data() })));
      } catch (e) { console.error("Ürün çekme hatası:", e); }

      // Hizmetler
      try {
        const s = await getDocs(collection(db, "services"));
        setServices(s.docs.map(x => ({ id: x.id, ...x.data() })));
      } catch (e) { console.error("Hizmet çekme hatası:", e); }

      // Leads (CRM)
      try {
        const l = await getDocs(collection(db, "leads"));
        const leadList = l.docs.map(x => ({ id: x.id, ...x.data() }));
        setLeads(leadList);
        const wonCount = leadList.filter(x => x.status === "Kazanılan").length;
        setStats(prev => ({ ...prev, leadCount: l.docs.length, wonDeals: wonCount }));
      } catch (e) { console.error("Lead çekme hatası:", e); }

      // Daily Visits Stat
      try {
        const v = await getDoc(doc(db, "stats", "visits"));
        if (v.exists()) {
          setStats(prev => ({ ...prev, dailyVisits: v.data().count || 0 }));
        }
      } catch (e) { console.error("Ziyaretçi stat çekme hatası:", e); }

      // Top Service Stat
      try {
        const ts = await getDoc(doc(db, "stats", "service_clicks"));
        if (ts.exists()) {
          const clicks = ts.data();
          const top = Object.entries(clicks).sort((a,b) => b[1] - a[1])[0];
          if (top) setStats(prev => ({ ...prev, topService: top[0] }));
        }
      } catch (e) { console.error("Stat çekme hatası:", e); }

      // AI Usage Stat
      try {
        const aiRef = await getDoc(doc(db, "stats", "ai_usage"));
        if (aiRef.exists()) {
          setStats(prev => ({ ...prev, aiUsage: aiRef.data().count || 0 }));
        }
      } catch (e) { console.error("AI Stat çekme hatası:", e); }

      console.log("Tüm veri çekme işlemleri denendi.");
    } catch (error) {
      console.error("Genel veri çekme hatası:", error);
      alert(`Firebase Hatası: ${error.code || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: newProduct.price,
        desc: newProduct.desc,
        image: newProduct.image || ""
      });
      setShowProductForm(false);
      setNewProduct({ name: "", price: "", desc: "", image: "" });
      await fetchData();
    } catch (error) {
      alert("Hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "services"), {
        title: newService.title,
        desc: newService.desc,
        image: newService.image || ""
      });
      setShowServiceForm(false);
      setNewService({ title: "", desc: "", image: "" });
      await fetchData();
    } catch (error) {
      alert("Hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveHero = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "hero"), heroData);
      alert("Ana sayfa güncellendi!");
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveContact = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "contact"), contactData);
      alert("İletişim bilgileri güncellendi!");
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "blog"), {
        title: newPost.title,
        category: newPost.category,
        summary: newPost.summary,
        content: newPost.content,
        image: newPost.image || "",
        date: new Date().toISOString()
      });
      setShowBlogForm(false);
      setNewPost({ title: "", category: "", summary: "", content: "", image: "" });
      await fetchData();
    } catch (error) {
      alert("Hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id, status) => {
    setLoading(true);
    try {
      await setDoc(doc(db, "reviews", id), { status }, { merge: true });
      await fetchData();
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (col, id) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, col, id));
        await fetchData();
      } catch (error) {
        alert("Hata: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const addBeforeAfter = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "beforeAfter"), newBeforeAfter);
      setNewBeforeAfter({ title: "", description: "", beforeImage: "", afterImage: "" });
      setShowBeforeAfterForm(false);
      await fetchData();
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBeforeAfter = async (id) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "beforeAfter", id));
        await fetchData();
      } catch (error) {
        alert("Hata: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const seedDatabase = async () => {
    if (!confirm("Siteniz için örnek veriler yüklenecek. Onaylıyor musunuz?")) return;
    setLoading(true);
    try {
      // 1. Hero Verisi
      await setDoc(doc(db, "settings", "hero"), {
        title: "Doğayla İç İçe Yaşam Alanları Tasarlıyoruz",
        subtitle: "Kayseri Peyzaj ile hayalinizdeki bahçeye kavuşun. Profesyonel ekibimizle modern, estetik ve sürdürülebilir peyzaj çözümleri sunuyoruz."
      });

      // 2. İletişim Verisi
      await setDoc(doc(db, "settings", "contact"), {
        address: "Kayseri",
        phone: "0555 123 45 67",
        email: "info@ildempeyzaj.com",
        whatsapp: "905551234567",
        instagram: "ildempeyzaj"
      });

      // 3. Örnek Hizmetler
      const sampleServices = [
        { title: "Bahçe Tasarımı", desc: "Hayalinizdeki bahçeyi 3D tasarım ve profesyonel uygulama ile gerçeğe dönüştürüyoruz.", image: "https://images.unsplash.com/photo-1558905734-b83d843a1570?q=80&w=800" },
        { title: "Rulo Çim Uygulaması", desc: "En kaliteli çim türleri ile bahçenizi tek günde yemyeşil bir görünüme kavuşturuyoruz.", image: "https://images.unsplash.com/photo-1592150621344-220b29ce9620?q=80&w=800" },
        { title: "Otomatik Sulama", desc: "Akıllı sulama sistemleri ile su tasarrufu sağlarken bitkilerinizin ömrünü uzatıyoruz.", image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=800" }
      ];
      for (const s of sampleServices) {
        await addDoc(collection(db, "services"), s);
      }

      // 4. Örnek Ürünler
      const sampleProducts = [
        { name: "Mavi Ladin", price: "2500", desc: "Bahçenize asalet katan, dört mevsim yeşil kalan özel bir ağaç.", image: "https://images.unsplash.com/photo-1583064313642-a7c149480c7e?q=80&w=800" },
        { name: "Süs Eriği", price: "1200", desc: "Bahar aylarında pembe çiçekleriyle bahçenizi süsleyen estetik ağaç.", image: "https://images.unsplash.com/photo-1521334884034-afc8e955d1d9?q=80&w=800" },
        { name: "Bahçe Aydınlatma", price: "450", desc: "Güneş enerjili, modern tasarımlı şık aydınlatma sistemi.", image: "https://images.unsplash.com/photo-1566417713940-05a041215973?q=80&w=800" }
      ];
      for (const p of sampleProducts) {
        await addDoc(collection(db, "products"), p);
      }

      alert("Örnek veriler başarıyla yüklendi! Sayfayı yenileyebilirsiniz.");
      await fetchData();
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id, status) => {
    setLoading(true);
    try {
      await setDoc(doc(db, "leads", id), { status }, { merge: true });
      await fetchData();
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📈' },
    { id: 'crm', label: '🤝 CRM / Talepler', icon: '💼' },
    { id: 'hizmetler', label: '🌿 Hizmetler', icon: '🛠️' },
    { id: 'urunler', label: '🌸 Ürünler', icon: '🛒' },
    { id: 'hero', label: '🏠 Ana Sayfa', icon: '🎯' },
    { id: 'blog', label: '📝 Blog', icon: '✍️' },
    { id: 'reviews', label: '⭐ Yorumlar', icon: '💬' },
    { id: 'before-after', label: '📸 Before/After', icon: '🔄' },
    { id: 'settings', label: '⚙️ Ayarlar', icon: '🛠️' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") { // Varsayılan şifre
      setIsAuthenticated(true);
    } else {
      alert("Hatalı şifre!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">🔐</div>
            <h2 className="text-3xl font-black text-gray-800">Yönetim Paneli</h2>
            <p className="text-gray-500 mt-2 font-medium">Lütfen devam etmek için şifrenizi girin.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white transition outline-none font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-900/20 transition-all active:scale-95"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return ( 
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-[110] bg-green-800 text-white p-3 rounded-xl shadow-lg"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-[100]"
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static z-[105] w-64 bg-green-950 text-white flex flex-col h-full shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 md:p-8 text-xl md:text-2xl font-black tracking-tighter border-b border-green-900/50 flex items-center gap-2 md:gap-3">
          <span className="bg-green-500/20 p-2 rounded-xl text-lg md:text-xl">🌳</span>
          KAYSERI<span className="text-green-500">ADMIN</span>
        </div>
        <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 mt-2 md:mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                ? "bg-green-800 text-white shadow-lg" 
                : "text-green-100/60 hover:bg-green-800/50 hover:text-white"
              }`}
            >
              <span className="text-lg md:text-xl">{item.icon}</span>
              <span className="text-sm md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-green-900/50">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/20 text-red-300 hover:bg-red-900/40 transition font-bold"
          >
            <span className="text-lg">🚪</span>
            <span className="text-sm">Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 lg:p-12">
        <header className="flex justify-between items-center mb-6 md:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 capitalize">{activeTab} Yönetimi</h1>
            <p className="text-gray-500 font-medium text-sm md:text-base">Sitenizin bu bölümünü buradan güncelleyebilirsiniz.</p>
          </div>
          {loading && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-bold text-sm">
              <span>İşlem yapılıyor...</span>
            </div>
          )}
        </header>

        {activeTab === "blog" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-gray-900">Blog Yönetimi</h2>
              <button 
                onClick={() => setShowBlogForm(!showBlogForm)}
                className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-lg"
              >
                {showBlogForm ? "Kapat" : "Yeni Yazı Ekle"}
              </button>
            </div>

            {showBlogForm && (
              <form onSubmit={handleAddPost} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    required
                    type="text"
                    placeholder="Yazı Başlığı"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none font-bold"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Kategori (Örn: Bakım, Tasarım)"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none font-bold"
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  />
                </div>
                <textarea
                  required
                  placeholder="Kısa Özet"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none font-bold h-24"
                  value={newPost.summary}
                  onChange={(e) => setNewPost({...newPost, summary: e.target.value})}
                />
                <textarea
                  required
                  placeholder="İçerik (Markdown destekli)"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 outline-none font-bold h-64"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
                <div className="relative">
                  <label className="block text-xs font-black text-gray-400 mb-2 ml-2 uppercase">Kapak Fotoğrafı URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full px-6 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-sm font-bold outline-none focus:border-green-500"
                    value={newPost.image}
                    onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-green-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-green-800 transition disabled:opacity-50">
                  {loading ? "Yükleniyor..." : "Yazıyı Yayınla"}
                </button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex gap-6">
                  {post.image && <img src={post.image} className="w-24 h-24 rounded-2xl object-cover shadow-md" alt="" />}
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{post.category}</span>
                    <h4 className="text-xl font-black text-gray-900 mb-2">{post.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 font-medium">{post.summary}</p>
                    <button onClick={() => deleteItem("blog", post.id)} className="text-red-500 font-bold text-sm hover:underline">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-900">Hayalinizdeki Bahçe Yönetimi</h2>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Ana Başlık</label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Alt Başlık</label>
                <textarea
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 font-bold"
                  rows={3}
                />
              </div>
              <button onClick={saveHero} className="w-full bg-green-800 text-white py-4 rounded-2xl font-black">
                Kaydet
              </button>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-900">Müşteri Yorumları</h2>
            <div className="grid gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-xl font-black text-gray-900">{review.name}</p>
                    <p className="text-gray-500">{review.comment}</p>
                  </div>
                  <button onClick={() => deleteReview(review.id)} className="text-red-500 font-black">SİL</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "before-after" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-gray-900">Bahçenin Öncesi & Sonrası Yönetimi</h2>
              <button onClick={() => setShowBeforeAfterForm(!showBeforeAfterForm)} className="bg-green-800 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-900/20">
                {showBeforeAfterForm ? "Vazgeç" : "+ Yeni Öğe"}
              </button>
            </div>

            {showBeforeAfterForm && (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <input
                  type="text"
                  placeholder="Başlık"
                  value={newBeforeAfter.title}
                  onChange={(e) => setNewBeforeAfter({...newBeforeAfter, title: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 font-bold"
                />
                <input
                  type="text"
                  placeholder="Açıklama"
                  value={newBeforeAfter.description}
                  onChange={(e) => setNewBeforeAfter({...newBeforeAfter, description: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 font-bold"
                />
                <input
                  type="text"
                  placeholder="Önceki Bahçe Fotoğrafı URL (https://...)"
                  value={newBeforeAfter.beforeImage}
                  onChange={(e) => setNewBeforeAfter({...newBeforeAfter, beforeImage: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 font-bold"
                />
                <input
                  type="text"
                  placeholder="Sonraki Bahçe Fotoğrafı URL (https://...)"
                  value={newBeforeAfter.afterImage}
                  onChange={(e) => setNewBeforeAfter({...newBeforeAfter, afterImage: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 font-bold"
                />
                <button onClick={addBeforeAfter} className="w-full bg-green-800 text-white py-4 rounded-2xl font-black">
                  Ekle
                </button>
              </div>
            )}

            <div className="grid gap-6">
              {beforeAfterItems.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 mb-4">{item.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase mb-2">Önceki</p>
                      <img src={item.beforeImage} alt="Önceki" className="w-full h-32 object-cover rounded-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase mb-2">Sonraki</p>
                      <img src={item.afterImage} alt="Sonraki" className="w-full h-32 object-cover rounded-xl" />
                    </div>
                  </div>
                  <button onClick={() => deleteBeforeAfter(item.id)} className="text-red-500 font-black">SİL</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "3d-garden" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-900">3D Bahçe Tasarım Önizleme</h2>
            <Garden3D />
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-6 md:space-y-10">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-2 md:mb-4 tracking-widest">Günlük Ziyaret</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">{stats.dailyVisits}</p>
                <p className="text-green-500 text-[10px] md:text-xs font-bold mt-1 md:mt-2">↑ %12 artış</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-2 md:mb-4 tracking-widest">Gelen Talepler</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">{leads.length}</p>
                <p className="text-blue-500 text-[10px] md:text-xs font-bold mt-1 md:mt-2">{leads.filter(l => l.status === 'Yeni').length} yeni bekliyor</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-2 md:mb-4 tracking-widest">Kazanılan İş</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">{stats.wonDeals}</p>
                <p className="text-green-600 text-[10px] md:text-xs font-bold mt-1 md:mt-2">Bu ay</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-2 md:mb-4 tracking-widest">AI Kullanımı</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">{stats.aiUsage}</p>
                <p className="text-purple-500 text-[10px] md:text-xs font-bold mt-1 md:mt-2">Otomatik cevap</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase mb-2 md:mb-4 tracking-widest">En Çok Tıklanan</p>
                <p className="text-sm md:text-base lg:text-xl font-black text-gray-900 dark:text-white truncate">{stats.topService}</p>
                <p className="text-orange-500 text-[10px] md:text-xs font-bold mt-1 md:mt-2">Popüler hizmet</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
                <h3 className="text-lg md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Son Müşteri Talepleri (CRM)</h3>
                <span className="bg-green-100 text-green-700 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-black">CANLI TAKİP</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest">Müşteri</th>
                      <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest">Detaylar</th>
                      <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest">Durum</th>
                      <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                        <td className="py-6">
                          <p className="font-black text-gray-900 dark:text-white">{lead.name}</p>
                          <p className="text-xs text-gray-400 font-bold">{lead.phone}</p>
                        </td>
                        <td className="py-6">
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{lead.m2} m² | {lead.location}</p>
                        </td>
                        <td className="py-6">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            lead.status === 'Yeni' ? 'bg-blue-100 text-blue-700' :
                            lead.status === 'Bekleyen' ? 'bg-orange-100 text-orange-700' :
                            lead.status === 'Kazanılan' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-6">
                          <div className="flex gap-2">
                            <select 
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className="bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-xs font-black px-4 py-2 focus:ring-2 ring-green-500 outline-none"
                              value={lead.status}
                            >
                              <option value="Yeni">Yeni</option>
                              <option value="Bekleyen">Bekleyen</option>
                              <option value="Kazanılan">Kazanılan</option>
                              <option value="Kaybedilen">Kaybedilen</option>
                            </select>
                            <button onClick={() => deleteItem('leads', lead.id)} className="text-red-400 hover:text-red-600 p-2">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "crm" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-900">Müşteri Talepleri (CRM)</h2>
              <div className="flex gap-4">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase">Yeni: {leads.filter(l => l.status === 'Yeni').length}</span>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase">Kazanılan: {leads.filter(l => l.status === 'Kazanılan').length}</span>
              </div>
            </div>

            <div className="grid gap-6">
              {leads.sort((a,b) => b.createdAt?.seconds - a.createdAt?.seconds).map(lead => (
                <div key={lead.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-gray-900">{lead.name}</h3>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          lead.status === 'Yeni' ? 'bg-blue-500 text-white' :
                          lead.status === 'Kazanılan' ? 'bg-green-500 text-white' :
                          lead.status === 'Kaybedilen' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-gray-500 font-bold">{lead.phone} • {lead.location || 'Konum Belirtilmedi'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateLeadStatus(lead.id, 'Kazanılan')} className="bg-green-100 text-green-700 p-3 rounded-2xl hover:bg-green-600 hover:text-white transition shadow-sm">✔️</button>
                      <button onClick={() => updateLeadStatus(lead.id, 'Kaybedilen')} className="bg-red-100 text-red-700 p-3 rounded-2xl hover:bg-red-600 hover:text-white transition shadow-sm">✖️</button>
                      <button onClick={() => deleteItem("leads", lead.id)} className="bg-gray-100 text-gray-500 p-3 rounded-2xl hover:bg-gray-200 transition">🗑️</button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-3xl">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Bahçe m²</p>
                      <p className="font-bold text-gray-800">{lead.m2 || '-'} m²</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Aciliyet</p>
                      <p className="font-bold text-red-600">{lead.urgency}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tarih</p>
                      <p className="font-bold text-gray-800">{lead.createdAt?.toDate().toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>

                  {lead.message && (
                    <div className="mt-6 p-6 bg-white border border-gray-100 rounded-3xl">
                      <p className="text-sm font-medium text-gray-600 italic">"{lead.message}"</p>
                    </div>
                  )}

                  {lead.photo && (
                    <div className="mt-6">
                      <a href={lead.photo} target="_blank" className="text-green-700 font-black text-xs hover:underline flex items-center gap-2">
                        🖼️ Yüklenen Fotoğrafı Gör
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "hizmetler" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-800">Hizmetlerimiz</h2>
              <button onClick={() => setShowServiceForm(!showServiceForm)} className="bg-green-800 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-900/20">
                {showServiceForm ? "Vazgeç" : "+ Yeni Hizmet"}
              </button>
            </div>

            {showServiceForm && (
              <form onSubmit={handleAddService} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                <input placeholder="Hizmet Başlığı" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" required />
                <textarea placeholder="Hizmet Açıklaması" value={newService.desc} onChange={e => setNewService({...newService, desc: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl outline-none h-32" required />
                <input type="text" placeholder="Hizmet Fotoğrafı URL (https://...)" value={newService.image} onChange={e => setNewService({...newService, image: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                <button type="submit" disabled={loading} className="w-full bg-green-800 text-white py-4 rounded-xl font-black">{loading ? "Yükleniyor..." : "Hizmeti Ekle"}</button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {services.map(s => (
                <div key={s.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group relative">
                  {s.image && <img src={s.image} alt={s.title} className="w-full h-48 object-cover" />}
                  <div className="p-6">
                    <h3 className="font-black text-gray-800 text-xl mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <button onClick={() => deleteItem("services", s.id)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition">Sil</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "urunler" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-800">Ürün Portföyü</h2>
              <button onClick={() => setShowProductForm(!showProductForm)} className="bg-green-800 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-900/20">
                {showProductForm ? "Vazgeç" : "+ Yeni Ürün"}
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                <input placeholder="Ürün Adı" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" required />
                <input placeholder="Fiyat (₺)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" required />
                <textarea placeholder="Ürün Açıklaması" value={newProduct.desc} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl outline-none h-32" />
                <input type="text" placeholder="Ürün Fotoğrafı URL (https://...)" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                <button type="submit" disabled={loading} className="w-full bg-green-800 text-white py-4 rounded-xl font-black">{loading ? "Yükleniyor..." : "Ürünü Ekle"}</button>
              </form>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden relative group">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-green-50 flex items-center justify-center text-4xl">🌿</div>
                  )}
                  <div className="p-4 text-center">
                    <p className="font-black text-gray-800">{p.name}</p>
                    <p className="text-green-600 font-black mt-1">{p.price}₺</p>
                  </div>
                  <button onClick={() => deleteItem("products", p.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "iletisim" && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-2xl font-black text-gray-800">İletişim Bilgileri</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.keys(contactData).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase ml-2">{key}</label>
                  <input value={contactData[key]} onChange={e => setContactData({...contactData, [key]: e.target.value})} className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold border border-transparent focus:border-green-500 transition" />
                </div>
              ))}
            </div>
            <button onClick={saveContact} className="w-full bg-green-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition">Bilgileri Güncelle</button>
          </div>
        )}
      </div>
    </div> 
  ); 
} 
