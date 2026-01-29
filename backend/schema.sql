-- PolyEdge: God-Tier Production Schema
-- WARNING: This will DELETE existing data and recreate the system for a clean launch.

-- 1. CLEANUP (Drop in reverse dependency order)
DROP VIEW IF EXISTS public.activity_ticker;
DROP TABLE IF EXISTS public.bet_logs;
DROP TABLE IF EXISTS public.predictions;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.markets;

-- 2. CORE TABLES

-- Tracked Markets
CREATE TABLE public.markets (
    id TEXT PRIMARY KEY, -- condition_id
    question TEXT NOT NULL,
    url TEXT,
    category TEXT,
    volume NUMERIC,
    clob_token_ids JSONB, -- [YES_ID, NO_ID]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_scanned_at TIMESTAMPTZ
);

-- User Profiles & Pro Settings (Linked via Clerk ID)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY, -- Clerk User ID
    email TEXT UNIQUE,
    is_pro BOOLEAN DEFAULT FALSE,
    stripe_customer_id TEXT,
    
    -- Risk Management
    min_edge_threshold NUMERIC DEFAULT 10.0,
    min_confidence_threshold NUMERIC DEFAULT 70.0,
    max_bet_size NUMERIC DEFAULT 50.0,
    daily_stop_loss NUMERIC DEFAULT 250.0,
    
    -- Webhooks
    discord_webhook TEXT,
    telegram_chat_id TEXT,
    
    -- Encrypted API Keys
    polymarket_api_key TEXT,
    polymarket_secret TEXT,
    polymarket_passphrase TEXT,
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Predictions (The Brain's Output)
CREATE TABLE public.predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id TEXT REFERENCES public.markets(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Scores
    market_probability NUMERIC,
    fair_probability NUMERIC,
    edge_percentage NUMERIC,
    confidence INTEGER,
    
    -- Logic
    action TEXT CHECK (action IN ('BUY_YES', 'BUY_NO', 'HOLD')),
    edge_quality TEXT, 
    signal_agreement TEXT, 
    reasoning TEXT,
    
    -- Dashboard Visual Metadata
    top_headlines JSONB, -- [{title, source, tier, url}]
    key_signals JSONB,
    risk_factors JSONB,
    sentiment_score NUMERIC, -- -1.0 to 1.0
    
    model_version TEXT DEFAULT 'llama-3.1-8b-god-tier'
);

-- Betting Operations (Audit Trail)
CREATE TABLE public.bet_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    prediction_id UUID REFERENCES public.predictions(id),
    market_id TEXT REFERENCES public.markets(id),
    
    side TEXT, -- BUY_YES, BUY_NO
    amount_usd NUMERIC,
    entry_price NUMERIC,
    exit_price NUMERIC,
    shares NUMERIC,
    
    status TEXT DEFAULT 'PENDING',
    pnl_usd NUMERIC,
    
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- 3. VIEWS (For Tickers/Dashboards)
CREATE VIEW public.activity_ticker AS 
SELECT 
    p.id as user_id,
    m.question,
    b.pnl_usd,
    b.executed_at
FROM public.bet_logs b
JOIN public.profiles p ON b.user_id = p.id
JOIN public.markets m ON b.market_id = m.id
WHERE b.pnl_usd IS NOT NULL
ORDER BY b.executed_at DESC
LIMIT 20;

-- 4. PERMISSIONS (Ensuring API access)
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bet_logs ENABLE ROW LEVEL SECURITY;

-- Note: In Supabase, you must allow 'anon' or 'authenticated' roles 
-- to read these tables unless using Service Role keys throughout.
