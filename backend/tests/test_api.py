import pytest
from unittest.mock import patch

def test_root(api_client):
    response = api_client.get("/")
    assert response.status_code == 200
    assert response.json()["version"] == "1.0.0"

def test_health(api_client):
    response = api_client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

@patch("backend.main.get_supabase_client")
def test_get_markets(mock_supabase_getter, api_client):
    mock_supabase = mock_supabase_getter.return_value
    mock_supabase.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value.data = [
        {"id": "1", "question": "Test Market"}
    ]
    
    response = api_client.get("/markets")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["question"] == "Test Market"

@patch("backend.main.PolymarketService.get_market_details")
@patch("backend.main.AnalysisOrchestrator.analyze_market_live")
def test_analyze_url_logged_out(mock_analyze, mock_details, api_client):
    mock_details.return_value = {
        "conditionId": "0x123",
        "question": "Will BTC reach $100k?",
        "volume": 1000000,
        "outcomePrices": ["0.45", "0.55"]
    }
    mock_analyze.return_value = {
        "edge_percentage": 12.5,
        "reasoning": "Strong news"
    }
    
    payload = {"url": "https://polymarket.com/event/will-btc-reach-100k"}
    response = api_client.post("/analyze-url", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["is_teaser"] is True
    assert data["action"] == "LOCKED"
    assert "Sign in with Clerk" in data["reasoning"]

@patch("backend.main.PolymarketService.get_market_details")
@patch("backend.main.AnalysisOrchestrator.analyze_market_live")
def test_analyze_url_logged_in(mock_analyze, mock_details, api_client):
    mock_details.return_value = {
        "conditionId": "0x123",
        "question": "Will BTC reach $100k?",
        "volume": 1000000,
        "outcomePrices": ["0.45", "0.55"]
    }
    mock_analyze.return_value = {
        "edge_percentage": 12.5,
        "reasoning": "Strong news"
    }
    
    payload = {"url": "https://polymarket.com/event/will-btc-reach-100k"}
    headers = {"x-user-id": "user_2test123"}
    response = api_client.post("/analyze-url", json=payload, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert "is_teaser" not in data
    assert data["edge_percentage"] == 12.5
    assert data["reasoning"] == "Strong news"
