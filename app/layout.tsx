import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Robinson Family Tree",
  description: "A modern, interactive family heritage platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        
        {/* Tailwind CSS via CDN */}
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  primary: { DEFAULT: "#80ec13", dark: "#6bc50e", light: "#a3f055" },
                  background: { light: "#FAFAF5", dark: "#192210" },
                  card: { light: "rgba(255, 255, 255, 0.7)", dark: "rgba(30, 30, 30, 0.6)" }
                },
                fontFamily: { display: ["Inter", "sans-serif"] },
                backgroundImage: {
                  'grid-pattern': "radial-gradient(#d4d4d8 1px, transparent 1px)",
                  'grid-pattern-dark': "radial-gradient(#3f3f46 1px, transparent 1px)",
                }
              }
            }
          }
        `}} />
        
        {/* Custom Global Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          body { font-family: 'Inter', sans-serif; }
          .bg-grid { background-size: 24px 24px; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #ffffff; border: 4px solid #80ec13; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: -8px; }
          input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: transparent; border-radius: 9999px; }
        `}} />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-screen overflow-hidden selection:bg-primary selection:text-black">
        {children}
      </body>
    </html>
  );
}