"use client";
import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float, Html } from "@react-three/drei";

function Tree({ position, type, onClick }) {
  const icons = {
    tree: "🌲",
    flower: "🌸",
    rock: "🪨",
    bench: "🪑",
    fountain: "⛲",
  };

  return (
    <group position={position} onClick={onClick}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Html center transform distanceFactor={10}>
          <div className="text-6xl cursor-pointer select-none hover:scale-125 transition-transform drop-shadow-2xl">
            {icons[type] || "🌿"}
          </div>
        </Html>
      </Float>
    </group>
  );
}

export function Garden3D() {
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState('tree');

  const plantTypes = [
    { id: 'tree', icon: '🌲', name: 'Çam Ağacı' },
    { id: 'flower', icon: '🌸', name: 'Çiçek' },
    { id: 'rock', icon: '🪨', name: 'Kaya' },
    { id: 'bench', icon: '🪑', name: 'Bank' },
    { id: 'fountain', icon: '⛲', name: 'Fıskiye' },
  ];

  const handleCanvasClick = (e) => {
    // Only add if we clicked the ground (not an object)
    if (e.intersections.length > 0 && e.intersections[0].object.name === "ground") {
      const point = e.intersections[0].point;
      setItems([...items, { id: Date.now(), type: selectedType, position: [point.x, 0, point.z] }]);
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <section className="py-10 bg-white dark:bg-gray-950 transition-colors overflow-hidden rounded-[3rem] border border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Controls */}
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest text-center">Envanter</h3>
            <div className="grid grid-cols-2 gap-4">
              {plantTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                    selectedType === type.id 
                    ? "bg-green-600 border-green-400 text-white shadow-lg shadow-green-900/20 scale-105" 
                    : "bg-white dark:bg-gray-800 border-transparent text-gray-400 hover:border-green-500"
                  }`}
                >
                  <span className="text-4xl mb-2">{type.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{type.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-10 space-y-4">
              <button 
                onClick={() => setItems([])}
                className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
              >
                Tasarımı Sıfırla
              </button>
              <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                Zemine tıklayarak öğe yerleştir.<br/>Öğeye tıklayarak sil.
              </p>
            </div>
          </div>

          {/* 3D View */}
          <div className="lg:col-span-3 h-[600px] bg-gray-900 rounded-[3rem] overflow-hidden relative border-4 border-gray-100 dark:border-gray-800 shadow-2xl">
            <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }} onClick={handleCanvasClick}>
              <Suspense fallback={<Html center><div className="text-white font-black animate-pulse">3D MODÜL YÜKLENİYOR...</div></Html>}>
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                {/* Ground */}
                <mesh 
                  name="ground"
                  rotation={[-Math.PI / 2, 0, 0]} 
                  position={[0, -0.5, 0]} 
                  receiveShadow
                >
                  <planeGeometry args={[50, 50]} />
                  <meshStandardMaterial color="#2d4c1e" />
                </mesh>

                {/* Grid Helper */}
                <gridHelper args={[50, 50, "#4a7c30", "#3d6628"]} position={[0, -0.49, 0]} />

                {items.map(item => (
                  <Tree 
                    key={item.id} 
                    position={item.position} 
                    type={item.type} 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                  />
                ))}

                <ContactShadows position={[0, -0.49, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
                <Environment preset="park" />
              </Suspense>
            </Canvas>
            
            <div className="absolute bottom-8 left-8 bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 pointer-events-none">
              <p className="text-white font-black text-xs uppercase tracking-widest">3D ÖNİZLEME MODU</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
