"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-500 font-sans overflow-hidden">
            {/* Sidebar - Fixed Height */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
                </div>

                {/* Global Dashboard Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-lg">
                            <span className="text-[10px] font-black tracking-widest text-emerald-500">SYSTEM: ACTIVE</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-black text-white/30 tracking-[0.2em] uppercase">
                        <span>Latency: 134ms</span>
                        <span>Node: Cluster_S1_North</span>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-grow overflow-y-auto p-10 z-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-[1600px] mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
