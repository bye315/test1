import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;
    const systemPrompt = "Sen Yeşilİz Peyzaj firmasının uzman asistanısın. Bahçe tasarımı, bitki bakımı ve peyzaj maliyetleri konusunda profesyonel, yardımsever ve nazik bir dille bilgi veriyorsun. Cevapların kısa, öz ve bilgilendirici olsun.";

    // 1. ALTERNATİF: GROQ AI (Çok daha hızlı ve sorunsuz)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: lastMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        const groqData = await groqResponse.json();
        if (groqData.choices?.[0]?.message?.content) {
          return new Response(JSON.stringify({ message: groqData.choices[0].message.content }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (err) {
        console.error("Groq Hatası:", err);
      }
    }

    // 2. ALTERNATİF: GEMINI AI (Fallback)
    const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyDRVvBAaQ5oGhJaAsJ_l6wGZ7P3lzog1a0";
    const models = [
      { version: "v1beta", name: "gemini-1.5-flash" },
      { version: "v1", name: "gemini-1.5-flash" },
      { version: "v1beta", name: "gemini-1.5-pro" },
      { version: "v1", name: "gemini-pro" }
    ];

    let lastError = null;
    
    for (const model of models) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${geminiApiKey}`;
        
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nKullanıcı: ${lastMessage}` }] }]
          })
        });

        const data = await response.json();

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return new Response(JSON.stringify({ message: data.candidates[0].content.parts[0].text }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        if (data.error) {
          console.log(`Model ${model.name} (${model.version}) failed:`, data.error.message);
          lastError = data.error.message;
          continue;
        }
      } catch (err) {
        console.log(`Fetch error for ${model.name}:`, err.message);
        lastError = err.message;
        continue;
      }
    }

    throw new Error(lastError || "Tüm modeller denendi ancak yanıt alınamadı.");

  } catch (error) {
    console.error("Chat Route Error:", error);
    return new Response(JSON.stringify({ 
      error: "Bir hata oluştu", 
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
