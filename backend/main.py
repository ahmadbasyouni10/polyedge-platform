from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Header
from typing import List, Optional, Dict, Any
import os
from .supabase_client import get_supabase_client
from .scanner import sync_markets_to_supabase
from .services.polymarket_service import PolymarketService
from .services.analysis_orchestrator import AnalysisOrchestrator
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PolyEdge API", description="AI-Powered Trading Signal Engine for Polymarket")

@app.get("/")
async def root():
    return {"message": "PolyEdge API is live", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "gpu_access": "true" if os.environ.get("CUDA_VISIBLE_DEVICES") else "local"}

@app.get("/markets")
async def get_markets(limit: int = 50):
    """Fetch the latest markets we are tracking."""
    supabase = get_supabase_client()
    response = supabase.table("markets").select("*").order("volume", desc=True).limit(limit).execute()
    return response.data

@app.get("/predictions/{market_id}")
async def get_predictions(market_id: str):
    """Fetch all predictions for a specific market."""
    supabase = get_supabase_client()
    response = supabase.table("predictions").select("*").eq("market_id", market_id).order("timestamp", desc=True).execute()
    return response.data

@app.get("/fomo-ticker")
async def get_fomo_ticker():
    """Fetch the latest winning bets for the landing page ticker."""
    supabase = get_supabase_client()
    # Pulling from the view we created in schema.sql
    response = supabase.table("activity_ticker").select("*").limit(10).execute()
    return response.data

@app.post("/analyze-url")
async def analyze_url(payload: Dict[str, Any], x_user_id: Optional[str] = Header(None)):
    """
    The Landing Page 'Bait' Endpoint.
    If x_user_id is provided (logged in), returns full analysis.
    Otherwise, returns a teaser.
    """
    url = payload.get("url")
    if not url or "polymarket.com" not in url:
        raise HTTPException(status_code=400, detail="Invalid Polymarket URL")

    # Extract slug
    slug = url.split("/event/")[-1].split("?")[0]
    
    # 1. Fetch Market Details
    market = PolymarketService.get_market_details(slug)
    if not market:
        raise HTTPException(status_code=404, detail="Market not found on Polymarket")

    # 2. Run God-Tier Orchestrator
    # Note: In production, we'd check if user is logged in via Clerk (x_user_id)
    prediction = AnalysisOrchestrator.analyze_market_live(
        market_id=market.get("conditionId"),
        question=market.get("question"),
        current_price=float(market.get("outcomePrices", [0.5, 0.5])[0]),
        volume=float(market.get("volume", 0))
    )

    if not prediction:
        raise HTTPException(status_code=500, detail="Analysis failed")

    # 3. Apply 'Bait' Logic
    if not x_user_id:
        # Hide the good stuff to force login
        return {
            "question": market.get("question"),
            "edge_detected": True if prediction.get("edge_percentage", 0) > 5 else False,
            "action": "LOCKED",
            "reasoning": "Sign in with Clerk to unlock the God-Tier reasoning and fair value analysis.",
            "is_teaser": True
        }

    return prediction

@app.post("/sync-markets")
async def sync_markets():
    """Sync active markets from Polymarket to Supabase."""
    try:
        data = sync_markets_to_supabase()
        return {"status": "success", "count": len(data) if data else 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scan-all")
async def trigger_scan(background_tasks: BackgroundTasks):
    """Trigger a scan of all tracked markets (Background Task)."""
    # This will be refined to loop through markets and call Orchestrator
    # background_tasks.add_task(...)
    return {"status": "scanning", "message": "Market analysis loop started in background."}
