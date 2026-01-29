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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#10b981',
          colorBackground: '#000000',
          colorInputBackground: 'rgba(255, 255, 255, 0.03)',
          colorInputText: '#ffffff',
          borderRadius: '1rem',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        elements: {
          card: 'bg-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]',
          headerTitle: 'text-white font-black uppercase tracking-tight',
          headerSubtitle: 'text-white/60 font-bold',
          socialButtonsBlockButton: 'bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-black transition-all font-bold',
          formButtonPrimary: 'bg-emerald-500 hover:bg-white text-black font-black uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)]',
          footerActionLink: 'text-emerald-500 hover:text-white font-bold',
          identityPreviewText: 'text-white font-bold',
          identityPreviewEditButton: 'text-emerald-500 hover:text-white',
        }
      }}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-black text-white antialiased`}>
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-black to-black -z-10" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
