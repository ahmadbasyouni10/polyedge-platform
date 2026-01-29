import requests
import os
from typing import Dict, Any

class NotificationService:
    """
    Handles alerts across different channels (Discord, Telegram).
    """
    
    @staticmethod
    def send_discord_alert(webhook_url: str, prediction_data: Dict[str, Any], market_url: str):
        """
        Sends a high-fidelity Discord embed alert.
        """
        color = 0x00ff00 if prediction_data.get("action") == "BUY_YES" else 0xff0000
        if prediction_data.get("action") == "HOLD":
            color = 0x808080

        embed = {
            "title": f"🔥 EDGE DETECTED: {prediction_data.get('action')}",
            "description": f"**Market**: {prediction_data.get('question', 'Unknown Market')}",
            "url": market_url,
            "color": color,
            "fields": [
                {
                    "name": "Market Prob",
                    "value": f"{prediction_data.get('market_probability', 0)}%",
                    "inline": True
                },
                {
                    "name": "Fair Prob",
                    "value": f"{prediction_data.get('fair_probability', 0)}%",
                    "inline": True
                },
                {
                    "name": "Edge",
                    "value": f"+{prediction_data.get('edge_percentage', 0)}%",
                    "inline": True
                },
                {
                    "name": "Confidence",
                    "value": f"{prediction_data.get('confidence', 0)}%",
                    "inline": True
                },
                {
                    "name": "Reasoning",
                    "value": prediction_data.get("reasoning", "No reasoning provided.")[:1024]
                }
            ],
            "footer": {
                "text": "PolyEdge AI | High-Accuracy Signal Engine"
            }
        }
        
        try:
            response = requests.post(webhook_url, json={"embeds": [embed]})
            response.raise_for_status()
            print(f"Discord alert sent for market.")
        except Exception as e:
            print(f"Failed to send Discord alert: {e}")

    @staticmethod
    def send_telegram_alert(bot_token: str, chat_id: str, prediction_data: Dict[str, Any], market_url: str):
        """
        Sends a professional Telegram alert.
        """
        message = (
            f"🚀 *POLYEDGE ALERT*\n\n"
            f"📝 *Market*: {prediction_data.get('question')}\n"
            f"🎯 *Action*: {prediction_data.get('action')}\n"
            f"💰 *Edge*: +{prediction_data.get('edge_percentage')}% | *Conf*: {prediction_data.get('confidence')}%\n\n"
            f"🧠 *Reasoning*: {prediction_data.get('reasoning')}\n\n"
            f"🔗 [Analyze on Dashboard]({market_url})"
        )
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        params = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        try:
            response = requests.post(url, params=params)
            response.raise_for_status()
            print(f"Telegram alert sent.")
        except Exception as e:
            print(f"Failed to send Telegram alert: {e}")
