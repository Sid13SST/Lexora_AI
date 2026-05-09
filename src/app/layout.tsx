import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lexora AI | Intelligent Knowledge Base",
  description: "Turn any document into an intelligent knowledge base with Lexora AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-[#050505] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
