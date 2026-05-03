from pymongo import MongoClient

MONGO_URL = "mongodb+srv://KT-08:aijournalsystem@cluster0.yghilni.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URL)

db = client["journal_db"]
collection = db["entries"]