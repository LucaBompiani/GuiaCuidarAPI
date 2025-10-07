import os
from supabase import create_client, Client

from app.core.config import Settings

# Validate required environment variables
required_vars = ["SUPABASE_URL", "SUPABASE_KEY"]
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Create global Supabase client
settings = Settings()
supabase_client: Client = create_client(settings.supabase_url, settings.supabase_key)

def get_supabase_client() -> Client:
    """
    Get the global Supabase client instance.
    
    Returns:
        Client: The Supabase client instance
    """
    return supabase_client

def test_connection() -> bool:
    """
    Test the Supabase connection.
    
    Returns:
        bool: True if connection is successful, False otherwise
    """
    try:
        # Try to fetch a simple query to test connection
        result = supabase_client.table("users").select("*").limit(1).execute()
        return True
    except Exception as e:
        print(f"Connection test failed: {e}")
        return False