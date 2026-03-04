import type { Metadata } from "next";
import { Space_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CalcSkins — A Calculadora com Personalidade",
  description:
    "A única calculadora que evolui com você. Compre acesso, ganhe XP, suba de nível e colecione skins exclusivas.",
  keywords: ["calculadora", "skins", "gamificação", "xp", "levels"],
  openGraph: {
    title: "CalcSkins",
    description: "A calculadora que te recompensa por calcular.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
