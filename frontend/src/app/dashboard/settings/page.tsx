"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield, Key, Bell, MessageSquare,
    Settings as SettingsIcon, Save,
    AlertTriangle, CheckCircle2,
    Mail, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    const sections = [
        {
            id: "api",
            title: "Market Access",
            icon: <Key size={18} />,
            desc: "Configure your Polymarket CLOB credentials for 140ms execution.",
            fields: [
                { label: "API KEY", type: "password", placeholder: "pk_live_..." },
                { label: "API SECRET", type: "password", placeholder: "sk_live_..." },
                { label: "PASSPHRASE", type: "password", placeholder: "********" }
            ]
        },
        {
            id: "notifications",
            title: "Agent Alerts",
            icon: <Bell size={18} />,
            desc: "Get notified the millisecond Sentinel identifies an edge.",
            fields: [
                { label: "DISCORD WEBHOOK", type: "text", placeholder: "https://discord.com/api/webhooks/..." },
                { label: "TELEGRAM CHAT ID", type: "text", placeholder: "@your_handle or ID" }
            ]
        },
        {
            id: "risk",
            title: "Risk Parameters",
            icon: <Shield size={18} />,
            desc: "The Executioner agent will never violate these hard limits.",
            fields: [
                { label: "MIN EDGE THRESHOLD (%)", type: "number", placeholder: "8.0" },
                { label: "MAX EXPOSURE PER BET ($)", type: "number", placeholder: "100.00" },
                { label: "DAILY LOSS LIMIT ($)", type: "number", placeholder: "500.00" }
            ]
        }
    ];

    return (
        <div className="max-w-4xl space-y-12 pb-20">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Cluster Settings</h1>
                <p className="text-white/40 font-bold tracking-tight">Configure your node for Pro-grade execution.</p>
            </div>

            <div className="space-y-16">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-8"
                    >
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 shrink-0">
                                {section.icon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white/90">{section.title}</h3>
                                <p className="text-white/40 font-bold text-[13px] tracking-tight max-w-md">{section.desc}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-[84px]">
                            {section.fields.map((field) => (
                                <div key={field.label} className="space-y-3">
                                    <label className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{field.label}</label>
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold text-white placeholder:text-white/10 focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] outline-none transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        {idx < sections.length - 1 && <div className="h-px bg-white/5 w-full mt-16" />}
                    </motion.div>
                ))}
            </div>

            {/* Action Bar */}
            <div className="sticky bottom-10 left-0 right-0 z-30">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[32px] flex items-center justify-between shadow-4xl">
                    <div className="flex items-center gap-4 text-white/40">
                        <AlertTriangle size={18} className="text-emerald-500/50" />
                        <p className="text-[11px] font-bold tracking-tight">All API keys are encrypted client-side using AES-256 before storage.</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all",
                            success ? "bg-emerald-500 text-black" : "bg-white text-black hover:bg-emerald-500 disabled:opacity-50"
                        )}
                    >
                        {isSaving ? "SYNCING..." : success ? (
                            <>
                                <CheckCircle2 size={16} />
                                LOCKED & SECURED
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                SAVE CONFIGURATION
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
