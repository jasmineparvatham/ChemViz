import pandas as pd
from .validation import validate_and_clean
from .distributions import histogram, boxplot_stats
from .correlations import corr_and_regression
from .insights import generate_insights

def _read_csv_robust(path: str) -> pd.DataFrame:
    # utf-8-sig handles BOM produced by Excel/Notepad
    return pd.read_csv(path, encoding="utf-8-sig")

def generate_full_analytics(csv_path: str):
    try:
        df = _read_csv_robust(csv_path)
    except Exception as e:
        return {"summary": None, "warnings": [f"Failed to read CSV: {str(e)}"], "analytics": None}

    df, warnings = validate_and_clean(df)
    if df is None:
        return {"summary": None, "warnings": warnings, "analytics": None}

    summary = {
        "total_equipment": int(len(df)),
        "avg_flowrate": float(df["Flowrate"].mean(skipna=True)),
        "avg_pressure": float(df["Pressure"].mean(skipna=True)),
        "avg_temperature": float(df["Temperature"].mean(skipna=True)),
        "equipment_distribution": df["Type"].value_counts().to_dict(),
    }

    analytics = {
        "histograms": {
            "flowrate": histogram(df["Flowrate"]),
            "pressure": histogram(df["Pressure"]),
            "temperature": histogram(df["Temperature"]),
        },
        "boxplots": {
            "flowrate": boxplot_stats(df["Flowrate"]),
            "pressure": boxplot_stats(df["Pressure"]),
            "temperature": boxplot_stats(df["Temperature"]),
        },
        "correlations": {
            "flowrate_vs_pressure": corr_and_regression(df["Flowrate"], df["Pressure"]),
            "pressure_vs_temperature": corr_and_regression(df["Pressure"], df["Temperature"]),
        },
        "grouped_averages": {
            "avg_pressure_by_type": df.groupby("Type")["Pressure"].mean().dropna().to_dict(),
            "avg_temperature_by_type": df.groupby("Type")["Temperature"].mean().dropna().to_dict(),
        },
        "insights": generate_insights(df),
    }

    return {"summary": summary, "warnings": warnings, "analytics": analytics}
