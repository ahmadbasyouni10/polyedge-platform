"use client";

import { motion } from "framer-motion";
import {
    Zap, Globe, Target,
    ArrowUpRight, ArrowDownRight,
    TrendingUp, ShieldCheck, Activity,
    MessageSquare, Terminal as TerminalIcon,
    Search, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function MarketAnalysisPage({ params }: { params: { id: string } }) {
    const [marketData, setMarketData] = useState<any>(null);

    // Mock data for high-intensity visualization
    const analysis = {
        question: "Will the Federal Reserve lower interest rates by 50bps in May 2024?",
        side: "YES",
        edge: 14.5,
        confidence: 88,
        marketPrice: 0.42,
        fairPrice: 0.56,
        keySignals: [
            { source: "Bloomberg (T1)", content: "Internal Fed leaks suggest dovish pivot in private memo.", tier: 1 },
            { source: "X Whale (T1)", content: "Accumulation of $2M YES tokens over the last 12 hours.", tier: 1 },
            { source: "GDELT Fusion", content: "Global sentiment shifting towards rate cut conviction.", tier: 3 }
        ],
        reasoning: "PolyEdge's Sentinel agent has identified a significant divergence between market pricing (42%) and global signal conviction (56%). Whale accumulation on the CLOB is accelerating, while T1 professional news sources have begun pricing in a 'pivot' narrative that hasn't fully hit the Polymarket retail flow yet.",
        riskFactors: ["Volatility in CPI data release", "CLOB Liquidity Depth"]
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Edge Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border border-black bg-emerald-500/20" />
                            ))}
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase italic">ANALYSIS BY 4 CLUSTER NODES</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tightest leading-tight max-w-3xl italic">
                        {analysis.question}
                    </h1>
                    <div className="flex items-center gap-6">
                        <span className="text-[11px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Globe size={14} /> POLYMARKET CLOB
                        </span>
                        <span className="text-[11px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Target size={14} /> ID: {params.id.slice(0, 8)}...
                        </span>
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group p-1 align-middle"
                >
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full group-hover:bg-emerald-500/40 transition-all" />
                    <div className="relative bg-black border-4 border-emerald-500 rounded-[40px] px-16 py-10 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase mb-2">GOD-TIER SIGNAL</p>
                        <h2 className="text-7xl font-black italic tracking-tighter text-white">{analysis.side}</h2>
                        <p className="text-[11px] font-black tracking-widest text-emerald-500/60 uppercase mt-4">CONFIRMED EDGE</p>
                    </div>
                </motion.div>
            </div>

            {/* Main Analysis Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

                {/* Left: Gauges and Stats */}
                <div className="space-y-10">
                    <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-10">
                        <div className="space-y-6 text-center">
                            <p className="text-[10px] font-black tracking-widest text-white/30 uppercase">AGENT CONVICTION</p>
                            <div className="relative w-40 h-40 mx-auto">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * 0.88)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <text x="50" y="55" textAnchor="middle" className="fill-white text-[20px] font-black tracking-tighter italic">88%</text>
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black text-white/20 uppercase mb-2">Market Price</p>
                                <p className="text-2xl font-black italic">{Math.round(analysis.marketPrice * 100)}%</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-[10px] font-black text-emerald-500/60 uppercase mb-2">Fair Value</p>
                                <p className="text-2xl font-black italic text-emerald-500">{Math.round(analysis.fairPrice * 100)}%</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500 to-emerald-700 text-black shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-black tracking-widest uppercase opacity-60">PRO PROFIT ESTIMATE</span>
                                <TrendingUp size={18} className="opacity-60" />
                            </div>
                            <h3 className="text-4xl font-black italic tracking-tighter mb-2">+$1,450.00</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Based on $10k Exposure @ {analysis.edge}% Edge</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[40px] bg-black border border-white/10 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3">
                            <ShieldCheck size={18} className="text-emerald-500" /> RISK AUDIT
                        </h3>
                        <div className="space-y-4">
                            {analysis.riskFactors.map(risk => (
                                <div key={risk} className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                    <Activity size={14} className="text-white/20" />
                                    <span className="text-[12px] font-bold text-white/60">{risk}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Reasoning & Signals */}
                <div className="xl:col-span-2 space-y-10">
                    {/* Summary Reasoning */}
                    <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <TerminalIcon size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">AGENT: SENTINEL_V3</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold leading-[1.6] text-white/80 italic">
                            "{analysis.reasoning}"
                        </p>
                    </div>

                    {/* Signal Feed */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Verified Signals</h2>
                        <div className="space-y-4">
                            {analysis.keySignals.map((signal, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all flex items-start gap-8 group"
                                >
                                    <div className="shrink-0 space-y-2 text-center">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-lg",
                                            signal.tier === 1 ? "bg-emerald-500 text-black" : "bg-white/10 text-white/40"
                                        )}>
                                            <Zap size={20} fill={signal.tier === 1 ? "currentColor" : "none"} />
                                        </div>
                                        <p className="text-[9px] font-black tracking-widest text-white/20">TIER {signal.tier}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-black tracking-[0.2em] text-emerald-500 uppercase italic">{signal.source}</span>
                                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                                            <span className="text-[11px] font-bold text-white/20 uppercase">SCANNED 14M AGO</span>
                                        </div>
                                        <p className="text-lg font-bold text-white/80 leading-relaxed">{signal.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <button className="w-full py-6 bg-white/[0.03] border border-white/10 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-black transition-all">
                            FETCH ADDITIONAL CROSS-REFERENCE SIGNALS
                        </button>
                    </div>
                </div>

            </div>

            {/* Action Footer */}
            <div className="sticky bottom-10 left-0 right-0 z-30 flex justify-center">
                <div className="p-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl flex gap-6 shadow-4xl px-8">
                    <button className="px-10 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-emerald-500 transition-all flex items-center gap-3">
                        <ArrowUpRight size={16} /> OPEN ON POLYMARKET
                    </button>
                    <button className="px-10 py-5 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-3">
                        <Zap size={16} fill="currentColor" /> EXECUTE INSTANT ORDER
                    </button>
                </div>
            </div>
        </div>
    );
}
