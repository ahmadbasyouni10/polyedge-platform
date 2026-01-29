import json
from services.context_service import ContextService
from services.model_service import ModelService
from services.notification_service import NotificationService
from services.betting_service import BettingService
from utils.prompt_builder import PromptBuilder
from supabase_client import get_supabase_client
from typing import Dict, Any, Optional, List

class AnalysisOrchestrator:
    """
    The 'Central Nervous System' of PolyEdge.
    Orchestrates data fetching, AI analysis, persistence, and execution.
    """
    
    # Simple in-memory cache to save on duplicate requests
    _cache = {}

    @classmethod
    def analyze_market_live(cls, market_id: str, question: str, current_price: float, volume: float) -> Optional[Dict[str, Any]]:
        """
        Runs the full God-Tier pipeline for a single market.
        """
        print(f"--- STARTING GOD-TIER ANALYSIS: {question} ---")
        
        # 1. Fetch Real Context (Twitter + News)
        # ContextService handles real API calls to GDELT and TwitterAPI.io
        context_data = ContextService.get_market_context(question)
        
        # 2. Build Model Prompt (Strict Contract)
        prompt_input = PromptBuilder.build_analysis_input(
            question=question,
            current_price=current_price,
            volume=volume,
            news_context=context_data
        )
        
        # 3. Run Model Inference (Fine-tuned Llama 3.1 8B)
        prediction = ModelService.predict_edge(prompt_input)
        
        if not prediction:
            print(f"Failed to generate prediction for {market_id}")
            return None
            
        # 4. Persistence & Dashboard Metadata
        supabase = get_supabase_client()
        
        # Extract top headlines for the UI cards
        headlines = cls._extract_top_headlines(context_data)
        
        prediction_entry = {
            "market_id": market_id,
            "market_probability": prediction.get("market_probability"),
            "fair_probability": prediction.get("fair_probability"),
            "edge_percentage": prediction.get("edge_percentage"),
            "action": prediction.get("action"),
            "confidence": prediction.get("confidence"),
            "edge_quality": prediction.get("edge_quality"),
            "signal_agreement": prediction.get("signal_agreement"),
            "reasoning": prediction.get("reasoning"),
            "key_signals": prediction.get("key_signals"),
            "risk_factors": prediction.get("risk_factors"),
            "top_headlines": headlines,
            "sentiment_score": cls._calculate_sentiment_proxy(context_data),
            "raw_context": context_data,
            "model_version": "llama-3.1-8b-god-tier"
        }
        
        try:
            res = supabase.table("predictions").insert(prediction_entry).execute()
            
            # 5. Pro Alerts & Execution
            # Only trigger if confidence is high
            if prediction.get("confidence", 0) >= 70:
                cls._trigger_automated_workflows(prediction, market_id)
                
            return prediction
        except Exception as e:
            print(f"Error in orchestrator persistence: {e}")
            return prediction

    @staticmethod
    def _extract_top_headlines(context: str) -> List[Dict]:
        """Extracts the first 3 Tier 1/3 headlines from the formatted context string."""
        headlines = []
        lines = context.split("\n")
        for line in lines:
            if line.startswith("- "):
                # Simple parsing for the dashboard visualization
                parts = line[2:].split(": \"")
                if len(parts) == 2:
                    headlines.append({
                        "source": parts[0].strip(),
                        "title": parts[1].strip().strip("\""),
                        "tier": 1 if "(verified)" in parts[0] or "Reuters" in parts[0] or "Bloomberg" in parts[0] else 3
                    })
            if len(headlines) >= 3:
                break
        return headlines

    @staticmethod
    def _calculate_sentiment_proxy(context: str) -> float:
        """Returns a rough sentiment score for the UI heatmap."""
        bullish = ["bullish", "high", "rally", "gain", "buy", "success", "yes"]
        bearish = ["bearish", "low", "dip", "drop", "sell", "fail", "no"]
        
        text = context.lower()
        score = 0
        for word in bullish: score += text.count(word)
        for word in bearish: score -= text.count(word)
        
        # Normalize to -1.0 to 1.0 range
        total = abs(score) + 1
        return max(-1.0, min(1.0, score / total))

    @classmethod
    def _trigger_automated_workflows(cls, prediction: Dict, market_id: str):
        """Dispatches alerts and checks for auto-betting opportunities."""
        supabase = get_supabase_client()
        
        # Fetch active Pro user profiles
        profiles = supabase.table("profiles").select("*").eq("is_pro", True).execute()
        
        for profile in profiles.data:
            # 1. Discord/Telegram Alerts
            if profile.get("discord_webhook"):
                NotificationService.send_discord_alert(
                    profile["discord_webhook"], 
                    prediction, 
                    f"https://polymarket.com/market/{market_id}"
                )
            
            # 2. Automated Betting logic (Inherent risk control)
            if BettingService.validate_risk(profile, prediction):
                # This would execute the actual trade if keys were present
                print(f"AUTO-BET TRIGGERED for user {profile['id']} on market {market_id}")
                # BettingService.place_order(...)
