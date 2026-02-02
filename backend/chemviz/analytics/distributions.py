import numpy as np
import pandas as pd

def histogram(series: pd.Series, bins: int = 10):
    clean = series.dropna().astype(float)
    if clean.empty:
        return {"bins": [], "counts": []}

    counts, edges = np.histogram(clean, bins=bins)
    # Return bin edges (length bins+1) and counts (length bins)
    return {
        "bins": [float(x) for x in edges.tolist()],
        "counts": [int(x) for x in counts.tolist()]
    }

def boxplot_stats(series: pd.Series):
    clean = series.dropna().astype(float)
    if clean.empty:
        return {"min": None, "q1": None, "median": None, "q3": None, "max": None}

    q1 = float(clean.quantile(0.25))
    med = float(clean.quantile(0.50))
    q3 = float(clean.quantile(0.75))
    return {
        "min": float(clean.min()),
        "q1": q1,
        "median": med,
        "q3": q3,
        "max": float(clean.max())
    }
