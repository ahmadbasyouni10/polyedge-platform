import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PolyEdge | God-Tier Polymarket Alpha",
  description: "AI-Powered Edge Detection, Whale Tracking, and Automated Betting for Prediction Markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-black text-white antialiased`}>
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-black to-black -z-10" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
