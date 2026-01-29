import os
import requests
import json
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional
from dotenv import load_dotenv
import pandas as pd

load_dotenv()

TWITTER_API_IO_KEY = os.getenv("TWITTER_API_IO_KEY")
TWITTER_API_IO_BASE = "https://api.twitterapi.io/twitter"
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "tweets"


def check_api_key():
    if not TWITTER_API_IO_KEY:
        print("TWITTER API.IO SETUP REQUIRED")
        return False
    return True


def search_tweets(
    query: str,
    start_date: str,
    end_date: str,
    max_results: int = 50
) -> List[Dict]:
    """
    Search for tweets using TwitterAPI.io.
    
    Args:
        query: Search query (keywords, hashtags, mentions)
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        max_results: Maximum tweets to return
    
    Returns:
        List of tweet dictionaries
    """
    if not TWITTER_API_IO_KEY:
        return []
    
    url = f"{TWITTER_API_IO_BASE}/tweet/advanced_search"
    
    headers = {
        "X-API-Key": TWITTER_API_IO_KEY
    }
    
    full_query = f"{query} since:{start_date}_00:00:00_UTC until:{end_date}_23:59:59_UTC"
    
    params = {
        "query": full_query,
        "queryType": "Latest"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        tweets = []
        
        for tweet in data.get("tweets", [])[:max_results]:
            author = tweet.get("author", {})
            
            tweets.append({
                "id": tweet.get("id", ""),
                "text": tweet.get("text", ""),
                "author_name": author.get("name", ""),
                "author_username": author.get("userName", ""),
                "author_verified": author.get("isBlueVerified", False),
                "author_followers": author.get("followers", 0),
                "created_at": tweet.get("createdAt", ""),
                "retweets": tweet.get("retweetCount", 0),
                "likes": tweet.get("likeCount", 0),
                "replies": tweet.get("replyCount", 0),
                "views": tweet.get("viewCount", 0),
                "url": tweet.get("url", "")
            })
        
        time.sleep(1)
        
        return tweets
        
    except requests.exceptions.RequestException as e:
        if "429" in str(e):
            print(f"Rate limited - waiting 5 seconds...")
            time.sleep(5)
            try:
                response = requests.get(url, headers=headers, params=params, timeout=30)
                response.raise_for_status()
                data = response.json()
                tweets = []
                for tweet in data.get("tweets", [])[:max_results]:
                    author = tweet.get("author", {})
                    tweets.append({
                        "id": tweet.get("id", ""),
                        "text": tweet.get("text", ""),
                        "author_name": author.get("name", ""),
                        "author_username": author.get("userName", ""),
                        "author_verified": author.get("isBlueVerified", False),
                        "author_followers": author.get("followers", 0),
                        "created_at": tweet.get("createdAt", ""),
                        "retweets": tweet.get("retweetCount", 0),
                        "likes": tweet.get("likeCount", 0),
                        "replies": tweet.get("replyCount", 0),
                        "views": tweet.get("viewCount", 0),
                        "url": tweet.get("url", "")
                    })
                time.sleep(1)
                return tweets
            except:
                pass
        print(f"TwitterAPI.io error: {e}")
        return []
    except json.JSONDecodeError:
        print("TwitterAPI.io returned invalid JSON")
        return []


def extract_search_terms(question: str) -> str:
    """
    Extract search terms from a market question.
    Returns a Twitter search query string.
    """
    keyword_mappings = {
        "bitcoin": "Bitcoin OR BTC OR #Bitcoin",
        "ethereum": "Ethereum OR ETH OR #Ethereum",
        "solana": "Solana OR SOL OR #Solana",
        "fed": "Federal Reserve OR Fed OR FOMC OR \"interest rate\"",
        "trump": "Trump OR @realDonaldTrump",
        "biden": "Biden OR @POTUS",
        "lakers": "Lakers OR @Lakers OR #Lakers",
        "nba": "NBA OR #NBA",
        "nfl": "NFL OR #NFL",
        "super bowl": "\"Super Bowl\" OR #SuperBowl",
        "election": "election OR voting OR polls",
    }
    
    question_lower = question.lower()
    
    for key, query in keyword_mappings.items():
        if key in question_lower:
            return query
    
    keywords = []
    words = question.split()
    for word in words:
        clean_word = word.strip("?.,!\"'()[]")
        if clean_word and clean_word[0].isupper() and len(clean_word) > 2:
            if clean_word not in ["Will", "The", "And", "But", "For", "Has", "Does", "Can"]:
                keywords.append(clean_word)
    
    if keywords:
        return " OR ".join(keywords[:3])
    
    return " ".join(words[1:4])


def fetch_tweets_for_market(
    question: str,
    analysis_date: str,
    days_before: int = 3,
    max_tweets: int = 50
) -> Dict:
    """
    Fetch relevant tweets for a specific market and date.
    
    Args:
        question: The market question
        analysis_date: The date we're analyzing (YYYY-MM-DD)
        days_before: How many days before to search
        max_tweets: Maximum tweets to fetch
    
    Returns:
        Dictionary with search terms, tweets, and metadata
    """
    search_query = extract_search_terms(question)
    
    end_date = analysis_date
    start_dt = datetime.strptime(analysis_date, "%Y-%m-%d") - timedelta(days=days_before)
    start_date = start_dt.strftime("%Y-%m-%d")
    
    tweets = search_tweets(
        query=search_query,
        start_date=start_date,
        end_date=end_date,
        max_results=max_tweets
    )
    
    verified = []
    high_engagement = []
    regular = []
    
    for tweet in tweets:
        if tweet["author_verified"]:
            verified.append(tweet)
        elif tweet["retweets"] > 100 or tweet["likes"] > 500:
            high_engagement.append(tweet)
        else:
            regular.append(tweet)
    
    return {
        "question": question,
        "search_query": search_query,
        "date_range": {"start": start_date, "end": end_date},
        "tweets": tweets,
        "tweet_count": len(tweets),
        "verified_tweets": verified,
        "high_engagement_tweets": high_engagement,
        "regular_tweets": regular
    }


def format_tweets_for_training(tweet_data: Dict) -> str:
    """
    Format tweets for use in training prompts.
    
    Returns formatted string matching our weight system:
    - VERIFIED SOURCES [WEIGHT: HIGH]
    - HIGH ENGAGEMENT [WEIGHT: MEDIUM]
    - REGULAR SIGNALS [WEIGHT: LOW]
    """
    lines = []
    
    if tweet_data.get("verified_tweets"):
        lines.append("=" * 60)
        lines.append("VERIFIED SOURCES [WEIGHT: HIGH - Trust these most]")
        lines.append("=" * 60)
        for tweet in tweet_data["verified_tweets"][:5]:
            lines.append(f'@{tweet["author_username"]} (verified): "{tweet["text"][:200]}"')
            lines.append(f'  -> {tweet["retweets"]} RTs, {tweet["likes"]} likes')
            lines.append("")
    
    if tweet_data.get("high_engagement_tweets"):
        lines.append("=" * 60)
        lines.append("HIGH ENGAGEMENT [WEIGHT: MEDIUM - Viral signals]")
        lines.append("=" * 60)
        for tweet in tweet_data["high_engagement_tweets"][:5]:
            lines.append(f'@{tweet["author_username"]}: "{tweet["text"][:200]}"')
            lines.append(f'  -> {tweet["retweets"]} RTs, {tweet["likes"]} likes')
            lines.append("")
    
    if tweet_data.get("regular_tweets"):
        lines.append("=" * 60)
        lines.append("REGULAR SIGNALS [WEIGHT: LOW - Supplementary context]")
        lines.append("=" * 60)
        for tweet in tweet_data["regular_tweets"][:5]:
            lines.append(f'@{tweet["author_username"]}: "{tweet["text"][:150]}"')
            lines.append(f'  -> {tweet["likes"]} likes')
            lines.append("")
    
    if not lines:
        return "No tweets found for this market."
    
    return "\n".join(lines)


def test_twitter_api():
    """Test TwitterAPI.io with sample queries."""
    print("="*60)
    print("TWITTER API.IO FETCHER - TEST")
    print("="*60)
    
    if not check_api_key():
        return
    
    print("\nAPI key found! Testing with sample queries...\n")
    
    test_cases = [
        {
            "question": "Will Bitcoin reach $125,000 by December 31, 2025?",
            "date": "2025-08-15"
        },
        {
            "question": "Will the Federal Reserve cut rates in 2025?",
            "date": "2025-08-10"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n[Test {i}] {test['question'][:50]}...")
        
        result = fetch_tweets_for_market(
            question=test["question"],
            analysis_date=test["date"],
            days_before=3,
            max_tweets=10
        )
        
        print(f"  Search query: {result['search_query']}")
        print(f"  Tweets found: {result['tweet_count']}")
        print(f"    - Verified: {len(result['verified_tweets'])}")
        print(f"    - High engagement: {len(result['high_engagement_tweets'])}")
        print(f"    - Regular: {len(result['regular_tweets'])}")
        
        if result["tweets"]:
            print(f"  Sample tweet: {result['tweets'][0]['text'][:60]}...")
        
        time.sleep(1)
    
    print("\n" + "="*60)
    print("TWITTER API.IO TEST COMPLETE")
    print("="*60)


def estimate_cost(num_markets: int, tweets_per_market: int = 50) -> float:
    """Estimate the cost for fetching tweets."""
    total_tweets = num_markets * tweets_per_market
    cost = (total_tweets / 1000) * 0.15
    return cost


def fetch_tweets_batch(markets_df: pd.DataFrame, output_file: Path = None) -> pd.DataFrame:
    """
    Fetch tweets for a batch of markets.
    
    Args:
        markets_df: DataFrame with 'question' and 'analysis_date' columns
        output_file: Optional path to save results
    
    Returns:
        DataFrame with tweet data added
    """
    if not check_api_key():
        return pd.DataFrame()
    
    results = []
    
    for idx, row in markets_df.iterrows():
        question = row.get("question", "")
        analysis_date = row.get("analysis_date", "2025-08-01")
        
        print(f"[{idx+1}/{len(markets_df)}] Fetching tweets for: {question[:40]}...")
        
        tweet_data = fetch_tweets_for_market(
            question=question,
            analysis_date=analysis_date,
            days_before=3,
            max_tweets=50
        )
        
        results.append({
            "question": question,
            "analysis_date": analysis_date,
            "search_query": tweet_data["search_query"],
            "tweet_count": tweet_data["tweet_count"],
            "verified_count": len(tweet_data["verified_tweets"]),
            "high_engagement_count": len(tweet_data["high_engagement_tweets"]),
            "tweets_json": json.dumps(tweet_data["tweets"]),
            "formatted_tweets": format_tweets_for_training(tweet_data)
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
    
    parser = argparse.ArgumentParser(description="Fetch tweets for training data")
    parser.add_argument("--test", action="store_true", help="Run test queries")
    parser.add_argument("--check", action="store_true", help="Check API key setup")
    parser.add_argument("--estimate", type=int, help="Estimate cost for N markets")
    parser.add_argument("--question", type=str, help="Single question to fetch tweets for")
    parser.add_argument("--date", type=str, default="2025-08-15", help="Analysis date (YYYY-MM-DD)")
    args = parser.parse_args()
    
    if args.check:
        check_api_key()
    elif args.estimate:
        cost = estimate_cost(args.estimate)
        print(f"Estimated cost for {args.estimate} markets: ${cost:.2f}")
    elif args.test:
        test_twitter_api()
    elif args.question:
        if not check_api_key():
            exit(1)
        print(f"Fetching tweets for: {args.question}")
        result = fetch_tweets_for_market(args.question, args.date)
        print(f"\nSearch query: {result['search_query']}")
        print(f"Tweets: {result['tweet_count']}")
        print("\nFormatted output:")
        print(format_tweets_for_training(result))
    else:
        print("Usage:")
        print("  python fetch_twitter_data.py --check      # Check API key setup")
        print("  python fetch_twitter_data.py --estimate 105  # Estimate cost")
        print("  python fetch_twitter_data.py --test      # Run test queries")
        print("  python fetch_twitter_data.py --question 'Will Bitcoin hit $125k?' --date 2025-08-15")
