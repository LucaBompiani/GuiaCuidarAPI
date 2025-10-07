import os
from dotenv import load_dotenv
from dataclasses import dataclass

load_dotenv(override=True)

@dataclass
class Settings:
    supabase_url: str = os.getenv("SUPABASE_URL")
    supabase_key: str = os.getenv("SUPABASE_KEY")