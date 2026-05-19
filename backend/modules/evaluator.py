from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

import numpy as np


def evaluate_classification(y_test, y_pred):

    results = {

        "Accuracy": accuracy_score(y_test, y_pred),

        "Precision": precision_score(
            y_test,
            y_pred,
            average='weighted'
        ),

        "Recall": recall_score(
            y_test,
            y_pred,
            average='weighted'
        ),

        "F1 Score": f1_score(
            y_test,
            y_pred,
            average='weighted'
        )
    }

    return results


def evaluate_regression(y_test, y_pred):

    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    results = {

        "MAE": mean_absolute_error(y_test, y_pred),

        "RMSE": rmse,

        "R2 Score": r2_score(y_test, y_pred)
    }

    return results