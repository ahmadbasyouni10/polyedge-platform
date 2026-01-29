import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture
def api_client():
    return TestClient(app)

@pytest.fixture
def mock_supabase():
    with MagicMock() as mock:
        yield mock

@pytest.fixture
def mock_clerk_user():
    return "user_2test123"

@pytest.fixture
def sample_market():
    return {
        "id": "0x123",
        "question": "Will BTC reach $100k by March?",
        "volume": 500000.0,
        "clobTokenIds": ["token_yes", "token_no"]
    }

@pytest.fixture
def sample_prediction():
    return {
        "market_probability": 0.65,
        "fair_probability": 0.72,
        "edge_percentage": 7.0,
        "action": "BUY",
        "confidence": 85,
        "reasoning": "Strong whale accumulation and Tier 1 news support."
    }
