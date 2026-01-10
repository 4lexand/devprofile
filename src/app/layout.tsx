import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Usamos una fuente más "coder"
import "./globals.css";

// Cargamos la fuente monoespaciada (tipo código) para toda la app
const mono = JetBrains_Mono({ subsets: ["latin"] });

// --- AQUÍ ES DONDE SE PERSONALIZA LA PESTAÑA DEL NAVEGADOR ---
export const metadata: Metadata = {
  // 1. El Título que sale arriba en la pestaña
  title: "Alexx_17 Web3 Dev",
  
  // 2. La descripción (lo que sale en Google o al compartir el link)
  description: "Portfolio of Alexx_17. Focused on Solana, Rust, and secure decentralized architecture.",
  
  // 3. El Icono (Favicon). Usamos tu mismo NFT
  icons: {
    icon: '/mi-nft.png', // Asegúrate de que la imagen siga en la carpeta public
    shortcut: '/mi-nft.png',
    apple: '/mi-nft.png', // Para cuando lo guardan en iPhone
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.className} bg-[#020617]`}>{children}</body>
    </html>
  );
}