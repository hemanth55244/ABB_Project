import pandas as pd
import sys
import os

# Add backend directory to path so modules can be imported
sys.path.append(os.path.abspath('backend'))

from modules.analyzer import analyze_dataset
from modules.detector import detect_problem_type
from modules.recommender import recommend_models
from modules.preprocessing import preprocess_data
from modules.trainer import train_models

try:
    df = pd.read_csv('backend/Clean_Dataset.csv')
    print("Dataset Loaded Successfully.")
    
    analysis = analyze_dataset(df)
    print(f"\nRows: {analysis['rows']}, Columns: {analysis['columns']}")
    print(f"Columns: {analysis['column_names']}")
    
    # We will assume the target column is the last column by default if not specified,
    # or we can just try 'Survived', 'Price', 'Class', 'target' if they exist.
    target_column = df.columns[-1]
    
    for potential_target in ['Survived', 'Price', 'target', 'Class', 'Outcome', 'diagnosis']:
        if potential_target in df.columns:
            target_column = potential_target
            break
            
    print(f"\nDetected Target Column: {target_column}")
    
    problem_type = detect_problem_type(df, target_column)
    print(f"Problem Type: {problem_type}")
    
    models = recommend_models(problem_type)
    print(f"Recommended Models: {models}")
    
    X, y = preprocess_data(df, target_column)
    
    print("\nTraining Models...")
    results = train_models(X, y, problem_type)
    
    print("\n===== NEW RESULTS =====")
    for model, score in results.items():
        print(f"{model}: {round(score, 4)}")
        
except Exception as e:
    print(f"Error: {e}")
