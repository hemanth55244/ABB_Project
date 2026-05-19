def detect_problem_type(df, target_column):

    # Clustering
    if target_column.strip() == "":
        return "Clustering"

    # Time Series
    if "date" in target_column.lower() or \
       "time" in target_column.lower():

        return "Time Series"

    target = df[target_column]

    # Classification
    if target.dtype == 'object':
        return "Classification"

    elif target.nunique() <= 10:
        return "Classification"

    # Regression
    else:
        return "Regression"