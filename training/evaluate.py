# training/evaluate.py
"""
Evaluate the fine-tuned PolyEdge model on test data.

Tests:
1. JSON validity - can the model produce valid JSON?
2. Action accuracy - does it predict the same action as Claude?
3. Edge direction - BUY_YES/BUY_NO alignment
4. Confidence calibration - are high confidence predictions more accurate?
"""

import json
import os
import torch

os.chdir("/home/ahmadb10/polymarketbot")

print("=" * 60)
print("POLYEDGE MODEL EVALUATION")
print("=" * 60)

# Load the fine-tuned model using Unsloth (loads adapters on top of 4-bit base)
print("\n[1/3] Loading model + adapters...")
from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "./polyedge-model", # This path contains the adapters
    max_seq_length = 2048,
    load_in_4bit = True,
)
FastLanguageModel.for_inference(model) # Enable 2x faster inference
print(f"  Model loaded from: ./polyedge-model")

# Load test data
print("\n[2/3] Loading test data...")
test_examples = []
with open("data/training/test.jsonl") as f:
    for line in f:
        test_examples.append(json.loads(line))
print(f"  Test examples: {len(test_examples)}")

# Evaluation metrics
results = {
    "total": 0,
    "valid_json": 0,
    "action_correct": 0,
    "edge_direction_correct": 0,
    "high_conf_correct": 0,
    "high_conf_total": 0,
}

print("\n[3/3] Running evaluation...")
print("-" * 60)

for i, example in enumerate(test_examples):
    results["total"] += 1
    
    # Official Llama 3.1 Instruct Format
    prompt = f"""<|begin_of_text|><|start_header_id|>user<|end_header_id|>

{example['input']}

RESPONSE FORMAT (JSON ONLY):
- "market_probability", "fair_probability", "edge_percentage"
- "action", "confidence", "edge_quality", "signal_agreement"
- "reasoning", "key_signals", "ignored_signals", "risk_factors"
<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""
    
    # Generate prediction
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=1024,
            temperature=0.1,  # Low temp for consistent outputs
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id,
        )
    
    # Decode and extract the model's response
    full_output = tokenizer.decode(outputs[0], skip_special_tokens=False)
    
    # Extract assistant response
    try:
        model_response = full_output.split("<|start_header_id|>assistant<|end_header_id|>\n\n")[1]
        model_response = model_response.split("<|eot_id|>")[0].strip()
    except:
        model_response = ""
    
    # Robust cleanup for common LLM JSON errors
    if model_response:
        # Fix Python booleans
        model_response = model_response.replace("True", "true").replace("False", "false")
        # Fix single quotes (optional, but good safety)
        if "'" in model_response and '"' not in model_response:
            model_response = model_response.replace("'", '"')
    
    # Parse predicted JSON
    try:
        pred = json.loads(model_response)
        results["valid_json"] += 1
        
        # Get ground truth
        true = json.loads(example["output"])
        
        # Check action match
        if pred.get("action") == true.get("action"):
            results["action_correct"] += 1
        
        # Check edge direction (BUY_YES vs BUY_NO)
        pred_direction = "YES" if pred.get("action") == "BUY_YES" else "NO" if pred.get("action") == "BUY_NO" else "HOLD"
        true_direction = "YES" if true.get("action") == "BUY_YES" else "NO" if true.get("action") == "BUY_NO" else "HOLD"
        if pred_direction == true_direction:
            results["edge_direction_correct"] += 1
        
        # Check high confidence predictions (confidence > 70)
        if pred.get("confidence", 0) > 70:
            results["high_conf_total"] += 1
            if pred.get("action") == true.get("action"):
                results["high_conf_correct"] += 1
        
        status = "✓" if pred.get("action") == true.get("action") else "✗"
        print(f"[{i+1}/{len(test_examples)}] {status} | Pred: {pred.get('action'):10} | True: {true.get('action'):10} | Conf: {pred.get('confidence', '?')}%")
        
        if status == "✗":
            print("\n" + "!" * 40)
            print("FAILED PREDICTION DEBUG:")
            print(f"Question: {example['input'].split('\n')[1]}")
            print(f"Model Reasoning: {pred.get('reasoning')}")
            print(f"Ground Truth Reasoning: {true.get('reasoning')}")
            print("!" * 40 + "\n")
            
    except json.JSONDecodeError as e:
        print(f"[{i+1}/{len(test_examples)}] ✗ INVALID JSON: {model_response[:100]}...")
        print(f"Full Response: {model_response}")
    except Exception as e:
        print(f"[{i+1}/{len(test_examples)}] ✗ ERROR: {str(e)[:50]}")

# Print results
print("\n" + "=" * 60)
print("EVALUATION RESULTS")
print("=" * 60)

json_rate = 100 * results["valid_json"] / results["total"] if results["total"] > 0 else 0
action_rate = 100 * results["action_correct"] / results["total"] if results["total"] > 0 else 0
direction_rate = 100 * results["edge_direction_correct"] / results["total"] if results["total"] > 0 else 0
high_conf_rate = 100 * results["high_conf_correct"] / results["high_conf_total"] if results["high_conf_total"] > 0 else 0

print(f"""
Metric                  Score       Target
------                  -----       ------
JSON Validity:          {json_rate:.1f}%       > 95%
Action Accuracy:        {action_rate:.1f}%       > 70%
Edge Direction:         {direction_rate:.1f}%       > 65%
High Conf Accuracy:     {high_conf_rate:.1f}%       > 80%

Total test examples:    {results['total']}
Valid JSON outputs:     {results['valid_json']}
Correct actions:        {results['action_correct']}
High confidence calls:  {results['high_conf_total']}
""")

# Verdict
if action_rate >= 70 and json_rate >= 95:
    print("🎉 VERDICT: Model is READY for production!")
elif action_rate >= 60:
    print("⚠️  VERDICT: Model needs more training data (generate 200+ more examples)")
elif action_rate >= 40:
    print("⚠️  VERDICT: Model is learning but needs 500+ examples for production")
else:
    print("❌ VERDICT: Model needs significant improvement (check data quality)")

print("=" * 60)
