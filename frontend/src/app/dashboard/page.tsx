"use client";

import { motion } from "framer-motion";
import {
    BarChart3, TrendingUp, AlertCircle,
    Terminal as TerminalIcon, Globe, Zap,
    Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const stats = [
        { label: "NET PROFIT", value: "+$1,242.00", sub: "Last 7 Days", icon: <BarChart3 size={20} />, color: "text-emerald-500" },
        { label: "EDGE DETECTED", value: "124", sub: "Scan Sessions", icon: <TrendingUp size={20} />, color: "text-blue-500" },
        { label: "WIN RATE", value: "68%", sub: "Agent Execution", icon: <Zap size={20} />, color: "text-purple-500" },
        { label: "NODE STATUS", value: "OPTIMAL", sub: "134ms Latency", icon: <Activity size={20} />, color: "text-emerald-500" },
    ];

    const recentEdges = [
        { question: "Will the Fed lower rates by 50bps?", edge: "+14.2%", confidence: 88, status: "PROFIT", time: "2h ago" },
        { question: "Super Bowl Winner: Chiefs?", edge: "+8.5%", confidence: 72, status: "ACTIVE", time: "14m ago" },
        { question: "BTC to hit $100k by March?", edge: "+11.1%", confidence: 91, status: "SIGNAL", time: "5s ago" },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Welcome Header */}
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Quant Terminal</h1>
                <p className="text-white/40 font-bold tracking-tight">Active Cluster: PRO_S1_QUANT_NODE</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                    >
                        <div className={cn("mb-6 p-3 bg-white/[0.03] rounded-xl w-fit group-hover:scale-110 transition-transform", stat.color)}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black tracking-tighter mb-1 uppercase italic">{stat.value}</h3>
                        <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">{stat.sub}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Active Signals Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black uppercase tracking-tighter">Live Sentinel Feed</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 tracking-widest uppercase">SCANNING</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {recentEdges.map((edge, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/[0.03] rounded-xl flex items-center justify-center text-white/40 group-hover:text-emerald-500 transition-colors">
                                        <TerminalIcon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[14px] font-bold text-white/90 mb-1 line-clamp-1">{edge.question}</h4>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">{edge.edge} EDGE</span>
                                            <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">{edge.confidence}% CONFIDENCE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-white/20 uppercase mb-1">{edge.time}</p>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase inline-block",
                                        edge.status === "PROFIT" ? "bg-emerald-500/20 text-emerald-500" :
                                            edge.status === "ACTIVE" ? "bg-blue-500/20 text-blue-500" : "bg-purple-500/20 text-purple-500"
                                    )}>
                                        {edge.status}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Global Heatmap Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-tighter">Market Sentiment</h2>
                    <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/10 min-h-[400px] flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Globe size={180} />
                        </div>

                        <div className="z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black tracking-widest text-emerald-500 uppercase">HIGH INTENSITY</p>
                                    <p className="text-[15px] font-bold">Bullish Overhang</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black tracking-[0.2em] mb-2 uppercase">
                                        <span>Twitter Sentiment</span>
                                        <span className="text-emerald-500">84%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-black tracking-[0.2em] mb-2 uppercase">
                                        <span>GDELT News Fusion</span>
                                        <span className="text-emerald-500">72%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[72%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-white transition-all z-10 shadow-2xl">
                            DOWNLOAD FULL REPORT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
