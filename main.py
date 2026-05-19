import warnings
warnings.filterwarnings("ignore")

import pandas as pd

from modules.analyzer import analyze_dataset
from modules.detector import detect_problem_type
from modules.recommender import recommend_models
from modules.preprocessing import preprocess_data
from modules.trainer import train_models

from modules.visualizer import (
    plot_missing_values,
    plot_correlation_heatmap,
    plot_model_performance
)

# =========================
# LOAD DATASET
# =========================

df = pd.read_csv("dataset.csv")

# =========================
# DATASET ANALYSIS
# =========================

analyze_dataset(df)

# =========================
# TARGET COLUMN
# =========================

target_column = input(
    "\nEnter target column "
    "(Leave empty for clustering): "
)

# =========================
# DETECT PROBLEM TYPE
# =========================

problem_type = detect_problem_type(
    df,
    target_column
)

print(f"\nProblem Type: {problem_type}")

# =========================
# RECOMMEND MODELS
# =========================

models = recommend_models(
    problem_type
)

print("\nRecommended Models:")

for model in models:
    print(model)

# =========================
# PREPROCESS DATA
# =========================

X, y = preprocess_data(
    df,
    target_column
)

# =========================
# TRAIN MODELS
# =========================

results = train_models(
    X,
    y,
    problem_type
)

# =========================
# DISPLAY RESULTS
# =========================

print("\n===== MODEL PERFORMANCE =====")

for model, score in results.items():

    print(
        f"{model}: "
        f"{round(score, 4)}"
    )

# =========================
# VISUALIZATIONS
# =========================

plot_missing_values(df)

plot_correlation_heatmap(
    pd.concat([X, pd.DataFrame(y)], axis=1)
    if y is not None else X
)

plot_model_performance(
    results,
    problem_type
)