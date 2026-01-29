import os
import pandas as pd
from datetime import datetime
from pathlib import Path
from .supabase_client import get_supabase_client
from .services.polymarket_service import PolymarketService
from .services.analysis_orchestrator import AnalysisOrchestrator

def fetch_live_markets(limit: int = 100):
    """
    Fetches active, high-volume markets from Polymarket using the service.
    """
    markets = PolymarketService.get_active_markets(limit=limit)
    
    formatted_markets = []
    for m in markets:
        if not m.get("question"):
            continue
            
        formatted_markets.append({
            "id": str(m.get("conditionId", m.get("id"))),
            "question": m.get("question"),
            "url": f"https://polymarket.com/event/{m.get('slug', '')}",
            "category": m.get("category", "General"),
            "volume": float(m.get("volume", 0)),
            "clob_token_ids": m.get("clobTokenIds", []),
            "last_scanned_at": datetime.now().isoformat()
        })
        
    return formatted_markets

def run_automated_scan(limit: int = 20):
    """
    The Master Scanning Loop.
    Fetches top markets and runs the God-Tier Analysis Orchestrator on each.
    """
    print(f"--- STARTING AUTOMATED MARKET SCAN ({datetime.now()}) ---")
    markets = fetch_live_markets(limit=limit)
    
    results = []
    for market in markets:
        # Get real YES price
        current_price = PolymarketService.get_market_yes_price(market['id'])
        
        # Run the full pipeline (News -> AI -> Persistence -> Alerts -> Bets)
        prediction = AnalysisOrchestrator.analyze_market_live(
            market_id=market['id'],
            question=market['question'],
            current_price=current_price,
            volume=market['volume']
        )
        if prediction:
            results.append(prediction)
            
    print(f"--- SCAN COMPLETE. Processed {len(results)} markets. ---")
    return results

def sync_markets_to_supabase(csv_path: str = None, use_live: bool = True):
    """
    Syncs markets starting from live API, falling back to CSV.
    """
    supabase = get_supabase_client()
    markets_data = []

    if use_live:
        print("Fetching live markets from Polymarket API...")
        markets_data = fetch_live_markets()
        
    if not markets_data and csv_path and os.path.exists(csv_path):
        print(f"Fallback: Seeding database from {csv_path}...")
        df = pd.read_csv(csv_path)
        df['volume_num'] = pd.to_numeric(df['volume'], errors='coerce').fillna(0)
        top_markets = df[df['volume_num'] > 10000].sort_values('volume_num', ascending=False).head(50)
        
        for _, row in top_markets.iterrows():
            markets_data.append({
                "id": str(row['id']),
                "question": row['question'],
                "url": f"https://polymarket.com/event/{row.get('event_slug', '')}",
                "category": row.get('category', 'General'),
                "volume": float(row['volume_num']),
                "last_scanned_at": datetime.now().isoformat()
            })
            
    if markets_data:
        try:
            # We use upsert to avoid duplicates
            result = supabase.table("markets").upsert(markets_data).execute()
            print(f"Successfully synced {len(markets_data)} markets to Supabase.")
            return result.data
        except Exception as e:
            print(f"Error upserting to Supabase: {e}")
            return []
    
    return []

if __name__ == "__main__":
    # Local test of the scanner
    run_automated_scan(limit=5)
