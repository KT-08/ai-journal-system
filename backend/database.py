from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["journal_db"]
collection = db["entries"]