import pandas as pd
import re

def _parse_price(val):
    """Convert price strings like '5,953' to float."""
    if isinstance(val, str):
        val = val.replace(',', '').strip()
        try:
            return float(val)
        except ValueError:
            return None
    return val

def _parse_duration_minutes(val):
    """Convert '02h 10m' to total minutes."""
    if isinstance(val, str):
        match = re.match(r'(\d+)h\s*(\d+)m', val.strip())
        if match:
            return int(match.group(1)) * 60 + int(match.group(2))
    return None

def analyze_dataset(df):
    df = df.copy()

    # --- basic info ---
    rows, cols = df.shape
    data_types = {col: str(dt) for col, dt in df.dtypes.items()}
    missing_values = df.isnull().sum().to_dict()

    # Count column categories
    num_cols = [c for c, t in data_types.items() if 'int' in t or 'float' in t]
    cat_cols = [c for c, t in data_types.items() if 'object' in t or 'category' in t]

    # --- airline distribution ---
    airline_dist = {}
    if 'airline' in df.columns:
        airline_dist = df['airline'].value_counts().head(8).to_dict()

    # --- stop distribution ---
    stop_dist = {}
    if 'stop' in df.columns:
        # Clean whitespace, newlines, tabs; extract just the core stop type
        cleaned = df['stop'].str.replace(r'[\n\t]+.*', '', regex=True).str.strip()
        stop_dist = cleaned.value_counts().to_dict()

    # --- from/to city distributions ---
    from_dist = {}
    if 'from' in df.columns:
        from_dist = df['from'].value_counts().head(6).to_dict()

    to_dist = {}
    if 'to' in df.columns:
        to_dist = df['to'].value_counts().head(6).to_dict()

    # --- price stats ---
    price_stats = {}
    if 'price' in df.columns:
        prices = df['price'].apply(_parse_price).dropna()
        price_stats = {
            "min": float(round(prices.min(), 2)),
            "max": float(round(prices.max(), 2)),
            "mean": float(round(prices.mean(), 2)),
            "median": float(round(prices.median(), 2)),
        }

    # --- duration stats ---
    duration_stats = {}
    if 'time_taken' in df.columns:
        durations = df['time_taken'].apply(_parse_duration_minutes).dropna()
        duration_stats = {
            "min_minutes": int(durations.min()),
            "max_minutes": int(durations.max()),
            "mean_minutes": float(round(durations.mean(), 1)),
        }

    # --- price by airline ---
    price_by_airline = {}
    if 'price' in df.columns and 'airline' in df.columns:
        _price_num = df['price'].apply(_parse_price)
        price_by_airline = (
            df.assign(_price_num=_price_num)
            .groupby('airline')['_price_num']
            .mean()
            .dropna()
            .round(0)
            .astype(int)
            .to_dict()
        )

    # --- composition for pie chart ---
    total_missing = sum(missing_values.values())
    composition = {
        "numerical_features": len(num_cols),
        "categorical_features": len(cat_cols),
        "missing_data_imputed": int(total_missing),
        "outliers_removed": 0,
    }

    # Use original columns (exclude any temp cols we may have added)
    original_cols = [c for c in df.columns if not c.startswith('_')]

    return {
        "rows": int(rows),
        "columns": int(cols),
        "column_names": original_cols,
        "data_types": data_types,
        "missing_values": missing_values,
        "num_cols": num_cols,
        "cat_cols": cat_cols,
        "airline_distribution": airline_dist,
        "stop_distribution": stop_dist,
        "from_distribution": from_dist,
        "to_distribution": to_dist,
        "price_stats": price_stats,
        "duration_stats": duration_stats,
        "price_by_airline": price_by_airline,
        "composition": composition,
    }