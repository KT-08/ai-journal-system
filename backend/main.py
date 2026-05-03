from fastapi import FastAPI
from database import collection
from transformers import pipeline
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

emotion_analyzer = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    result = emotion_analyzer(entry.content)
    emotion = result[0]['label']

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

    # Analyze new emotion
    result_ai = emotion_analyzer(new_content)
    new_emotion = result_ai[0]['label']

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

