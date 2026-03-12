import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoachIQ — Call Center Coaching Dashboard",
  description: "Performance analysis and coaching management for call center team managers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen`}>
        {/* Top navigation bar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <a href="/" className="font-bold text-blue-700 text-lg tracking-tight">
              CoachIQ
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Call Center Coaching Dashboard</span>
          </div>
        </nav>

        {/* Page content */}
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
