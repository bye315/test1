"use client";
import React, { useState, useRef, useEffect } from "react";

export function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Merhaba! Ben Yeşilİz Peyzaj yapay zeka asistanıyım. Size bahçe tasarımı, bitki bakımı veya maliyetler konusunda nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error(data.details || "Hata oluştu");
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Hata: ${error.message}. Lütfen terminaldeki logları kontrol edin.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-32 right-8 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col z-[60] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
      {/* Header */}
      <div className="bg-green-800 p-6 flex justify-between items-center text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-xl">🤖</div>
          <div>
            <h3 className="font-black text-sm">Yeşilİz AI Asistan</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-200 uppercase tracking-widest">Çevrimiçi</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-green-700 p-2 rounded-xl transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
              msg.role === "user" 
              ? "bg-green-600 text-white rounded-tr-none" 
              : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex space-x-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 p-4 pr-16 rounded-2xl outline-none transition font-medium text-gray-800"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
