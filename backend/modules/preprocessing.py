from sklearn.preprocessing import (
    LabelEncoder,
    StandardScaler
)

import pandas as pd


def preprocess_data(df, target_column):

    df = df.copy()

    # Handle Missing Values
    for col in df.columns:

        if df[col].dtype == 'object':

            df[col] = df[col].fillna(
                df[col].mode()[0]
            )

        else:

            df[col] = df[col].fillna(
                df[col].mean()
            )

    # Encode Categorical Columns
    le = LabelEncoder()

    for col in df.columns:

        if df[col].dtype == 'object':

            df[col] = le.fit_transform(df[col])

    # Clustering Case
    if target_column.strip() == "":

        X = df

        scaler = StandardScaler()

        X_scaled = scaler.fit_transform(X)

        X = pd.DataFrame(
            X_scaled,
            columns=X.columns
        )

        return X, None

    # Features and Target
    X = df.drop(target_column, axis=1)

    y = df[target_column]

    # Feature Scaling
    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(X)

    X = pd.DataFrame(
        X_scaled,
        columns=X.columns
    )

    return X, y