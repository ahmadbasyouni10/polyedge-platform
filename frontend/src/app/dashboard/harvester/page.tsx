"use client";

import { motion } from "framer-motion";
import {
    Target, TrendingUp, Activity,
    ArrowUpRight, ArrowDownRight,
    Filter, Download, Search,
    Zap, Database, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function HarvesterPage() {
    const whaleTrades = [
        { id: 1, user: "0x74a...821", market: "Fed Meeting: 50bps", side: "BUY YES", size: "$142,500", time: "12s ago", confidence: "HIGH" },
        { id: 2, user: "0xBC2...91a", market: "Super Bowl Winner", side: "SELL NO", size: "$84,200", time: "45s ago", confidence: "MEDIUM" },
        { id: 3, user: "0x12f...D41", market: "BTC to $100k", side: "BUY YES", size: "$210,000", time: "1m ago", confidence: "V. HIGH" },
        { id: 4, user: "0x883...222", market: "2024 Election: GOP", side: "BUY YES", size: "$1.2M", time: "3m ago", confidence: "INSIDER_SCOPE" },
    ];

    const marketAccumulation = [
        { market: "Fed Rate Cut", conviction: 88, flow: "+$2.4M", trend: "up" },
        { market: "Solana ETF", conviction: 42, flow: "-$400k", trend: "down" },
        { market: "Nvidia Earnings", conviction: 91, flow: "+$1.8M", trend: "up" },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Harvester Terminal</h1>
                    <p className="text-white/40 font-bold tracking-tight">Whale Tape Access. Detecting conviction before the breakout.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Filter size={14} /> FILTER INTENT
                    </button>
                    <button className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
                        <Download size={14} /> EXPORT CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Whale Tape */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-black uppercase tracking-tighter">Live Order Flow (CLOB)</h2>
                        <div className="flex gap-8 text-[10px] font-black text-white/30 tracking-widest uppercase">
                            <span>Total Flow: $12.4M</span>
                            <span className="text-emerald-500">Net Buy: +$4.2M</span>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/20 uppercase">Entity</th>
                                    <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/20 uppercase">Market</th>
                                    <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/20 uppercase">Size</th>
                                    <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/20 uppercase">Side</th>
                                    <th className="px-8 py-6 text-[10px] font-black tracking-widest text-white/20 uppercase text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {whaleTrades.map((trade, i) => (
                                    <motion.tr
                                        key={trade.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-white/[0.03] transition-all cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                    <Database size={14} />
                                                </div>
                                                <span className="text-[12px] font-bold font-mono">{trade.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[12px] font-bold text-white/80 line-clamp-1">{trade.market}</span>
                                        </td>
                                        <td className="px-8 py-6 text-[12px] font-black text-white">{trade.size}</td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-1 rounded-md tracking-widest",
                                                trade.side.includes("BUY") ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                                            )}>
                                                {trade.side}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px] font-black text-white/30 text-right">{trade.time}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Conventional Trend Analysis */}
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-tighter">Conviction Map</h2>
                        <div className="space-y-4">
                            {marketAccumulation.map((item, i) => (
                                <motion.div
                                    key={item.market}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="p-6 rounded-3xl bg-white/[0.02] border border-white/5"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-[12px] font-bold uppercase">{item.market}</p>
                                        {item.trend === "up" ? <ArrowUpRight className="text-emerald-500" size={16} /> : <ArrowDownRight className="text-red-500" size={16} />}
                                    </div>
                                    <div className="flex items-end justify-between font-black italic">
                                        <div className="text-3xl tracking-tighter">{item.conviction}%</div>
                                        <div className={cn("text-xs mb-1", item.trend === "up" ? "text-emerald-500" : "text-red-500")}>{item.flow}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-[40px] bg-emerald-500 text-black shadow-4xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck size={120} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic mb-4">Active Whale Alerts</h3>
                        <p className="text-[11px] font-black uppercase tracking-widest mb-6 leading-relaxed opacity-60">
                            Whales are currently accumulating YES tokens in the "Nvidia Earnings" market. Conviction score: 94.
                        </p>
                        <button className="w-full py-3 bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white hover:text-black transition-all">
                            JOIN THE CLUSTER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
