# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.first_routes import router   # ensure routes.py exists in same folder

app = FastAPI()

# ✅ Restrict CORS only to React frontend
origins = [
    "https://resume-parser-1-6hus.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include API routes
app.include_router(router)

# ✅ Root test endpoint
@app.get("/")
def root():
    return {"message": "FastAPI is running!"}
