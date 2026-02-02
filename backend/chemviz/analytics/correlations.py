import numpy as np
import pandas as pd

def corr_and_regression(x: pd.Series, y: pd.Series):
    df = pd.DataFrame({"x": x, "y": y}).dropna()
    if len(df) < 2:
        return {"corr": None, "slope": None, "intercept": None}

    corr = float(df["x"].corr(df["y"]))
    slope, intercept = np.polyfit(df["x"].astype(float), df["y"].astype(float), 1)
    return {
        "corr": corr,
        "slope": float(slope),
        "intercept": float(intercept)
    }
