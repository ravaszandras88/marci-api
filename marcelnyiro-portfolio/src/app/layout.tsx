import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/blocks/footer-section";
import { Header1 } from "@/components/ui/header";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marcel Nyirő - AI Entrepreneur & Business Strategist",
  description: "Founder of Outfino (AI fashion platform), backed by OUVC with 73M HUF investment. Expert in AI applications, business strategy, and startup scaling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ToastProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-black">
              <Header1 />
              <main className="flex-1 pt-20">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
