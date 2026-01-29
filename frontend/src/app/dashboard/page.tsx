"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    ShieldCheck,
    Zap,
    MessageSquare,
    Newspaper,
    BarChart3,
    ArrowUpRight,
    UserCheck,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);

    // Mock data for the "Whale Tape" and "Alpha Signals"
    const whaleTrades = [
        { id: 1, type: "BUY YES", amount: "$52,400", user: "0x7a...4e", time: "2m ago" },
        { id: 2, type: "SELL NO", amount: "$12,000", user: "0xbc...1a", time: "5m ago" },
        { id: 3, type: "BUY NO", amount: "$8,500", user: "0xff...dd", time: "8m ago" },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6 lg:p-12">
            {/* Top Nav / Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">PRO TERMINAL_</h1>
                    <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Live Alpha Stream · WebSocket Connected</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-emerald-500/20">
                        <Zap className="text-emerald-500" size={18} />
                        <div>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Global Edge</p>
                            <p className="text-emerald-500 font-black">+14.2%</p>
                        </div>
                    </div>
                    <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-white/10">
                        <Users className="text-blue-400" size={18} />
                        <div>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Whales Active</p>
                            <p className="font-black text-white">412</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Analysis Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Signal Card */}
                    <section className="glass-dark p-8 rounded-3xl border-emerald-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-emerald-500 tracking-[0.3em] mb-1">AI CONFIDENCE</span>
                                <span className="text-5xl font-black text-emerald-500 tracking-tighter">88%</span>
                            </div>
                        </div>

                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold mb-4 bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
                                <ShieldCheck size={14} /> GOD-TIER SIGNAL DETECTED
                            </div>
                            <h2 className="text-3xl font-bold mb-4 leading-tight">Will the Federal Reserve cut rates by 50bps in March?</h2>

                            <div className="flex gap-4 mb-8">
                                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                    <span className="block text-[10px] text-white/40 font-bold uppercase">Market Price</span>
                                    <span className="text-xl font-bold">42% (YES)</span>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                                    <span className="block text-[10px] text-emerald-500 font-bold uppercase">Fair Value</span>
                                    <span className="text-xl font-bold text-emerald-500">68% (YES)</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-white/40 uppercase">
                                    <MessageSquare size={16} /> Reasoning Log
                                </h3>
                                <div className="text-white/80 leading-relaxed font-light text-lg glass p-6 rounded-2xl border-white/5">
                                    The market is severely underpricing the FOMC pivot. Current inflation data shows a terminal cooldown in core services, but the market is anchored to J. Powell's hawkish rhetoric from 3 months ago. Whale accumulation at the $92k bid level on related BTC pairs suggests institutional hedging for a surprise cut. GDELT sentiment on 'Economic Elasticity' has turned 82% bullish in Tier 1 sources over the last 48 hours.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Secondary Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* News Context */}
                        <section className="glass-dark p-6 rounded-3xl border-white/5">
                            <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-white/40 uppercase mb-6">
                                <Newspaper size={16} /> Tier 1 Context
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-xl transition-colors group">
                                    <div className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded">T1</div>
                                    <div>
                                        <p className="text-sm font-medium leading-tight mb-1 group-hover:text-emerald-400 transition-colors">Bloomberg: "Fed Insiders Hint at Aggressive Pivot"</p>
                                        <span className="text-[10px] text-white/30 uppercase">2 hours ago · verified</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-xl transition-colors group">
                                    <div className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded">T1</div>
                                    <div>
                                        <p className="text-sm font-medium leading-tight mb-1 group-hover:text-emerald-400 transition-colors">Reuters: "Global Inflation Cools Faster Than Bank Targets"</p>
                                        <span className="text-[10px] text-white/30 uppercase">5 hours ago · verified</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Sentiment Meter */}
                        <section className="glass-dark p-6 rounded-3xl border-white/5">
                            <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-white/40 uppercase mb-6">
                                <BarChart3 size={16} /> Signal Agreement
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white/60">NEWS SENTIMENT</span>
                                        <span className="text-emerald-500">BULLISH (+0.82)</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} className="h-full bg-emerald-500" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white/60">X (TWITTER) SIGNAL</span>
                                        <span className="text-blue-400">NEUTRAL (+0.12)</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "56%" }} className="h-full bg-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Sidebar / Whale Tape */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Whale Tape Section */}
                    <section className="glass-dark p-6 rounded-3xl border-white/5 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-white/40 uppercase">
                                <TrendingUp size={16} /> Whale Tape
                            </h3>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>

                        <div className="space-y-6">
                            {whaleTrades.map((trade) => (
                                <div key={trade.id} className="flex justify-between items-center border-l-2 border-emerald-500/30 pl-4 py-1">
                                    <div>
                                        <p className={cn("text-xs font-black mb-1", trade.type.includes("YES") ? "text-emerald-500" : "text-red-500")}>
                                            {trade.type}
                                        </p>
                                        <p className="text-[10px] text-white/40 font-mono tracking-tighter truncate w-24 uppercase">{trade.user}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{trade.amount}</p>
                                        <p className="text-[10px] text-white/30 uppercase">{trade.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black tracking-widest text-white/40 transition-all uppercase">
                            View Full Audit Tape
                        </button>
                    </section>

                    {/* Insider Activity */}
                    <section className="glass-dark p-6 rounded-3xl border-blue-500/20 bg-blue-500/[0.02]">
                        <h3 className="flex items-center gap-2 text-sm font-bold tracking-widest text-blue-400 uppercase mb-4">
                            <UserCheck size={16} /> Insider Monitoring
                        </h3>
                        <p className="text-xs text-white/50 leading-relaxed mb-6">
                            Detection of 3 "Legendary" ranked wallets with &gt 90% win-rates accumulating positions on this event.
                        </p>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <AlertCircle size={20} className="text-blue-400" />
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Aggregated Risk</p>
                                <p className="text-sm font-bold">INSIDER ACCUMULATION HIGH</p>
                            </div>
                        </div>
                    </section>

                    {/* Action Button */}
                    <button className="w-full py-6 bg-emerald-500 text-black font-black rounded-3xl text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 group">
                        BET WITH EDGE <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Users({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
