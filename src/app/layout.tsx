import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CORPUS | Case Competition Excellence Platform",
  description: "Master Case Competitions Like a Consultant. Discover opportunities, learn structured winning frameworks, connect with mentors, and crack national case challenges. Designed for IIM Kashipur students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col text-zinc-100 selection:bg-indigo-500/35 selection:text-white"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-white/5 bg-zinc-950 py-8 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start text-left">
              <span className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                CORPUS
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                The Ultimate Hub for Case Competition Success
              </p>
            </div>
            <div className="flex gap-6 text-xs text-zinc-500">
              <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
              <span className="hover:text-zinc-300 cursor-pointer">Contact Support</span>
            </div>
            <div className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} CORPUS. Created for IIM Kashipur students.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
