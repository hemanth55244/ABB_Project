from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os

from modules.analyzer import analyze_dataset
from modules.detector import detect_problem_type
from modules.recommender import recommend_models
from modules.preprocessing import preprocess_data
from modules.trainer import train_models

app = FastAPI(title="Aura AI Platform API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for simplicity (for the session)
DATA_STORE = {
    "df": None,
    "analysis": None,
    "target_column": None,
    "problem_type": None,
    "models_recommended": None,
    "results": None
}

@app.get("/")
def read_root():
    return {"message": "Welcome to Aura AI Platform API"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        DATA_STORE["df"] = df
        
        # Automatically run analysis
        analysis = analyze_dataset(df)
        DATA_STORE["analysis"] = analysis
        
        # Save a copy locally if needed
        df.to_csv("dataset.csv", index=False)
        
        return {
            "message": "File uploaded successfully.",
            "analysis": analysis,
            "columns": df.columns.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/configure")
async def configure_target(target_column: str = Form(...)):
    df = DATA_STORE.get("df")
    if df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded yet.")
    
    if target_column and target_column not in df.columns:
        raise HTTPException(status_code=400, detail="Target column not found in dataset.")
    
    DATA_STORE["target_column"] = target_column
    
    problem_type = detect_problem_type(df, target_column)
    DATA_STORE["problem_type"] = problem_type
    
    recommended = recommend_models(problem_type)
    DATA_STORE["models_recommended"] = recommended
    
    return {
        "problem_type": problem_type,
        "recommended_models": recommended
    }

@app.post("/api/train")
async def train():
    df = DATA_STORE.get("df")
    target_column = DATA_STORE.get("target_column")
    problem_type = DATA_STORE.get("problem_type")
    
    if df is None or problem_type is None:
        raise HTTPException(status_code=400, detail="Workflow not fully configured yet.")
    
    # Preprocess
    X, y = preprocess_data(df, target_column)
    
    # Train
    results = train_models(X, y, problem_type)
    DATA_STORE["results"] = results
    
    # Transform results for Recharts
    chart_data = [{"name": model, "score": score} for model, score in results.items()]
    
    return {
        "results": results,
        "chartData": chart_data
    }

@app.get("/api/status")
def get_status():
    return {
        "has_data": DATA_STORE["df"] is not None,
        "is_configured": DATA_STORE["problem_type"] is not None,
        "is_trained": DATA_STORE["results"] is not None
    }

@app.get("/api/data")
def get_data():
    df = DATA_STORE.get("df")
    return {
        "analysis": DATA_STORE.get("analysis"),
        "columns": df.columns.tolist() if df is not None else [],
        "target_column": DATA_STORE.get("target_column"),
        "problem_type": DATA_STORE.get("problem_type"),
        "models_recommended": DATA_STORE.get("models_recommended"),
        "results": DATA_STORE.get("results"),
    }

@app.get("/api/analytics")
def get_analytics():
    """Return full rich analytics for the Smart Analytics and Dashboard pages."""
    analysis = DATA_STORE.get("analysis")
    if analysis is None:
        raise HTTPException(status_code=404, detail="No dataset loaded yet.")
    return analysis

@app.on_event("startup")
def auto_load_economy_csv():
    """Auto-load economy.csv on startup so UI shows real data immediately."""
    csv_path = os.path.join(os.path.dirname(__file__), "economy.csv")
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            DATA_STORE["df"] = df
            DATA_STORE["analysis"] = analyze_dataset(df)
            print(f"[startup] Loaded economy.csv — {df.shape[0]} rows, {df.shape[1]} cols")
        except Exception as e:
            print(f"[startup] Failed to load economy.csv: {e}")
