from sklearn.model_selection import cross_val_score

from sklearn.linear_model import (
    LogisticRegression,
    LinearRegression
)

from sklearn.tree import (
    DecisionTreeClassifier,
    DecisionTreeRegressor
)

from sklearn.ensemble import (
    RandomForestClassifier,
    RandomForestRegressor
)

from sklearn.cluster import KMeans

from sklearn.metrics import silhouette_score

import numpy as np


def train_models(X, y, problem_type):

    results = {}

    # =========================
    # CLASSIFICATION
    # =========================

    if problem_type == "Classification":

        models = {

            "Logistic Regression":
            LogisticRegression(
                max_iter=5000
            ),

            "Decision Tree":
            DecisionTreeClassifier(),

            "Random Forest":
            RandomForestClassifier()
        }

        for name, model in models.items():

            scores = cross_val_score(
                model,
                X,
                y,
                cv=5
            )

            results[name] = scores.mean()

    # =========================
    # REGRESSION
    # =========================

    elif problem_type == "Regression":

        models = {

            "Linear Regression":
            LinearRegression(),

            "Decision Tree Regressor":
            DecisionTreeRegressor(),

            "Random Forest Regressor":
            RandomForestRegressor()
        }

        for name, model in models.items():

            scores = cross_val_score(
                model,
                X,
                y,
                cv=5
            )

            results[name] = scores.mean()

    # =========================
    # CLUSTERING
    # =========================

    elif problem_type == "Clustering":

        model = KMeans(
            n_clusters=3,
            random_state=42
        )

        clusters = model.fit_predict(X)

        score = silhouette_score(
            X,
            clusters
        )

        results["K-Means Clustering"] = score

    # =========================
    # TIME SERIES
    # =========================

    elif problem_type == "Time Series":

        X_time = np.arange(
            len(y)
        ).reshape(-1, 1)

        model = LinearRegression()

        scores = cross_val_score(
            model,
            X_time,
            y,
            cv=5
        )

        results["Linear Forecasting"] = scores.mean()

    return results