import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Caldos Constitución | Carta Digital",
  description: "Disfruta de una experiencia única con nuestros caldos tradicionales e ingredientes de primera calidad en Caldos Constitución.",
  keywords: ["caldos", "caldos constitucion", "restaurante", "menú digital", "comida tradicional", "sopa"],
  authors: [{ name: "Caldos Constitución" }],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
