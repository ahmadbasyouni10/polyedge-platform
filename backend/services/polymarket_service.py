import requests
from typing import List, Dict, Optional
from datetime import datetime

class PolymarketService:
    GAMMA_API = "https://gamma-api.polymarket.com"
    CLOB_API = "https://clob.polymarket.com"

    @classmethod
    def get_active_markets(cls, limit: int = 100) -> List[Dict]:
        """Fetch active, high-volume markets from Gamma API."""
        url = f"{cls.GAMMA_API}/markets"
        params = {
            "closed": "false",
            "active": "true",
            "limit": limit,
            "order": "volume",
            "ascending": "false"
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error in get_active_markets: {e}")
            return []

    @classmethod
    def get_market_prices(cls, condition_id: str) -> Dict:
        """Fetch current prices for a market from CLOB API."""
        url = f"{cls.CLOB_API}/prices-history"
        params = {"condition_id": condition_id}
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error in get_market_prices: {e}")
            return {}

    @classmethod
    def get_order_book(cls, token_id: str) -> Dict:
        """Fetch order book for a specific token."""
        url = f"{cls.CLOB_API}/book"
        params = {"token_id": token_id}
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error in get_order_book: {e}")
            return {}
    @classmethod
    def get_market_details(cls, slug: str) -> Optional[Dict]:
        """Fetch details for a specific market by its slug."""
        url = f"{cls.GAMMA_API}/markets"
        params = {"slug": slug}
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            return data[0] if data else None
        except Exception as e:
            print(f"Error in get_market_details: {e}")
            return None

    @classmethod
    def get_market_yes_price(cls, condition_id: str) -> float:
        """Helper to get the latest YES price for a market (default 0.5)."""
        prices = cls.get_market_prices(condition_id)
        if prices and isinstance(prices, list) and len(prices) > 0:
            # Polymarket prices-history usually returns a list of price points
            # We take the most recent one for the YES token
            return float(prices[-1].get("price", 0.5))
        return 0.5

    @staticmethod
    def extract_token_id(market: Dict, outcome: str = "Yes") -> Optional[str]:
        """Extracts the CLOB token ID for a specific outcome."""
        clob_ids = market.get("clobTokenIds", [])
        if not clob_ids: return None
        
        # Typically Index 0 is YES, Index 1 is NO for binary markets
        return clob_ids[0] if outcome.lower() == "yes" else clob_ids[1] if len(clob_ids) > 1 else None
