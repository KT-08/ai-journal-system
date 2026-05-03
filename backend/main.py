from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from database import collection
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

HF_TOKEN = os.environ.get("HF_TOKEN")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-journal-system-zeta.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_emotion(text):
    response = requests.post(
        "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
        headers={"Authorization": f"Bearer {HF_TOKEN}"},
        json={"inputs": text}
    )
    result = response.json()
    return result[0][0]['label']

@app.get("/")
def home():
    return {"message": "AI Journal API is running"}

@app.get("/test-db")
def test_db():
    data = {"test": "MongoDB connection works"}
    collection.insert_one(data)
    return {"message": "Data inserted into MongoDB"}

class Entry(BaseModel):
    title: str
    content: str

@app.post("/create-entry")
def create_entry(entry: Entry):
    emotion = analyze_emotion(entry.content)
    data = {
        "title": entry.title,
        "content": entry.content,
        "emotion": emotion
    }
    collection.insert_one(data)
    return {
        "message": "Journal entry created",
        "emotion": emotion
    }

@app.get("/entries")
def get_entries():
    entries = list(collection.find({}, {"_id": 0}))
    return {"entries": entries}

@app.delete("/delete-entry/{title}")
def delete_entry(title: str):
    result = collection.delete_one({"title": title})
    if result.deleted_count == 0:
        return {"message": "Entry not found"}
    return {"message": "Entry deleted successfully"}

@app.put("/update-entry/{title}")
def update_entry(title: str, new_content: str):
    new_emotion = analyze_emotion(new_content)
    result = collection.update_one(
        {"title": title},
        {
            "$set": {
                "content": new_content,
                "emotion": new_emotion
            }
        }
    )
    if result.matched_count == 0:
        return {"message": "Entry not found"}
    return {
        "message": "Entry updated successfully",
        "new_emotion": new_emotion
    }