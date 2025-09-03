# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.first_routes import router   # ensure routes.py exists in same folder

app = FastAPI()

# ✅ Restrict CORS only to React frontend
origins = [
    "http://localhost:3000",  # CRA (default port)
    "http://localhost:5173",  # Vite (default port)
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
