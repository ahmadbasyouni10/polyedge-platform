"use client";

import { motion } from "framer-motion";
import {
    Terminal, Globe, Activity,
    Search, ShieldAlert, Cpu,
    ChevronRight, ExternalLink,
    Target, Zap, BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function SentinelPage() {
    const [logs, setLogs] = useState([
        { id: 1, agent: "SENTINEL", msg: "Initializing GDELT News Fusion...", status: "success" },
        { id: 2, agent: "SENTINEL", msg: "Scanning Polymarket CLOB for volume spikes...", status: "active" },
        { id: 3, agent: "HARVESTER", msg: "Detected whale bid on 'Fed Meeting' market ($142k)", status: "alert" },
    ]);

    const activeScans = [
        { id: 1, market: "Will BTC reach $100k by March?", edge: 14.2, confidence: 88, sentiment: 82 },
        { id: 2, market: "Fed Meeting: 50bps cut in May?", edge: 6.5, confidence: 71, sentiment: 45 },
        { id: 3, market: "Super Bowl Winner: Chiefs?", edge: 9.1, confidence: 84, sentiment: 78 },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Sentinel Terminal</h1>
                    <p className="text-white/40 font-bold tracking-tight">Real-time market signals. 24/7 edge detection.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Search size={14} /> NEW SCAN
                    </button>
                    <button className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
                        <Cpu size={14} /> RECALIBRATE AGENTS
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Left: Active Scanning Grid */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeScans.map((scan, i) => (
                            <motion.div
                                key={scan.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/40 group-hover:text-emerald-500 transition-colors">
                                            <Target size={20} />
                                        </div>
                                        <p className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">SIGNAL L_PRIME_{scan.id}</p>
                                    </div>
                                    <ExternalLink size={14} className="text-white/20 group-hover:text-white transition-colors cursor-pointer" />
                                </div>

                                <h3 className="text-xl font-black text-white/90 mb-8 line-clamp-2 uppercase italic leading-[1.2]">{scan.market}</h3>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black tracking-widest mb-2 uppercase">
                                            <span className="text-white/30">Edge Detected</span>
                                            <span className="text-emerald-500">+{scan.edge}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scan.edge * 5}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black tracking-widest mb-2 uppercase">
                                            <span className="text-white/30">AI Confidence</span>
                                            <span className="text-blue-500">{scan.confidence}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${scan.confidence}%` }} />
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                                    VIEW REASONING
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Live Reasoning Feed */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-tighter">Live Reasoning</h2>
                    <div className="p-8 rounded-[40px] bg-black border border-white/5 h-[600px] flex flex-col font-mono relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10" />
                        <div className="flex-grow space-y-6 overflow-y-auto custom-scrollbar pt-10">
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-4 group">
                                    <span className={cn(
                                        "text-[10px] font-black shrink-0 px-2 py-0.5 rounded border h-fit",
                                        log.status === "active" ? "text-blue-500 border-blue-500/20 bg-blue-500/5" :
                                            log.status === "alert" ? "text-purple-500 border-purple-500/20 bg-purple-500/5" :
                                                "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                                    )}>
                                        {log.agent}
                                    </span>
                                    <p className="text-[12px] text-white/60 leading-relaxed font-medium">
                                        {log.msg}
                                    </p>
                                </div>
                            ))}
                            <div className="flex gap-4">
                                <span className="text-emerald-500 animate-pulse font-black text-xs">&gt;</span>
                                <span className="text-[12px] text-white/20 animate-pulse">Awaiting next signal...</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

                        <div className="mt-8 pt-8 border-t border-white/5 z-20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">GLOBAL FUSION STATUS: OPTIMAL</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-white/20 uppercase mb-1">GDELT TIER 1</p>
                                    <p className="text-lg font-black italic">ACTIVE</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-white/20 uppercase mb-1">X TIER 1</p>
                                    <p className="text-lg font-black italic text-emerald-500">POLLING</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
