// Basit testler (node ortamında çalıştırılabilir) 
 
function testTeklif() { 
  const m2 = 10; 
  const fiyat = m2 * 200; 
  if (fiyat === 2000) {
    console.log("✅ Teklif hesaplama testi başarılı");
  } else {
    console.error("❌ Teklif hesaplama testi hatalı");
  }
} 
 
testTeklif(); 
