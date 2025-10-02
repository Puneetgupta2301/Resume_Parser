from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.first_routes import router   # make sure path is correct

app = FastAPI()

# 🔹 Your deployed frontend URL (Render gives you one when frontend service is live)
origins = [
    "https://resume-parser-1-6hus.onrender.com",  # your frontend
    "http://localhost:5173",  # optional: for local React dev testing
]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(router)

# Health check endpoint
@app.get("/")
def root():
    return {"message": "🚀 FastAPI is running!"}
