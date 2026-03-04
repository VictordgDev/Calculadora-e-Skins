import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalcSkins — A calculadora que evolui com você",
  description:
    "Calculadora funcional com skins visuais, sistema de XP e ranking global.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
