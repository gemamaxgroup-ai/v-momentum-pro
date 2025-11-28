import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "V-Momentum-Pro - Intelligent Platform for Your Websites",
  description: "V-Momentum-Pro unifies traffic insights, content performance, monetization data, and system health into a single, powerful dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans min-h-screen`}
      >
        <div className="min-h-screen bg-gradient-to-br from-[#0A0F2A] via-[#050B19] to-[#000000] text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
