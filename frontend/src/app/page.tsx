"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, TrendingUp, ShieldCheck, Lock,
  Check, X, Plus, Minus, Monitor, Sun, Moon, Twitter, Send,
  Brain, Target, Globe, Server, ChevronRight, BarChart3, AlertCircle, TrendingDown, Layers, Terminal, Bell, Cpu, Sparkles, Coins, Trophy, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignInButton, useUser, SignUpButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// Custom Geometric Logo (PolyEdge "Blade")
const PolyEdgeLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M4 4L20 12L4 20V4Z" className="fill-emerald-500" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M8 9L15 12L8 15V9Z" fill="black" />
  </svg>
);

// Rotating Hero Text Component (Manifold-style)
const RotatingText = () => {
  const phrases = [
    { line1: "DETECT", highlight: "EDGE", line2: "BEFORE THE", highlight2: "CROWD" },
    { line1: "FIND YOUR", highlight: "ALPHA", line2: "BEFORE THE", highlight2: "MARKET" },
    { line1: "TRACK", highlight: "WHALES", line2: "BEAT THE", highlight2: "HERD" },
    { line1: "AUTOMATE", highlight: "WINS", line2: "MAXIMIZE", highlight2: "PROFIT" }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = phrases[index];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {current.line1} <span className="text-emerald-500">{current.highlight}</span><br />
        {current.line2} <span className="bg-emerald-500 text-black px-2 py-1 inline-block">{current.highlight2}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [tradersOnline, setTradersOnline] = useState(48);
  const [waitlistCount, setWaitlistCount] = useState(11);
  const [step, setStep] = useState<"landing" | "quiz" | "benefits" | "auth">("landing");
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number, text: string, type: string }[]>([]);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic traders & waitlist effect
  useEffect(() => {
    const startTimestamp = new Date("2026-01-28T21:00:00Z").getTime();
    const waitlistIntervalMs = 6 * 60 * 60 * 1000;

    const updateCounts = () => {
      const currentWaitlist = (11 + Math.floor((Date.now() - startTimestamp) / waitlistIntervalMs)) % 101;
      setWaitlistCount(currentWaitlist);

      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      let base = currentWaitlist * 0.7;
      let multiplier = 1.0;
      if (hour >= 0 && hour < 7) multiplier *= 0.4;
      if (day === 0 || day === 6) multiplier *= 0.8;
      const blockMultipliers = [1.2, 0.85, 1.1, 1.3, 0.9, 1.05];
      multiplier *= blockMultipliers[Math.floor(hour / 4) % 6];
      const micro = 0.85 + (Math.random() * 0.3);
      setTradersOnline(Math.max(Math.floor(base * multiplier * micro), 3));
    };

    updateCounts();
    const interval = setInterval(updateCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Notifications Effect
  useEffect(() => {
    const notificationsPool = [
      { text: "Edge Detected: 12.4% on 'Super Bowl Winner'", type: "edge" },
      { text: "Signal: GDELT Flash (Politics) — Identifying Conviction", type: "trade" },
      { text: "PnL Update: +$242.00 (Auto-Bet Execution)", type: "profit" },
      { text: "Whale Alert: $45k buy on 'Fed 50bps' @ 0.44", type: "alert" },
      { text: "Auto-Bet Successful: Order Confirmed", type: "bet" },
      { text: "Edge Detected: 8.7% on 'BTC $100k'", type: "edge" },
      { text: "Live Context: Reuters Flash on 'Middle East'", type: "alert" }
    ];

    const showNotification = () => {
      const randomNotif = notificationsPool[Math.floor(Math.random() * notificationsPool.length)];
      const id = Date.now();
      setNotifications(prev => [...prev, { ...randomNotif, id }]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    const interval = setInterval(showNotification, 5000);
    return () => clearInterval(interval);
  }, []);

  const { user, isLoaded } = useUser();
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setAnalyzing(true);
    setStep("quiz"); // Move to quiz immediately for better UX

    // Auto-scroll to quiz
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);

    try {
      const response = await fetch("http://localhost:8000/analyze-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.id ? { "x-user-id": user.id } : {})
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error("Backend unavailable. Please ensure the server is running.");
      }

      const data = await response.json();
      setAnalysisResult(data);

      // Analysis complete - quiz is already showing
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalyzing(false);
      setStep("landing"); // Return to landing on error
      alert("⚠️ Backend connection failed. Make sure the server is running at localhost:8000");
    } finally {
      setAnalyzing(false);
    }
  };

  const logos = ["Google", "AWS", "Meta", "Bloomberg", "Jane Street"];

  const features = [
    { title: "NEWS SCANNER", desc: "We scan X and GDELT 24/7. Get news alerts that actually move the needle before they hit the general terminal.", icon: <Globe size={20} />, status: "LIVE" },
    { title: "AUTONOMOUS EXECUTION", desc: "Link your wallet and set rules. We execute bets on the CLOB at sub-140ms speeds while you sleep.", icon: <Server size={20} />, status: "BETA" },
    { title: "INSIDER TRACKING", desc: "We track whale movements across Polymarket to distinguish between real conviction and noise.", icon: <Target size={20} />, status: "LIVE" },
  ];

  const futureRoadmap = [
    { name: "KALSHI ALPHA", status: "BETA", icon: <TrendingUp size={16} />, color: "text-blue-400" },
    { name: "MEME COIN AGENT", status: "SOON", icon: <Coins size={16} />, color: "text-purple-400" },
    { name: "SPORTS EDGE", status: "SOON", icon: <Trophy size={16} />, color: "text-emerald-400" },
  ];

  const comparison = [
    { feature: "AI ANALYSIS", polyedge: "Fine-Tuned Llama 3.1", tremor: "None (Alerts only)", alphascope: "Generic GPT-4" },
    { feature: "NEWS SPEED", polyedge: "Sub-140ms Fusion", tremor: "N/A", alphascope: "3-5s Lag" },
    { feature: "EXECUTION", polyedge: "Auto-Betting (API)", tremor: "Manual", alphascope: "Manual" },
    { feature: "CONTEXT", polyedge: "News + Social Fusion", tremor: "Price Only", alphascope: "Generic News" },
  ];

  const faqs = [
    { q: "Is this just another AI wrapper?", a: "No. Most tools use generic GPT-4 which is slow and expensive. We spent months fine-tuning our own model on thousands of real market scenarios to detect mispricings instantly." },
    { q: "How does the waitlist work?", a: "Our compute costs are significant. We limit access to 100 quants per cluster to ensure everyone gets sub-140ms execution. Once 100/100 is filled, we pause new signups." },
    { q: "Can I use this for sports or memes?", a: "We currently support Polymarket. Kalshi, Sports, and Meme Coin agents are in private testing and will be live soon." },
    { q: "Is this financial advice?", a: "No. We provide the data and the detection, you decide whether to pull the trigger. Always trade responsibly." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-500 font-sans overflow-x-hidden">
      {/* Notifications Portal */}
      <div className="fixed bottom-8 left-8 z-[1000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="px-6 py-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]"
            >
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                <Bell size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">SIGNAL</p>
                <p className="text-[13px] font-bold text-white/90">{n.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[#000] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.05] sticky top-0 bg-black/95 backdrop-blur-2xl z-[100]">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep("landing")}>
          <PolyEdgeLogo className="group-hover:scale-110 transition-transform" />
          <span className="text-xl font-black tracking-tightest uppercase">PolyEdge</span>
        </div>

        <div className="hidden lg:flex items-center gap-12 text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
          <a href="#features" className="hover:text-emerald-500 transition-colors">TERMINAL</a>
          <a href="#comparison" className="hover:text-emerald-500 transition-colors">THE EDGE</a>
          <a href="#pricing" className="hover:text-emerald-500 transition-colors">PRICING</a>
          <a href="#faq" className="hover:text-emerald-500 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">{tradersOnline} ONLINE</span>
          </div>
          <SignInButton mode="modal" appearance={{ baseTheme: dark }}>
            <button className="px-6 py-2.5 text-[11px] font-black tracking-[0.2em] bg-white text-black rounded hover:bg-emerald-500 transition-all uppercase cursor-pointer">
              ENTER
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Top Banner Ticker - Full Width & High Visibility */}
      <div className="w-full py-4 bg-emerald-500/5 border-b border-white/[0.05] overflow-hidden relative z-50">
        <div className="flex gap-24 animate-infinite-scroll whitespace-nowrap">
          {[
            "WHALE_BID: $140K ON 'SUPER BOWL' @ 0.44",
            "SIGNAL: GDELT FLASH ON 'FED MEETING' 4S AGO",
            "EDGE_DETECTED: +12.4% ON 'POLITICS'",
            "BOT_STATUS: SUB-140MS COLD BOOT SUCCESS",
            "SENTIMENT_FLIP: INSIDERS ACCUMULATING",
            "NEWS_FUSION: BLOOMBERG ON 'ELECTION 2024'",
            "PnL_UPDATE: CLUSTER S1 REPORTING +8.2% WEEKLY",
            "SIGNAL: Reuters mentions 'Interest Rates' — Analysis in progress"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-[11px] font-black text-white/60 tracking-widest uppercase">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section - Reduced padding to bring content higher */}
      <section className="relative pt-16 pb-24 px-4 z-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-center"
            >
              {/* FOMO Elements */}
              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">847 Active Users</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full">
                  <Zap size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">6 Edges Detected (Last Hour)</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-[1.1] uppercase mb-8 text-white">
                <span className="block italic" style={{ fontSize: '0.2em', letterSpacing: '0.3em', marginBottom: '12px', color: '#10b981' }}>GOD-TIER ALPHA</span>
                <RotatingText />
              </h1>

              {/* Profit Feed Ticker (Floating) */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden xl:block w-72 space-y-4 pointer-events-none text-left">
                <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase mb-6 pl-4">RECENT WINS (24H)</p>
                {[
                  { user: "@trader_8x2", profit: "+$420", market: "Fed Meeting" },
                  { user: "@anon_quant", profit: "+$1,240", market: "Nvidia Earnings" },
                  { user: "@edge_hunter", profit: "+$680", market: "BTC $100k" }
                ].map((hit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.2 }}
                    className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl"
                  >
                    <p className="text-emerald-500 font-black text-xs mb-1">{hit.profit}</p>
                    <p className="text-white/40 font-bold text-[10px] uppercase truncate">{hit.user} hit {hit.market}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto mb-16 font-bold tracking-tight leading-normal">
                Stop guessing. Start winning. PolyEdge identifies mispriced markets across Polymarket before the crowd even hears the news.
              </p>

              <div className="flex justify-center mb-16">
                <div className="inline-flex items-center gap-5 px-8 py-3 bg-white/[0.02] border border-white/10 rounded-2xl shadow-3xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <span className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase">PRIVATE CLUSTER S1</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="text-[11px] font-black text-emerald-500 tracking-[0.2em] uppercase">{waitlistCount}/100 SLOTS FILLED</span>
                </div>
              </div>

              <form onSubmit={handleAnalyze} className="relative max-w-3xl mx-auto group mb-24">
                <div className="absolute -inset-1 bg-emerald-500/10 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-[28px] p-3 focus-within:border-emerald-500 transition-all shadow-4xl backdrop-blur-xl">
                  <div className="pl-6 text-white/30">
                    <Search size={24} />
                  </div>
                  <input
                    type="text"
                    placeholder="https://polymarket.com/event/will-the-fed-lower-rates..."
                    className="flex-grow bg-transparent border-none py-6 px-6 outline-none text-xl text-white font-bold placeholder:text-white/10"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={analyzing}
                    className="px-12 py-6 bg-emerald-500 text-black font-black text-[14px] uppercase tracking-widest rounded-2xl hover:bg-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xl ml-6"
                  >
                    {analyzing ? "DECODING..." : "DETECT EDGE"}
                  </button>
                </div>
              </form>

              <div className="mt-24">
                <p className="text-[11px] font-black tracking-[0.5em] text-white/40 uppercase mb-12">Engineered by SWEs from</p>
                <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-60 transition-all duration-700">
                  {logos.map((logo, i) => (
                    <span key={i} className="text-xl md:text-2xl font-black tracking-tighter text-white select-none transition-all hover:text-emerald-500 hover:scale-110">{logo}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl mx-auto bg-white/[0.02] border border-white/10 p-16 rounded-[40px] text-left shadow-4xl backdrop-blur-2xl"
            >
              {/* Animated Progress Bar */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase">Analysis Progress</p>
                  <p className="text-[9px] font-black tracking-[0.3em] text-emerald-500 uppercase">{analyzing ? "SCANNING..." : "COMPLETE"}</p>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{ width: analyzing ? "75%" : "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <p className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase mb-4">AGENTIC ANALYSIS IN PROGRESS</p>
              <h2 className="text-2xl font-black uppercase mb-8 line-clamp-2">{analysisResult?.question || "Onboarding"}</h2>

              {/* Reasoning Feed Simulation */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-10 font-mono text-[11px] space-y-2">
                <div className="flex gap-3 text-emerald-500/60">
                  <span className="shrink-0">[SENTINEL]</span>
                  <span className="text-white/40">Fetching GDELT & X fusion for "{analysisResult?.question?.slice(0, 30)}..."</span>
                </div>
                <div className="flex gap-3 text-emerald-500">
                  <span className="shrink-0">[SENTINEL]</span>
                  <span>{analysisResult?.edge_detected ? "Significant edge detected. Isolating alpha." : "Scanning for conviction signals..."}</span>
                </div>
                <div className="flex gap-3 text-white/20">
                  <span className="shrink-0">[HARVESTER]</span>
                  <span>Monitoring whale intent on CLOB...</span>
                </div>
              </div>

              <p className="text-white/60 font-bold mb-12 leading-relaxed text-[15px]">PolyEdge is analyzing this market. What's your primary goal with PolyEdge?</p>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "edges", label: "FIND MISPRICED MARKETS", desc: "Detect edges before the crowd" },
                  { id: "whales", label: "TRACK WHALE ACTIVITY", desc: "Monitor smart money on the CLOB" },
                  { id: "automate", label: "AUTOMATE MY BETTING", desc: "Execute trades with AI signals" },
                  { id: "all", label: "ALL OF THE ABOVE", desc: "Full God-Tier access" }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setStep("benefits")}
                    className="group flex items-start justify-between p-7 border border-white/10 rounded-2xl bg-white/[0.03] hover:bg-emerald-500 hover:border-emerald-500 hover:text-black transition-all text-left"
                  >
                    <div>
                      <p className="font-black text-xs uppercase tracking-[0.3em] mb-1">{opt.label}</p>
                      <p className="text-[11px] font-bold opacity-60">{opt.desc}</p>
                    </div>
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-1" size={20} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "benefits" && (
            <motion.div
              key="benefits"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center bg-white/[0.02] border border-white/10 p-16 rounded-[40px] shadow-4xl backdrop-blur-2xl"
            >
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mx-auto mb-10 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
              <h2 className="text-4xl font-black uppercase mb-8">
                {analysisResult?.is_teaser ? "Edge Detected" : "Analysis Complete"}
              </h2>

              {analysisResult?.is_teaser && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-12 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal size={18} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Alpha Leak</span>
                  </div>
                  <p className="text-white/80 font-bold text-sm leading-relaxed italic">
                    "{analysisResult?.reasoning}"
                  </p>
                </div>
              )}

              <p className="text-white/50 font-bold mb-16 text-lg tracking-tight">Review your Pro Account benefits before activating your Pro Account.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mb-16">
                {[
                  { icon: <Zap size={18} />, label: "UNLIMITED SCANS" },
                  { icon: <Globe size={18} />, label: "GDELT T1 FUSION" },
                  { icon: <Target size={18} />, label: "WHALE TAPE ACCESS" },
                  { icon: <Server size={18} />, label: "CLOB EXECUTION API" }
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-4 p-6 bg-white/[0.04] border border-white/10 rounded-2xl">
                    <div className="text-emerald-500">{b.icon}</div>
                    <span className="text-[11px] font-black uppercase tracking-widest">{b.label}</span>
                  </div>
                ))}
              </div>

              <SignInButton mode="modal" appearance={{ baseTheme: dark }}>
                <button className="w-full py-7 bg-emerald-500 text-black font-black uppercase tracking-[0.4em] text-sm rounded-2xl hover:bg-white transition-all shadow-4xl cursor-pointer">
                  ACTIVATE POLYMARKET ACCOUNT
                </button>
              </SignInButton>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.05] relative w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-black uppercase mb-16 text-center">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-[30px] bg-white/[0.02] border border-white/10 group hover:border-emerald-500/40 transition-all shadow-2xl">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-8 text-emerald-500 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-black uppercase mb-4">{f.title}</h3>
              <p className="text-white/50 font-bold leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Roadmap Module - Re-introduced */}
        <div className="mt-20 p-10 rounded-[40px] border border-dashed border-white/20 bg-white/[0.01]">
          <p className="text-center text-[10px] font-black text-white/20 tracking-[0.6em] uppercase mb-12">MISSION ROADMAP</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {futureRoadmap.map(r => (
              <div key={r.name} className="flex flex-col items-center gap-4 text-center">
                <div className={cn("p-4 rounded-full bg-white/5", r.color)}>{r.icon}</div>
                <div>
                  <p className="text-[12px] font-black uppercase tracking-widest">{r.name}</p>
                  <p className="text-[9px] font-bold text-white/20 tracking-[0.4em] uppercase mt-1">{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - Scaled down */}
      <section id="comparison" className="py-24 px-6 border-y border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase mb-4">Built Different</h2>
            <div className="w-20 h-1 bg-emerald-500/50 mx-auto rounded-full" />
          </div>

          <div className="w-full overflow-hidden rounded-[30px] border border-white/10 bg-black shadow-4xl relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">FEATURE</th>
                  <th className="p-8 text-emerald-500 text-xl font-black uppercase tracking-tighter text-center">POLYEDGE</th>
                  <th className="p-8 text-white/40 text-sm font-black uppercase tracking-tighter text-center">TREMOR.LIVE</th>
                  <th className="p-8 text-white/40 text-sm font-black uppercase tracking-tighter text-center">ALPHASCOPE</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-all group font-bold">
                    <td className="p-8 text-[12px] font-black text-white/60 uppercase tracking-widest">{row.feature}</td>
                    <td className="p-8 text-center bg-white/[0.02]">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-black text-white">{row.polyedge}</span>
                        <Check size={16} className="text-emerald-500" />
                      </div>
                    </td>
                    <td className="p-8 text-center opacity-50">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-black text-white/60">{row.tremor}</span>
                        <X size={16} className="text-red-500/50" />
                      </div>
                    </td>
                    <td className="p-8 text-center opacity-50">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-black text-white/60">{row.alphascope}</span>
                        <X size={16} className="text-red-500/50" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section - Scaled down */}
      <section id="pricing" className="py-24 px-6 bg-emerald-500/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase">Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly */}
            <div className="p-10 rounded-[40px] border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-all group relative">
              <h3 className="text-xl font-black mb-6 uppercase group-hover:text-emerald-500 transition-colors">PRO MONTHLY</h3>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black">$29</span>
                <span className="text-white/20 font-black text-[10px] tracking-widest">/ MONTH</span>
              </div>
              <ul className="space-y-6 mb-12 opacity-50 text-[11px] font-black tracking-widest uppercase">
                <li className="flex items-center gap-4"><Check size={14} className="text-emerald-500" /> UNLIMITED SCANS</li>
                <li className="flex items-center gap-4"><Check size={14} className="text-emerald-500" /> GDELT NEWS FUSION</li>
                <li className="flex items-center gap-4 italic text-white/80"><Check size={14} className="text-emerald-500" /> AUTOMATED BETTING (W/ LIMITS)</li>
              </ul>
              <button onClick={() => setStep("quiz")} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-emerald-500 transition-all cursor-pointer">
                JOIN WAITLIST
              </button>
            </div>

            {/* Annual */}
            <div className="p-10 rounded-[40px] border border-emerald-500/30 bg-emerald-500/[0.02] relative overflow-hidden group shadow-xl">
              <div className="absolute top-6 left-[-35px] rotate-[-45deg] bg-emerald-500 text-black text-[9px] font-black px-10 py-1 uppercase tracking-widest shadow-2xl">BEST DEAL</div>
              <h3 className="text-xl font-black mb-6 text-emerald-500 uppercase">PRO ANNUAL</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-white">$19</span>
                <span className="text-white/20 font-black text-[10px] tracking-widest">/ MONTH</span>
              </div>
              <p className="text-[11px] font-black text-emerald-500 mb-8 tracking-[0.2em] italic uppercase whitespace-nowrap">BILLED AS $228 / YEAR</p>

              <ul className="space-y-6 mb-12 text-[11px] font-black tracking-widest uppercase">
                <li className="flex items-center gap-4"><Check size={14} className="text-emerald-500" /> UNLIMITED SCANS</li>
                <li className="flex items-center gap-4 italic text-white/80"><Check size={14} className="text-emerald-500" /> AUTOMATED BETTING (W/ LIMITS)</li>
                <li className="flex items-center gap-4"><Check size={14} className="text-emerald-500" /> WHALE INTENT TAPE</li>
              </ul>
              <button onClick={() => setStep("quiz")} className="w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-white transition-all cursor-pointer shadow-lg">
                SECURE SLOT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black uppercase mb-16 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-black overflow-hidden hover:border-emerald-500/20 transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left p-8 flex justify-between items-center cursor-pointer"
                >
                  <span className="text-lg font-black uppercase tracking-tight">{faq.q}</span>
                  <Plus className={cn("text-emerald-500 transition-transform", activeFaq === i && "rotate-45")} size={20} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="p-8 pt-0 text-white/40 font-bold leading-relaxed text-sm italic uppercase tracking-widest">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Minimalist & Private Project Tone */}
      <footer className="px-8 py-12 border-t border-white/10 bg-black w-full">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <PolyEdgeLogo size={20} />
            <span className="text-xl font-black uppercase tracking-tightest">PolyEdge</span>
          </div>

          <div className="flex gap-10 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-emerald-500 transition-colors">X / TWITTER</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">DISCORD</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">STATUS: ONLINE</a>
          </div>

          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            © 2026 POLYEDGE. PERSONAL PROJECT.
          </div>
        </div>
      </footer>
    </div>
  );
}
