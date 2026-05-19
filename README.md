# AI-Powered AutoML Assistant

An intelligent AutoML assistant that analyzes a CSV dataset, detects whether the task is classification or regression, preprocesses the data, recommends models, trains them with cross-validation, and visualizes the results automatically.

This project is designed to reduce manual machine learning work and make the workflow easier for users who do not want to build every step from scratch.

## Features

- Loads datasets from CSV files
- Analyzes dataset shape, column names, data types, and missing values
- Detects the target column and infers the problem type
- Handles missing values automatically
- Encodes categorical columns with label encoding
- Scales numerical features with standardization
- Recommends suitable machine learning models
- Trains multiple models using cross-validation
- Displays model performance results
- Generates visualizations for missing values, correlations, and model comparison

## Project Workflow

1. Load the dataset from `dataset.csv`
2. Analyze the dataset structure
3. Ask the user to enter the target column
4. Detect whether the problem is classification or regression
5. Recommend appropriate machine learning models
6. Preprocess the data
7. Train the models
8. Compare model scores
9. Display plots and insights

## Dataset Inputs Considered

The assistant works with CSV datasets that may include:

- Numerical features such as age, salary, fare, marks, etc.
- Categorical features such as gender, city, species, etc.
- Missing or null values
- A user-selected target column

## Machine Learning Tasks Supported

### Classification
Used when the target column contains categories, labels, or discrete values.

Recommended models:

- Logistic Regression
- Decision Tree
- Random Forest

### Regression
Used when the target column contains continuous numeric values.

Recommended models:

- Linear Regression
- Decision Tree Regressor
- Random Forest Regressor

## Evaluation Metrics

### Classification
- Accuracy
- Precision
- Recall
- F1 Score

### Regression
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- R2 Score

## Visualizations

The project generates the following plots:

- Missing value bar chart
- Correlation heatmap
- Model performance comparison chart

## Project Structure

```text
ABB/
├── dataset.csv
├── main.py
└── modules/
    ├── analyzer.py
    ├── detector.py
    ├── evaluator.py
    ├── preprocessing.py
    ├── recommender.py
    ├── trainer.py
    └── visualizer.py
```

## Requirements

Install the required Python libraries:

```bash
pip install pandas scikit-learn matplotlib seaborn
```

## How to Run

1. Open a terminal in the project folder.
2. Run the main script:

```bash
python main.py
```

3. When prompted, enter the target column name from the dataset.

Example using the provided Titanic dataset:

- Target column: `Survived`

## Example Output

```text
===== DATASET ANALYSIS =====
Rows: 891
Columns: 12

Problem Type: Classification

Recommended Models:
Logistic Regression
Decision Tree
Random Forest

===== MODEL PERFORMANCE =====
Logistic Regression: 0.80
Decision Tree: 0.74
Random Forest: 0.84
```

## Notes

- The dataset must be in CSV format.
- The target column must exist in the dataset.
- Missing values are handled automatically during preprocessing.
- The project uses cross-validation to make model comparison more reliable.
- Plots are displayed using Matplotlib and Seaborn.

## Example Use Cases

This assistant can be used for:

- Student performance prediction
- Healthcare classification tasks
- Financial prediction problems
- Sales forecasting
- Customer analytics

## Summary

This project provides a simple AutoML-style workflow that automatically understands a dataset, prepares the data, recommends models, trains them, and visualizes the results with minimal user input.
