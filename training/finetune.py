"""
Fine-tune Gemma 9b on PolyEdge training data using LoRA/QLoRA.
The model learns to analyze Polymarket data and detect edges like Claude does.

Input: Market question + price history + news + tweets (5-tier weighted)
Output: JSON with edge analysis (action, confidence, reasoning, etc.)
"""

from unsloth import FastLanguageModel
from trl import SFTTrainer
from transformers import TrainingArguments
from datasets import load_dataset
import os
import torch

os.chdir("/home/ahmadb10/polymarketbot")

print("=" * 60)
print("POLYEDGE FINE-TUNING (16-BIT MODE)")
print("=" * 60)

print("\n[1/5] Loading Llama 3.1 8B model (4-bit QLoRA) - OPTIMIZED...")
model, tokenizer = FastLanguageModel.from_pretrained(
    "unsloth/meta-llama-3.1-8b-instruct-bnb-4bit",
    max_seq_length=2048,  # LOWERED for stability on 12GB Card
    load_in_4bit=True,
    dtype=None,
)

print("\n[2/5] Adding LoRA adapters...")
model = FastLanguageModel.get_peft_model(
    model,
    r=32,            # Balanced for memory vs reasoning
    lora_alpha=64,   # 2x rank
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    
    lora_dropout=0, 
    bias="none",
    use_gradient_checkpointing="unsloth", 
)

print("\n[3/5] Loading GOD-TIER training data...")
dataset = load_dataset("json", data_files={
    "train": "data/training/train.jsonl",
    "validation": "data/training/val.jsonl"
})
print(f"  Train: {len(dataset['train'])} examples")
print(f"  Validation: {len(dataset['validation'])} examples")

def format_for_training(example):
    """
    Official Llama 3.1 Instruct Format.
    """
    text = f"""<|begin_of_text|><|start_header_id|>user<|end_header_id|>

{example['input']}

RESPONSE FORMAT (JSON ONLY):
- "market_probability", "fair_probability", "edge_percentage"
- "action", "confidence", "edge_quality", "signal_agreement"
- "reasoning", "key_signals", "ignored_signals", "risk_factors"
<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{example['output']}<|eot_id|>"""
    return {"text": text}

print("\n[4/5] Formatting data for Gemma...")
train_dataset = dataset["train"].map(format_for_training)
val_dataset = dataset["validation"].map(format_for_training)
print("\n[5/5] Starting training...")
print("  - 3 epochs (forced generalization)")
print("  - Batch size: 2 (x4 accumulation = effective 8)")
print("  - Learning rate: 2e-4")
print("  - Estimated time: 1-2 hours on RTX 3060")

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    dataset_text_field="text",
    max_seq_length=2048,
    args=TrainingArguments(
        output_dir="./checkpoints",
        per_device_train_batch_size=1, 
        gradient_accumulation_steps=16, # Increased for stability
        warmup_steps=5,
        max_steps=-1,              
        num_train_epochs=3,        # REDUCED: Force model to learn rules, not memorization
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        eval_strategy="steps",
        eval_steps=10,
        save_steps=50,             # Save less frequently
        optim="adamw_8bit",        
        weight_decay=0.1,          # INCREASED: Strong regularization for generalization
        lr_scheduler_type="cosine",
        report_to="none",  
    ),
)

trainer.train()

print("\n" + "=" * 60)
print("SAVING MODEL")
print("=" * 60)
model.save_pretrained("./polyedge-model")
tokenizer.save_pretrained("./polyedge-model")
print(f"Model saved to: ./polyedge-model")

print("\nSaving merged model (LoRA + base)...")
model.save_pretrained_merged("./polyedge-model-merged", tokenizer, save_method="merged_16bit")
print(f"Merged model saved to: ./polyedge-model-merged")

print("\n" + "=" * 60)
print("TRAINING COMPLETE!")
print("Next: python training/evaluate.py")
print("=" * 60)
