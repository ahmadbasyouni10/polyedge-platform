import os
import requests
import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class ContextService:
    """
    The 'Eyes' of PolyEdge.
    Fetches real-time, tiered context from X (Twitter) and GDELT News.
    """
    
    TWITTER_API_IO_KEY = os.getenv("TWITTER_API_IO_KEY")
    TWITTER_API_IO_BASE = "https://api.twitterapi.io/twitter"
    GDELT_DOC_API = "https://api.gdeltproject.org/api/v2/doc/doc"

    @classmethod
    def get_market_context(cls, question: str, days_before: int = 3) -> str:
        """
        Fetches combined News and X signals and returns a formatted God-Tier string.
        """
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_before)
        
        # 1. Fetch News
        news_articles = cls._fetch_gdelt(question, start_date, end_date)
        
        # 2. Fetch Tweets
        tweets = cls._fetch_tweets(question, start_date, end_date)
        
        # 3. Format into the God-Tier Contract
        return cls._format_context(news_articles, tweets)

    @classmethod
    def _fetch_gdelt(cls, question: str, start_dt: datetime, end_dt: datetime) -> List[Dict]:
        """Real GDELT Fetcher"""
        keywords = cls._extract_keywords(question)
        query = "(" + " OR ".join(keywords) + ")"
        
        params = {
            "query": query,
            "mode": "artlist",
            "maxrecords": "20",
            "format": "json",
            "startdatetime": start_dt.strftime("%Y%m%d%H%M%S"),
            "enddatetime": end_dt.strftime("%Y%m%d%H%M%S"),
            "sourcelang": "eng"
        }
        
        try:
            response = requests.get(cls.GDELT_DOC_API, params=params, timeout=15)
            if response.status_code == 200:
                data = response.json()
                return data.get("articles", [])
        except Exception as e:
            print(f"Error fetching GDELT: {e}")
        return []

    @classmethod
    def _fetch_tweets(cls, question: str, start_dt: datetime, end_dt: datetime) -> List[Dict]:
        """Real Twitter Fetcher via TwitterAPI.io"""
        if not cls.TWITTER_API_IO_KEY:
            return []
            
        search_query = cls._extract_twitter_query(question)
        full_query = f"{search_query} since:{start_dt.strftime('%Y-%m-%d')}_00:00:00_UTC until:{end_dt.strftime('%Y-%m-%d')}_23:59:59_UTC"
        
        headers = {"X-API-Key": cls.TWITTER_API_IO_KEY}
        params = {"query": full_query, "queryType": "Latest"}
        
        try:
            response = requests.get(f"{cls.TWITTER_API_IO_BASE}/tweet/advanced_search", headers=headers, params=params, timeout=20)
            if response.status_code == 200:
                return response.json().get("tweets", [])
        except Exception as e:
            print(f"Error fetching Tweets: {e}")
        return []

    @staticmethod
    def _extract_keywords(question: str) -> List[str]:
        words = question.replace("?", "").split()
        return [w for w in words if len(w) > 3 and w[0].isupper()][:3]

    @staticmethod
    def _extract_twitter_query(question: str) -> str:
        # Simple extraction for now
        keywords = [w for w in question.split() if w[0].isupper()][:2]
        return " OR ".join(keywords) if keywords else "Polymarket"

    @classmethod
    def _format_context(cls, news: List[Dict], tweets: List[Dict]) -> str:
        """Standardizes output for the model."""
        output = "============================================================\n"
        output += "TIER 1: VERIFIED SOURCES [WEIGHT: 3x, RELIABILITY: 95%]\n"
        output += "============================================================\n"
        
        # Pull verified tweets & top news
        for tweet in tweets[:10]:
            if tweet.get("author", {}).get("isBlueVerified"):
                output += f"- @{tweet['author']['userName']} (verified): \"{tweet['text'][:200]}\"\n"
        
        output += "\n============================================================\n"
        output += "TIER 3: PROFESSIONAL NEWS [WEIGHT: 2x, RELIABILITY: 80%]\n"
        output += "============================================================\n"
        for article in news[:10]:
            output += f"- {article.get('domain')}: \"{article.get('title')}\"\n"
            
        output += "\n============================================================\n"
        output += "TIER 4/5: REGULAR & SUSPICIOUS [WEIGHT: 0x-1x]\n"
        output += "============================================================\n"
        for tweet in tweets:
            if not tweet.get("author", {}).get("isBlueVerified"):
                output += f"- @{tweet.get('author', {}).get('userName')}: \"{tweet['text'][:150]}\"\n"
        
        return output
