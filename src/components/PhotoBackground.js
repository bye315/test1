"use client";

export function PhotoBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <img 
        src="/vid-foto/background.png" 
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 1 }}
      />
    </div>
  );
}
