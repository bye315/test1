import { Navbar } from "../components/Navbar";
import { FloatingButtons } from "../components/FloatingButtons";
import { PhotoBackground } from "../components/PhotoBackground";
import "./globals.css";

export const metadata = {
  title: 'Kayseri Peyzaj | Modern Bahçe Tasarımı & Uygulama',
  description: 'Kayseri ve çevresinde profesyonel peyzaj tasarımı, rulo çim, otomatik sulama ve bahçe bakım hizmetleri sunan öncü kuruluş.',
  keywords: "peyzaj, bahçe tasarımı, bitki bakımı, rulo çim, kayseri peyzaj, peyzaj mimarlığı",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased relative min-h-screen">
        <PhotoBackground />
        <div className="relative z-30">
          <Navbar />
          {children}
          <FloatingButtons />
        </div>
      </body>
    </html>
  );
}
