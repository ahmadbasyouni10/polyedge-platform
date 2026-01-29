import json
import os
import time
import random
import pandas as pd
from typing import List, Dict
from anthropic import Anthropic
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv()

# Configuration
INPUT_FILES = ["data/raw/god_tier_news_bank.jsonl", "data/training/train.jsonl"]
OUTPUT_FILE = "data/training/train_god_tier.jsonl"
CORE_SAMPLES_TARGET = 1000  # We will augment if needed
CLAUDE_MODEL = "claude-sonnet-4-5"

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are the world's most elite Polymarket trading analyst. 
Your goal is to explain WHY specific news signals lead to real-world outcomes.

TRADING MENTALITY:
You are analyzing a PAST market, but your reasoning should feel like a "Deep Dive" that identifies the winning signal. 

RULES:
1. NO CHEATING: Do NOT say "Because the hindsight resolution was X...". 
2. LOGICAL CONNECTION: Instead, say "The critical signal was [Source X], which indicated a 95% probability of [Outcome], making the [Market Price] a massive mispricing."
3. NUANCE: Explain why the market was wrong (e.g., "traders overreacted to X" or "ignored Y").
4. FORMAT: Valid JSON only.

SCORING SYSTEM:
- TIER 1 [3x weight]: Professional journalism.
- TIER 2 [2x weight]: High-engagement verified analysts.
- TIER 4 [1x weight]: Regular news/commentary.
- TIER 5 [0x weight]: Suspicious/New accounts - IGNORE.

JSON SCHEMA:
{
  "market_probability": int,
  "fair_probability": int,
  "edge_percentage": int,
  "action": "BUY_YES" | "BUY_NO" | "HOLD",
  "confidence": int (0-100),
  "edge_quality": "strong" | "moderate" | "weak",
  "reasoning": "Explain the analysis here. Connect news signals to the outcome.",
  "key_signals": ["..."],
  "risk_factors": ["..."]
}"""

def get_claude_analysis(news_context: str) -> Dict:
    """Gets a high-fidelity analysis from Claude 3.5 Sonnet."""
    try:
        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=1000,
            temperature=0.8, # Slightly higher temp for diversity in reasoning
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": f"Analyze this market data and news context:\n\n{news_context}"}
            ]
        )
        # Extract JSON from the response
        content = response.content[0].text
        # Cleanup if Claude accidentally adds markdown
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        return json.loads(content)
    except Exception as e:
        print(f"Error calling Claude: {e}")
        return None

def main():
    print(f"🚀 Starting God-Tier Data Generation ({CLAUDE_MODEL})")
    
    # 1. Collect all unique inputs from existing data
    raw_inputs = []
    seen_questions = set()
    
    # Load Ground Truth for Hindsight
    print("📊 Loading PolyMarket Ground Truth for Hindsight...")
    markets_df = pd.read_csv("data/raw/polymarket_markets.csv", low_memory=False)
    resolution_map = {}
    for _, row in markets_df.iterrows():
        q = str(row['question'])
        prices = str(row['outcomePrices'])
        if q and prices != 'nan':
            resolution_map[q] = prices

    for file in INPUT_FILES:
        if os.path.exists(file):
            print(f"Reading {file}...")
            with open(file, "r") as f:
                for line in f:
                    try:
                        data = json.loads(line)
                        # Handle News Bank Format
                        if "news_context" in data:
                            q = data['question']
                            res = resolution_map.get(q, "UNKNOWN")
                            input_text = f"MARKET ANALYSIS REQUEST\n"
                            input_text += f"Question: {q}\n"
                            input_text += f"Current YES Price: 50%\n"
                            input_text += f"Volume: ${data['volume']}\n"
                            input_text += f"ACTUAL RESOLUTION (HINDSIGHT): {res}\n\n"
                            input_text += data["news_context"]
                            question = q
                        # Handle Existing train.jsonl
                        elif "input" in data:
                            input_text = data["input"]
                            question = input_text.split("\n")[1] if "\n" in input_text else input_text[:50]
                        else:
                            continue
                            
                        if question not in seen_questions:
                            raw_inputs.append(input_text)
                            seen_questions.add(question)
                    except:
                        continue

    print(f"Found {len(raw_inputs)} unique market stories to re-process.")
    
    # 2. Augmentation Layer (If we need 1000 but only have 361)
    # We will "perturb" prices and news to create variants
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else CORE_SAMPLES_TARGET
    
    augmented_inputs = []
    while len(augmented_inputs) < limit:
        for original in raw_inputs:
            if len(augmented_inputs) >= CORE_SAMPLES_TARGET:
                break
            
            # Variant 1: Original
            if len(augmented_inputs) == 0 or random.random() > 0.5:
                augmented_inputs.append(original)
            else:
                # Variant 2: Slightly changed price to create different "Edges"
                lines = original.split("\n")
                new_lines = []
                for line in lines:
                    if "Current YES Price:" in line:
                        # Randomly shift price by +/- 5-15%
                        try:
                            price = int(line.split(":")[1].strip().replace("%", ""))
                            # Create an "Opposite" price scenario half the time
                            if random.random() > 0.8:
                                new_price = 100 - price
                            else:
                                new_price = max(5, min(95, price + random.randint(-15, 15)))
                            new_lines.append(f"Current YES Price: {new_price}%")
                        except:
                            new_lines.append(line)
                    else:
                        new_lines.append(line)
                augmented_inputs.append("\n".join(new_lines))

    print(f"Target count: {len(augmented_inputs)} samples.")

    # 3. Process with Claude
    success_count = 0
    existing_inputs = set()
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r") as f_in:
            for line in f_in:
                try:
                    existing_inputs.add(json.loads(line)["input"])
                except:
                    continue
    
    print(f"Resuming: Found {len(existing_inputs)} existing samples.")
    
    with open(OUTPUT_FILE, "a") as f_out:
        pbar = tqdm(total=len(augmented_inputs))
        # Update pbar to show existing progress
        pbar.update(len(existing_inputs))
        
        for full_context in augmented_inputs:
            # CLEAN the input for the Llama model (remove Hindsight line)
            llama_input = "\n".join([line for line in full_context.split("\n") if "ACTUAL RESOLUTION (HINDSIGHT):" not in line])
            
            # Skip if already exists
            if llama_input in existing_inputs:
                continue
                
            if success_count + len(existing_inputs) >= limit:
                break
                
            analysis = get_claude_analysis(full_context) # Claude sees the Hindsight
            
            if analysis:
                entry = {
                    "input": llama_input, # Llama only sees the News + Prices
                    "output": json.dumps(analysis),
                    "metadata": {"generated_at": time.time(), "model": CLAUDE_MODEL}
                }
                f_out.write(json.dumps(entry) + "\n")
                f_out.flush() # Save progress
                success_count += 1
            
            pbar.update(1)
            # Avoid hitting rate limits too hard (tier dependent)
            time.sleep(1.0) 
            
    print(f"\n✅ SUCCESS: Generated {success_count} God-Tier examples.")
    print(f"File saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
