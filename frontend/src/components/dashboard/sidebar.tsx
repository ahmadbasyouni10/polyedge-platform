"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Terminal, BarChart3, Settings, ShieldCheck,
    Globe, Zap, LayoutDashboard, Database,
    MessageSquare, CreditCard, ChevronLeft, ChevronRight,
    TrendingUp, Target, Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const PolyEdgeLogo = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
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

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuGroups = [
        {
            label: "TERMINALS",
            items: [
                { icon: <LayoutDashboard size={18} />, label: "Overview", href: "/dashboard" },
                { icon: <Globe size={18} />, label: "Sentinel", href: "/dashboard/sentinel" },
                { icon: <Target size={18} />, label: "Harvester", href: "/dashboard/harvester" },
                { icon: <Server size={18} />, label: "Executioner", href: "/dashboard/executioner" },
            ]
        },
        {
            label: "MARKETS",
            items: [
                { icon: <TrendingUp size={18} />, label: "Active Edges", href: "/dashboard/markets" },
                { icon: <BarChart3 size={18} />, label: "PnL Analytics", href: "/dashboard/pnl" },
            ]
        },
        {
            label: "SYSTEM",
            items: [
                { icon: <Settings size={18} />, label: "Settings", href: "/dashboard/settings" },
                { icon: <CreditCard size={18} />, label: "Billing", href: "/dashboard/billing" },
            ]
        }
    ];

    return (
        <div className={cn(
            "relative flex flex-col h-full bg-black border-r border-white/10 transition-all duration-300 z-50",
            isCollapsed ? "w-[80px]" : "w-[280px]"
        )}>
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-8">
                <PolyEdgeLogo size={24} className="shrink-0" />
                {!isCollapsed && (
                    <span className="text-lg font-black tracking-tightest uppercase text-white">PolyEdge</span>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors shadow-lg"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <div className="flex-grow px-4 space-y-8 overflow-y-auto custom-scrollbar">
                {menuGroups.map((group) => (
                    <div key={group.label} className="space-y-2">
                        {!isCollapsed && (
                            <p className="px-4 text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
                                {group.label}
                            </p>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                                        pathname === item.href
                                            ? "bg-emerald-500/10 text-emerald-500"
                                            : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                                    )}
                                >
                                    <div className={cn(
                                        "shrink-0 transition-colors",
                                        pathname === item.href ? "text-emerald-500" : "group-hover:text-emerald-500"
                                    )}>
                                        {item.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                                    )}
                                    {pathname === item.href && !isCollapsed && (
                                        <div className="ml-auto w-1 h-4 bg-emerald-500 rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Profile */}
            <div className="p-4 border-t border-white/5">
                <div className={cn(
                    "flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8 rounded-lg border border-white/10"
                            }
                        }}
                    />
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="text-[12px] font-black text-white truncate">QUANT NODE</p>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">PRO CLUSTER S1</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
