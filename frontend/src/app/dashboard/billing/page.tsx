"use client";

import { motion } from "framer-motion";
import {
    CreditCard, Check, Zap,
    Shield, Globe, Target,
    Crown, Sparkles
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function BillingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    const tiers = [
        {
            name: "FREE",
            price: "$0",
            period: "forever",
            features: [
                "3 Manual Scans per Day",
                "Teaser Analysis (Edge % Only)",
                "Community Discord Access",
                "Basic Market Alerts"
            ],
            cta: "CURRENT PLAN",
            disabled: true
        },
        {
            name: "PRO",
            price: isAnnual ? "$290" : "$29",
            period: isAnnual ? "/year" : "/month",
            popular: true,
            features: [
                "Unlimited Market Scans",
                "Full God-Tier AI Reasoning",
                "Real-time Discord/TG Alerts",
                "Auto-Betting Engine (CLOB)",
                "Whale Tape Access",
                "Priority Execution (140ms)",
                "PnL Analytics Dashboard"
            ],
            cta: "UPGRADE TO PRO",
            disabled: false
        }
    ];

    const handleCheckout = async (tier: string) => {
        // In production, this would call your Stripe checkout endpoint
        console.log(`Initiating checkout for ${tier}`);
        // Example: const response = await fetch('/api/stripe/checkout', { method: 'POST', body: JSON.stringify({ tier }) });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-black uppercase tracking-tighter">Upgrade Your Edge</h1>
                <p className="text-white/40 font-bold tracking-tight text-lg max-w-2xl mx-auto">
                    Upgrade to Pro and unlock all features. Cancel anytime.
                </p>

                {/* Annual Toggle */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <span className={cn("text-sm font-bold", !isAnnual ? "text-white" : "text-white/40")}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className={cn(
                            "relative w-16 h-8 rounded-full transition-all",
                            isAnnual ? "bg-emerald-500" : "bg-white/10"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-lg",
                            isAnnual ? "right-1" : "left-1"
                        )} />
                    </button>
                    <span className={cn("text-sm font-bold", isAnnual ? "text-white" : "text-white/40")}>Annual</span>
                    {isAnnual && (
                        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            SAVE 17%
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tiers.map((tier, i) => (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "p-10 rounded-[50px] border relative overflow-hidden",
                            tier.popular
                                ? "bg-gradient-to-br from-emerald-500/10 to-black border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                                : "bg-white/[0.02] border-white/5"
                        )}
                    >
                        {tier.popular && (
                            <div className="absolute top-6 right-6">
                                <div className="px-4 py-1 bg-emerald-500 text-black rounded-full flex items-center gap-2">
                                    <Crown size={12} fill="currentColor" />
                                    <span className="text-[9px] font-black tracking-widest uppercase">MOST POPULAR</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black italic tracking-tighter">{tier.price}</span>
                                    <span className="text-white/40 font-bold text-sm">{tier.period}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {tier.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                            tier.popular ? "bg-emerald-500 text-black" : "bg-white/10 text-white/40"
                                        )}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-bold text-white/80">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleCheckout(tier.name)}
                                disabled={tier.disabled}
                                className={cn(
                                    "w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all",
                                    tier.popular
                                        ? "bg-emerald-500 text-black hover:bg-white shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                        : "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
                                )}
                            >
                                {tier.cta}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Trust Badges */}
            <div className="pt-12 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: <Shield size={24} />, label: "AES-256 Encrypted", sub: "Bank-level security" },
                        { icon: <Zap size={24} />, label: "Instant Activation", sub: "Access in 30 seconds" },
                        { icon: <CreditCard size={24} />, label: "Cancel Anytime", sub: "No hidden fees" }
                    ].map((badge, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                            <div className="text-emerald-500 mb-3 flex justify-center">{badge.icon}</div>
                            <p className="text-sm font-black uppercase tracking-tight mb-1">{badge.label}</p>
                            <p className="text-xs text-white/40 font-bold">{badge.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
