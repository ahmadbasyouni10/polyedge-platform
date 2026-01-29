import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

_client: Client = None

def get_supabase_client() -> Client:
    """Returns a singleton Supabase Client."""
    global _client
    if _client is None:
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")
        _client = create_client(supabase_url, supabase_key)
    return _client
