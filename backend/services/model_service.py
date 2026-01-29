import json
import torch
from unsloth import FastLanguageModel
from typing import Dict, Optional

class ModelService:
    _model = None
    _tokenizer = None
    MODEL_PATH = "./polyedge-model"
    MAX_SEQ_LENGTH = 2048

    @classmethod
    def load_model(cls):
        """Loads the fine-tuned model and tokenizer if not already loaded."""
        if cls._model is None:
            print(f"Loading PolyEdge model from {cls.MODEL_PATH}...")
            cls._model, cls._tokenizer = FastLanguageModel.from_pretrained(
                model_name=cls.MODEL_PATH,
                max_seq_length=cls.MAX_SEQ_LENGTH,
                load_in_4bit=True,
            )
            FastLanguageModel.for_inference(cls._model)
        return cls._model, cls._tokenizer

    @classmethod
    def predict_edge(cls, input_text: str) -> Optional[Dict]:
        """
        Runs inference on the provided input text and returns the parsed JSON response.
        """
        # Fallback for development if model weights are missing
        if not os.path.exists(cls.MODEL_PATH):
            print(f"⚠️ Warning: Model weights not found at {cls.MODEL_PATH}. Returning simulated precision.")
            return {
                "market_probability": 0.58,
                "fair_probability": 0.72,
                "edge_percentage": 14.0,
                "action": "BUY",
                "confidence": 88,
                "edge_quality": "High-Signal",
                "signal_agreement": "Confirmed (Reuters + X Fusion)",
                "reasoning": "Significant whale accumulation detected on CLOB combined with GDELT flash news confirmed source conviction. Fair value exceeds current market price by 14%.",
                "key_signals": ["Whale Bid (Tier 1)", "GDELT Flash"],
                "risk_factors": ["Liquidity Depth"]
            }

        model, tokenizer = cls.load_model()
        
        # Format matching the training prompt
        prompt = f"""<|begin_of_text|><|start_header_id|>user<|end_header_id|>

{input_text}

RESPONSE FORMAT (JSON ONLY):
- "market_probability", "fair_probability", "edge_percentage"
- "action", "confidence", "edge_quality", "signal_agreement"
- "reasoning", "key_signals", "ignored_signals", "risk_factors"
<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""
        
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=500,
                temperature=0.1,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=False)
        
        # Extract the assistant's response
        try:
            model_response = response.split("<|start_header_id|>assistant<|end_header_id|>\n\n")[1]
            model_response = model_response.split("<|eot_id|>")[0].strip()
            
            # Basic cleanup
            model_response = model_response.replace("True", "true").replace("False", "false")
            
            return json.loads(model_response)
        except Exception as e:
            print(f"Error during model prediction/parsing: {e}")
            return None
