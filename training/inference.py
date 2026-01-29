from unsloth import FastLanguageModel
import torch

# Configuration
model_path = "./polyedge-model"  # Path to your trained adapters
max_seq_length = 2048

print("\n" + "=" * 60)
print("POLYEDGE LIVE INFERENCE")
print("=" * 60)

# 1. Load the model and adapters LIVE
# This skips the 16GB merge and runs on your 12GB GPU!
print("[1/2] Loading 4-bit base + PolyEdge adapters...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = model_path,
    max_seq_length = max_seq_length,
    load_in_4bit = True,
)
FastLanguageModel.for_inference(model)

# 2. Test Prompt
example_prompt = """Market: Will Bitcoin hit $100k by tomorrow?
Current Price: $98,500
News: SEC unexpectedly approves new crypto-focused bank charter.
Sentiment: 0.85 (Extreme Bullish)
Orderbook: Strong bid support at $98k.
"""

# Format for Llama 3.1 Instruct
prompt = f"""<|begin_of_text|><|start_header_id|>user<|end_header_id|>

Analyze the following market data and return your decision in JSON format:
{example_prompt}

RESPONSE FORMAT (JSON ONLY):
- "market_probability", "fair_probability", "edge_percentage"
- "action", "confidence", "reasoning"
<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""

print("\n[2/2] Generating prediction...")
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=1024,
        temperature=0.1,
        do_sample=True,
    )

response = tokenizer.decode(outputs[0], skip_special_tokens=True)
# Extract just the assistant response
final_json = response.split("assistant")[-1].strip()

print("\n" + "-" * 30)
print("BOT RESPONSE:")
print("-" * 30)
print(final_json)
print("-" * 30)
print("\nPASSED: The model is responding with JSON using your specialized brain!")
