import pandas as pd
from .validation import validate_and_clean
from .distributions import histogram
from .insights import generate_insights

def compare_two_csvs(path_a: str, path_b: str):
    df_a = pd.read_csv(path_a)
    df_b = pd.read_csv(path_b)

    df_a, warn_a = validate_and_clean(df_a)
    df_b, warn_b = validate_and_clean(df_b)

    if df_a is None or df_b is None:
        return {
            "error": "Invalid CSV(s)",
            "warnings": {
                "dataset_a": warn_a,
                "dataset_b": warn_b,
            }
        }

    # Summary A
    summary_a = {
        "total": int(len(df_a)),
        "avg_flowrate": float(df_a["Flowrate"].mean(skipna=True)),
        "avg_pressure": float(df_a["Pressure"].mean(skipna=True)),
        "avg_temperature": float(df_a["Temperature"].mean(skipna=True)),
        "type_distribution": df_a["Type"].value_counts().to_dict(),
    }

    # Summary B
    summary_b = {
        "total": int(len(df_b)),
        "avg_flowrate": float(df_b["Flowrate"].mean(skipna=True)),
        "avg_pressure": float(df_b["Pressure"].mean(skipna=True)),
        "avg_temperature": float(df_b["Temperature"].mean(skipna=True)),
        "type_distribution": df_b["Type"].value_counts().to_dict(),
    }

    def pct_change(a, b):
        if a == 0 or a is None:
            return None
        return float(((b - a) / a) * 100.0)

    deltas = {
        "total_pct": pct_change(summary_a["total"], summary_b["total"]),
        "avg_flowrate_pct": pct_change(summary_a["avg_flowrate"], summary_b["avg_flowrate"]),
        "avg_pressure_pct": pct_change(summary_a["avg_pressure"], summary_b["avg_pressure"]),
        "avg_temperature_pct": pct_change(summary_a["avg_temperature"], summary_b["avg_temperature"]),
    }

    overlay_histograms = {
        "pressure": {
            "a": histogram(df_a["Pressure"]),
            "b": histogram(df_b["Pressure"]),
        },
        "temperature": {
            "a": histogram(df_a["Temperature"]),
            "b": histogram(df_b["Temperature"]),
        }
    }

    # Simple comparison insights
    comparison_insights = []
    if deltas["avg_temperature_pct"] is not None:
        if deltas["avg_temperature_pct"] > 0:
            comparison_insights.append("Dataset B has higher average temperature than Dataset A.")
        elif deltas["avg_temperature_pct"] < 0:
            comparison_insights.append("Dataset B has lower average temperature than Dataset A.")

    if deltas["avg_pressure_pct"] is not None:
        if abs(deltas["avg_pressure_pct"]) > 10:
            comparison_insights.append("Pressure changed significantly between the two datasets.")

    return {
        "warnings": {
            "dataset_a": warn_a,
            "dataset_b": warn_b,
        },
        "summary": {
            "dataset_a": summary_a,
            "dataset_b": summary_b,
        },
        "deltas_pct": deltas,
        "overlay_histograms": overlay_histograms,
        "insights": comparison_insights,
    }
