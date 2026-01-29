"""
GDELT News Fetcher - Get REAL historical news articles for training data.

GDELT (Global Database of Events, Language, and Tone) is FREE and provides:
- News articles from 2014 to present
- Full article metadata (title, source, URL, date)
- Global coverage in 100+ languages
- No API key required!

This script fetches news articles for specific dates and keywords
for Polymarket price history data.
"""

import requests
import json
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional
from urllib.parse import quote
import pandas as pd

GDELT_DOC_API = "https://api.gdeltproject.org/api/v2/doc/doc"
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "news"
CACHE_DIR = OUTPUT_DIR / "cache"


def extract_keywords(question: str) -> List[str]:
    """
    Extract searchable keywords from a market question.
    
    Example:
        "Will Bitcoin reach $125,000 by December 31, 2025?"
        -> ["Bitcoin", "BTC", "cryptocurrency"]
    """
    keyword_mappings = {
        "bitcoin": ["Bitcoin", "BTC", "cryptocurrency"],
        "ethereum": ["Ethereum", "ETH", "cryptocurrency"],
        "solana": ["Solana", "SOL", "cryptocurrency"],
        "crypto": ["cryptocurrency", "crypto", "digital currency"],
        "fed": ["Federal Reserve", "Fed", "interest rate", "FOMC"],
        "trump": ["Trump", "Donald Trump", "president"],
        "biden": ["Biden", "Joe Biden", "president"],
        "lakers": ["Lakers", "Los Angeles Lakers", "NBA"],
        "celtics": ["Celtics", "Boston Celtics", "NBA"],
        "nba": ["NBA", "basketball"],
        "nfl": ["NFL", "football"],
        "super bowl": ["Super Bowl", "NFL", "football"],
        "election": ["election", "vote", "voting"],
        "russia": ["Russia", "Ukraine", "Putin"],
        "ukraine": ["Ukraine", "Russia", "Zelenskyy"],
    }
    
    question_lower = question.lower()
    keywords = []
    
    for key, values in keyword_mappings.items():
        if key in question_lower:
            keywords.extend(values)
    
    words = question.split()
    for word in words:
        clean_word = word.strip("?.,!\"'()[]")
        if clean_word and clean_word[0].isupper() and len(clean_word) > 2:
            if clean_word not in ["Will", "The", "And", "But", "For", "Has", "Does"]:
                if clean_word not in keywords:
                    keywords.append(clean_word)
    
    seen = set()
    unique_keywords = []
    for kw in keywords:
        if kw.lower() not in seen:
            seen.add(kw.lower())
            unique_keywords.append(kw)
    
    return unique_keywords[:5]      


