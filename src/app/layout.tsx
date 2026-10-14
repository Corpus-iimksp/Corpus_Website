import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

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
        className="min-h-screen flex flex-col text-zinc-100 selection:bg-indigo-500/35 selection:text-white"
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
                IIM Kashipur Case Competition Cell
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 mt-4">
                <span>Roushan</span>
                <span>Ashutosh</span>
                <span>Shashwat</span>
                <span>Yash</span>
                <span>Kartik</span>
                <span>Vihana</span>
                <span>Sandhiya</span>
                <span>Anish</span>
              </div>
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
