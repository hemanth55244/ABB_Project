import matplotlib.pyplot as plt
import seaborn as sns


def plot_missing_values(df):

    missing = df.isnull().sum()

    plt.figure(figsize=(8, 5))

    missing.plot(kind='bar')

    plt.title("Missing Values")

    plt.xlabel("Columns")

    plt.ylabel("Count")

    plt.show()


def plot_correlation_heatmap(df):

    plt.figure(figsize=(10, 6))

    sns.heatmap(
        df.corr(),
        annot=True,
        cmap='coolwarm'
    )

    plt.title("Correlation Heatmap")

    plt.show()


def plot_model_performance(
    results,
    problem_type
):

    model_names = []
    scores = []

    for model, score in results.items():

        model_names.append(model)

        scores.append(score)

    plt.figure(figsize=(8, 5))

    plt.bar(model_names, scores)

    plt.title(
        "Model Performance Comparison"
    )

    if problem_type == "Classification":

        plt.ylabel("Accuracy")

    elif problem_type == "Regression":

        plt.ylabel("R2 Score")

    elif problem_type == "Clustering":

        plt.ylabel("Silhouette Score")

    elif problem_type == "Time Series":

        plt.ylabel("Forecast Score")

    plt.xticks(rotation=15)

    plt.show()