def fetch_gdelt_articles(
    keywords: List[str],
    start_date: str,
    end_date: str,
    max_records: int = 50,
    language: str = "english"
) -> List[Dict]:
    """
    Fetch news articles from GDELT for given keywords and date range.
    
    Args:
        keywords: List of search terms (OR'd together)
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        max_records: Maximum number of articles to return
        language: Language filter
    
    Returns:
        List of article dictionaries with title, source, url, date, etc.
    
    Example:
        articles = fetch_gdelt_articles(
            keywords=["Bitcoin", "BTC"],
            start_date="2025-08-01",
            end_date="2025-08-15",
            max_records=20
        )
    """
    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
    
    start_gdelt = start_dt.strftime("%Y%m%d%H%M%S")
    end_gdelt = end_dt.strftime("%Y%m%d%H%M%S")
    
    terms = []
    for kw in keywords:
        if " " in kw:
            terms.append(f'"{kw}"') 
        elif len(kw) >= 4:
            terms.append(kw) 
    
    if not terms:
        terms = [keywords[0]] if keywords else ["news"]
    
    query = "(" + " OR ".join(terms) + ")"
    
    params = {
        "query": query,
        "mode": "artlist",
        "maxrecords": str(max_records),
        "format": "json",
        "startdatetime": start_gdelt,
        "enddatetime": end_gdelt,
        "sort": "relevance"
    }
    if language.lower() == "english":
        params["sourcelang"] = "eng"
    
    try:
        response = requests.get(GDELT_DOC_API, params=params, timeout=30)
        response.raise_for_status()
        
        if not response.text or not response.text.strip():
            return []
        
        if response.text.strip().startswith("<!") or response.text.strip().startswith("<html"):
            print(f"GDELT returned HTML error page")
            return []
        
        data = response.json()
        
        articles = []
        for article in data.get("articles", []):
            articles.append({
                "title": article.get("title", ""),
                "source": article.get("domain", article.get("source", "")),
                "url": article.get("url", ""),
                "date": article.get("seendate", ""),
                "language": article.get("language", ""),
                "source_country": article.get("sourcecountry", ""),
                "tone": article.get("tone", 0),  
                "image": article.get("socialimage", "")
            })
        
        time.sleep(0.5)
        
        return articles
        
    except requests.exceptions.RequestException as e:
        print(f"GDELT API error: {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"GDELT API error: {e}")
        return []


def fetch_news_for_market(
    question: str,
    analysis_date: str,
    days_before: int = 3,
    max_articles: int = 20
) -> Dict:
    """
    Fetch relevant news for a specific market and date.
    
    Args:
        question: The market question
        analysis_date: The date we're analyzing (YYYY-MM-DD)
        days_before: How many days before to search
        max_articles: Maximum articles to fetch
    
    Returns:
        Dictionary with keywords, articles, and metadata
    """
    keywords = extract_keywords(question)
    
    if not keywords:
        return {"keywords": [], "articles": [], "error": "No keywords extracted"}
    
    end_date = analysis_date
    start_dt = datetime.strptime(analysis_date, "%Y-%m-%d") - timedelta(days=days_before)
    start_date = start_dt.strftime("%Y-%m-%d")
    
    articles = fetch_gdelt_articles(
        keywords=keywords,
        start_date=start_date,
        end_date=end_date,
        max_records=max_articles
    )
    
    return {
        "question": question,
        "keywords": keywords,
        "date_range": {"start": start_date, "end": end_date},
        "articles": articles,
        "article_count": len(articles)
    }


def format_news_for_training(news_data: Dict) -> str:
    """
    Format news articles for use in training prompts.
    
    Returns formatted string matching our weight system:
    - NEWS ARTICLES [WEIGHT: MEDIUM]
    """
    if not news_data.get("articles"):
        return "No news articles found for this market."
    
    lines = []
    lines.append("=" * 60)
    lines.append("NEWS ARTICLES [WEIGHT: MEDIUM - Professional journalism]")
    lines.append("=" * 60)
    
    for article in news_data["articles"][:10]: 
        source = article.get("source", "Unknown")
        title = article.get("title", "No title")
        date = article.get("date", "")[:10] if article.get("date") else ""
        
        lines.append(f'{source}: "{title}"')
        if date:
            lines.append(f"  -> Published {date}")
        lines.append("")
    
    return "\n".join(lines)


def test_gdelt():
    """Test GDELT API with sample queries."""
    print("="*60)
    print("GDELT NEWS FETCHER - TEST")
    print("="*60)
    print("\nGDELT is FREE - no API key required!")
    print("Testing with sample queries...\n")
    
    test_cases = [
        {
            "question": "Will Bitcoin reach $125,000 by December 31, 2025?",
            "date": "2025-08-15"
        },
        {
            "question": "Will the Federal Reserve cut rates in 2025?",
            "date": "2025-08-10"
        },
        {
            "question": "Will Russia capture Kyiv by end of 2025?",
            "date": "2025-08-01"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n[Test {i}] {test['question'][:50]}...")
        
        result = fetch_news_for_market(
            question=test["question"],
            analysis_date=test["date"],
            days_before=3,
            max_articles=5
        )
        
        print(f"  Keywords: {result['keywords']}")
        print(f"  Articles found: {result['article_count']}")
        
        if result["articles"]:
            print(f"  Sample article: {result['articles'][0]['title'][:60]}...")
        
        time.sleep(1) 
    
    print("\n" + "="*60)
    print("GDELT TEST COMPLETE")
    print("="*60)
    print("\nGDELT is ready to use for training data generation!")


def fetch_news_batch(markets_df: pd.DataFrame, output_file: Path = None) -> pd.DataFrame:
    """
    Fetch news for a batch of markets.
    
    Args:
        markets_df: DataFrame with 'question' and 'analysis_date' columns
        output_file: Optional path to save results
    
    Returns:
        DataFrame with news data added
    """
    results = []
    
    for idx, row in markets_df.iterrows():
        question = row.get("question", "")
        analysis_date = row.get("analysis_date", "2025-08-01")
        
        print(f"[{idx+1}/{len(markets_df)}] Fetching news for: {question[:40]}...")
        
        news = fetch_news_for_market(
            question=question,
            analysis_date=analysis_date,
            days_before=3,
            max_articles=15
        )
        
        results.append({
            "question": question,
            "analysis_date": analysis_date,
            "keywords": json.dumps(news["keywords"]),
            "article_count": news["article_count"],
            "articles_json": json.dumps(news["articles"]),
            "formatted_news": format_news_for_training(news)
        })
        
        time.sleep(0.5) 
    
    results_df = pd.DataFrame(results)
    
    if output_file:
        output_file.parent.mkdir(parents=True, exist_ok=True)
        results_df.to_csv(output_file, index=False)
        print(f"\nSaved to: {output_file}")
    
    return results_df


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Fetch GDELT news for training data")
    parser.add_argument("--test", action="store_true", help="Run test queries")
    parser.add_argument("--question", type=str, help="Single question to fetch news for")
    parser.add_argument("--date", type=str, default="2025-08-15", help="Analysis date (YYYY-MM-DD)")
    args = parser.parse_args()
    
    if args.test:
        test_gdelt()
    elif args.question:
        print(f"Fetching news for: {args.question}")
        result = fetch_news_for_market(args.question, args.date)
        print(f"\nKeywords: {result['keywords']}")
        print(f"Articles: {result['article_count']}")
        print("\nFormatted output:")
        print(format_news_for_training(result))
    else:
        print("Usage:")
        print("  python fetch_gdelt_news.py --test")
        print("  python fetch_gdelt_news.py --question 'Will Bitcoin hit $125k?' --date 2025-08-15")
