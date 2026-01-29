import pytest
from unittest.mock import patch, MagicMock
from backend.services.context_service import ContextService
from backend.services.betting_service import BettingService
from backend.utils.prompt_builder import PromptBuilder

def test_context_formatting():
    """Test that the God-Tier context formatting correctly tiers news/tweets."""
    mock_news = [{"domain": "reuters.com", "title": "Fed likely to cut"}]
    mock_tweets = [
        {"author": {"userName": "whale_quanter", "isBlueVerified": True}, "text": "Huge buy incoming"},
        {"author": {"userName": "random_guy", "isBlueVerified": False}, "text": "I think it drops"}
    ]
    
    formatted = ContextService._format_context(mock_news, mock_tweets)
    
    assert "TIER 1: VERIFIED SOURCES" in formatted
    assert "reuters.com" in formatted
    assert "@whale_quanter" in formatted
    assert "(verified)" in formatted
    assert "TIER 4/5" in formatted
    assert "@random_guy" in formatted

def test_risk_validation():
    """Test the betting risk engine."""
    profile = {
        "min_edge_threshold": 5.0,
        "min_confidence_threshold": 70
    }
    
    # Passing prediction
    good_pred = {"edge_percentage": 6.5, "confidence": 80}
    assert BettingService.validate_risk(profile, good_pred) is True
    
    # Failing edge
    bad_edge = {"edge_percentage": 3.0, "confidence": 80}
    assert BettingService.validate_risk(profile, bad_edge) is False
    
    # Failing confidence
    bad_conf = {"edge_percentage": 10.0, "confidence": 50}
    assert BettingService.validate_risk(profile, bad_conf) is False

def test_prompt_contract():
    """Ensure the prompt matches the training data format."""
    question = "Test Question?"
    price = 0.44
    vol = 1000.0
    ctx = "MOCK CONTEXT"
    
    prompt = PromptBuilder.build_analysis_input(question, price, vol, ctx)
    
    assert "MARKET ANALYSIS REQUEST" in prompt
    assert "Question: Test Question?" in prompt
    assert "Current YES Price: 44%" in prompt
    assert "Volume: $1,000.00" in prompt
    assert "MOCK CONTEXT" in prompt

def test_bet_size_calculation():
    """Test dynamic bet sizing based on confidence."""
    max_usd = 1000.0
    
    # 100% confidence
    assert BettingService.calculate_bet_size(max_usd, 100) == 1000.0
    # 50% confidence
    assert BettingService.calculate_bet_size(max_usd, 50) == 500.0
    # 0% confidence
    assert BettingService.calculate_bet_size(max_usd, 0) == 0.0
