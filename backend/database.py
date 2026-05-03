from pymongo import MongoClient
import os

# MONGO_URL = "mongodb+srv://KT-08:aijournalsystem@cluster0.yghilni.mongodb.net/?appName=Cluster0"

MONGO_URL = os.environ.get("MONGO_URL", "mongodb+srv://KT-08:aijournalsystem@cluster0.yghilni.mongodb.net/?appName=Cluster0")

client = MongoClient(MONGO_URL)

db = client["journal_db"]
collection = db["entries"]