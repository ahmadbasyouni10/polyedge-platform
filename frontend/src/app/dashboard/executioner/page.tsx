"use client";

import { motion } from "framer-motion";
import {
    Server, Zap, ShieldAlert,
    Play, Pause, History,
    Activity, ArrowUpRight, ArrowDownRight,
    Settings, Lock, Cpu, BarChart
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ExecutionerPage() {
    const [isActive, setIsActive] = useState(false);

    const activeTriggers = [
        { id: 1, market: "Will BTC reach $100k?", threshold: ">12% Edge", status: "PENDING", time: "Scan in 4s" },
        { id: 2, market: "Fed Meeting: 50bps", threshold: ">8% Edge", status: "READY", time: "Armed" },
    ];

    const recentExecutions = [
        { market: "Super Bowl: Chiefs", pnl: "+$850.00", status: "FILLED", price: "0.42", size: "$2,000", time: "2h ago" },
        { market: "Nvidia Earnings", pnl: "PENDING", status: "PARTIAL", price: "0.68", size: "$5,000", time: "34m ago" },
    ];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Executioner Terminal</h1>
                    <p className="text-white/40 font-bold tracking-tight">Automated CLOB Execution Agency. 140ms Latency Optimized.</p>
                </div>
                <div className="flex gap-4">
                    {!isActive ? (
                        <button
                            onClick={() => setIsActive(true)}
                            className="px-8 py-3 bg-emerald-500 text-black rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2"
                        >
                            <Play size={14} fill="currentColor" /> ACTIVATE AGENT
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsActive(false)}
                            className="px-8 py-3 bg-red-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center gap-2"
                        >
                            <Pause size={14} fill="currentColor" /> DEACTIVATE AGENT
                        </button>
                    )}
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Settings size={14} /> GLOBAL LIMITS
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Left: Performance & Risk Gauge */}
                <div className="xl:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                                <BarChart size={120} />
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2">Portfolio Protection</p>
                            <h3 className="text-3xl font-black italic uppercase mb-8">Optimal Risk</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-bold uppercase">
                                    <span className="text-white/50">Used Limit</span>
                                    <span className="text-emerald-500">$1,200 / $5,000</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[24%]" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Zap size={120} />
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2">Execution Efficiency</p>
                            <h3 className="text-3xl font-black italic uppercase mb-8">142ms Delay</h3>
                            <p className="text-[11px] font-bold text-white/40 uppercase tracking-tight leading-relaxed">
                                Your account has priority access to auto-betting. Status: Active.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-tighter">Active Execution Triggers</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {activeTriggers.map((trigger, i) => (
                                <div key={trigger.id} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                            isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/20"
                                        )}>
                                            <Cpu size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-bold text-white/90 mb-1">{trigger.market}</h4>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">{trigger.threshold}</span>
                                                <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">{trigger.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase",
                                        trigger.status === "READY" ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-white/5 text-white/40 border border-white/10"
                                    )}>
                                        {trigger.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: History Terminal */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-tighter">Audit History</h2>
                    <div className="p-8 rounded-[40px] bg-black border border-white/5 min-h-[500px] flex flex-col font-mono relative">
                        <div className="flex-grow space-y-8 overflow-y-auto custom-scrollbar">
                            {recentExecutions.map((exec, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase text-white/20">
                                        <span>{exec.time}</span>
                                        <span className={cn(exec.status === "FILLED" ? "text-emerald-500" : "text-blue-500")}>[{exec.status}]</span>
                                    </div>
                                    <p className="text-[13px] font-bold text-white/80">{exec.market}</p>
                                    <div className="flex justify-between text-[11px] font-black italic">
                                        <div className="text-white/40">SIZE: {exec.size} @ {exec.price}</div>
                                        <div className={cn(exec.pnl.includes("+") ? "text-emerald-500" : "text-white/30")}>{exec.pnl}</div>
                                    </div>
                                    <div className="h-px bg-white/5 w-full mt-4" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldAlert size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">EXECUTIONER AUDIT ACTIVE</span>
                            </div>
                            <button className="w-full py-4 bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white hover:text-black transition-all">
                                VIEW FULL AUDIT LOGS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
