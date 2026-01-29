import json
import random
from pathlib import Path

def split_data():
    """Split the full dataset into Train, Val, and Test sets."""
    print("Loading data...")
    input_file = Path("data/training/train_god_tier.jsonl")
    
    if not input_file.exists():
        print(f"Error: {input_file} not found!")
        return

    all_examples = []
    with open(input_file) as f:
        for line in f:
            try:
                all_examples.append(json.loads(line))
            except:
                pass
    
    unique_examples = {}
    for ex in all_examples:
        # Use a hash of the full input and question to ensure uniqueness 
        # without killing multi-timepoint data (which has different prices/contexts)
        key = hash(ex['input']) 
        unique_examples[key] = ex
        
    final_examples = list(unique_examples.values())
    
    print(f"Total unique examples: {len(final_examples)}")
    
    random.seed(42)
    random.shuffle(final_examples)
    
    total = len(final_examples)
    train_end = int(total * 0.8)
    val_end = int(total * 0.9)
    
    train = final_examples[:train_end]
    val = final_examples[train_end:val_end]
    test = final_examples[val_end:]
    
    print(f"Saving splits:")
    print(f"  Train: {len(train)}")
    print(f"  Val:   {len(val)}")
    print(f"  Test:  {len(test)}")
    
    output_dir = Path("data/training")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    with open(output_dir / "train.jsonl", "w") as f:
        for ex in train:
            f.write(json.dumps(ex) + "\n")
            
    with open(output_dir / "val.jsonl", "w") as f:
        for ex in val:
            f.write(json.dumps(ex) + "\n")
            
    with open(output_dir / "test.jsonl", "w") as f:
        for ex in test:
            f.write(json.dumps(ex) + "\n")
            
    print("Done!")

if __name__ == "__main__":
    split_data()
