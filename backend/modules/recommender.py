def recommend_models(problem_type):

    if problem_type == "Classification":

        return [
            "Logistic Regression",
            "Decision Tree",
            "Random Forest"
        ]

    elif problem_type == "Regression":

        return [
            "Linear Regression",
            "Decision Tree Regressor",
            "Random Forest Regressor"
        ]

    elif problem_type == "Clustering":

        return [
            "K-Means Clustering"
        ]

    elif problem_type == "Time Series":

        return [
            "Linear Forecasting"
        ]