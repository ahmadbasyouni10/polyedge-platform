# 💎 PolyEdge: The God-Tier Alpha Platform

Everything that follows is the source of truth for the PolyEdge mission. This document synthesizes the core technical requirements, agentic strategy, and the road to a $29/mo high-moat platform.

---

## 🎯 The Mission
**Stop guessing. Start winning.**
PolyEdge is an autonomous agentic platform that identifies mispriced markets across Polymarket (and soon Kalshi/Memes) before the crowd even hears the news. We capture alpha at sub-140ms speeds using fine-tuned intelligence (Sentinel) and precise automated execution (Executioner).

## 🛠️ Market Strategy (Phase 1 Focus)
We focus on **Polymarket** first. It has the liquidity, the API, and the volume.
1.  **Polymarket**: [LIVE] Primary target.
2.  **Kalshi**: [BETA] Private access for Cluster members.
3.  **Meme Coins**: [SOON] Real-time Sol-scan intent detection.
4.  **Sports Edge**: [SOON] Arbing against legacy bookmakers.

---

## 🤖 The Agentic "Skills" (Capabilities)
The platform is powered by three core agentic primitives:
- **SENTINEL**: The 24/7 scanning engine. Ingests GDELT (global news) and X (Twitter) fusion. Differentiates "Tier 1" news from noise.
- **HARVESTER**: The intent engine. Tracks whale accumulation and distinguishes real conviction from "wash" volume.
- **EXECUTIONER**: The sub-140ms betting engine. Links to your wallet via API to capture edges while you sleep.

---

## 💻 The Experience: "Supabase-Style" Complexity
The dashboard isn't a simple landing page—it's a high-fidelity quant terminal.
- **Sidebar-Centric Layout**: A complex, responsive sidebar for switching between "Clusters," "Active Scans," "Auto-Bet Settings," and "PnL Analytics."
- **Live Reasoning Feed**: A real-time log of what the agents are thinking: *"Sentinel detected 14% edge on Fed Meeting market... Harvester confirmed whale buy... Executioner awaiting threshold."*
- **Visual Gauges**: High-contrast meters for "Edge Confidence" and "Market Overheat."
- **Glassmorphism & Glow**: Premium dark mode with emerald-pulsing indicators for profitable signals.

---

## 🏗️ Technical Roadmap & CI/CD

### 1. Backend Development (FastAPI + Supabase)
- **Market Orchestrator**: Central service to poll Polymarket CLOB and manage active analyses.
- **Agent Workers**: Distributed workers for GDELT scraping, Tweet fetching, and LLM inference (RunPod).
- **Auto-Betting Engine**: Multi-sig/Wallet integration with hard risk limits and stop-losses.
- **User Profiles**: Storing user-defined "Edge Thresholds" (e.g., "Don't bet if edge < 10%").

### 2. CI/CD & Operations
- **Automated Tests**:
    - **Unit**: Individual agent logic (e.g., source tiering).
    - **Integration**: Backend API ↔ Frontend communication.
    - **Visual**: Ensuring the complex dashboard doesn't break on mobile/desktop.
- **Pipeline (GitHub Actions)**:
    - On every push: Build Next.js, run Python Lints, and execute test suites.
    - On merge to `main`: Deploy to Vercel (Frontend) and Railway (Backend).

### 3. "Cluster" Hosting
- Grouping users into groups of 100 on dedicated nodes (Cluster S1, S2, etc.) to guarantee latency and prevent server crowding.

---

## 🚀 Future Vision: "Meme Agent" Expansion
Integrating with Solana/Base launchpads to track "Smart Money" clusters—identifying whales that trade prediction markets *and* early-stage tokens.

---

**Locked In.** Let's build the most impressive platform in the prediction market space.
