from typing import List, Dict

class PromptBuilder:
    """
    The 'Contract' between the Backend and the Model.
    Ensures that live data is formatted EXACTLY like the training data.
    """
    
    @staticmethod
    def build_analysis_input(
        question: str, 
        current_price: float, 
        volume: float, 
        news_context: str
    ) -> str:
        """
        Formats raw market data into the 'input' string the model expects.
        """
        # Header matches training headers in generate_god_tier_data.py
        input_text = f"MARKET ANALYSIS REQUEST\n"
        input_text += f"Question: {question}\n"
        input_text += f"Current YES Price: {int(current_price * 100)}%\n"
        input_text += f"Volume: ${volume:,.2f}\n\n"
        
        # news_context should already contain the Tiered formatting 
        # (e.g., TIER 1: VERIFIED SOURCES...)
        input_text += news_context
        
        return input_text

    @staticmethod
    def format_news_snippet(source: str, tier: int, content: str, engagement: str = "") -> str:
        """
        Formats a single news/tweet signal into the tiered format.
        """
        if engagement:
            return f"- {source} (TIER {tier}): \"{content}\" [{engagement}]\n"
        return f"- {source} (TIER {tier}): \"{content}\"\n"
