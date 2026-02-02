import pandas as pd

def generate_insights(df: pd.DataFrame):
    insights = []

    if "Type" in df.columns and "Temperature" in df.columns:
        temp_by_type = df.groupby("Type")["Temperature"].mean().dropna()
        if not temp_by_type.empty:
            hottest = temp_by_type.idxmax()
            insights.append(f"{hottest} shows the highest average temperature.")

    if "Pressure" in df.columns:
        p = df["Pressure"].dropna()
        if not p.empty:
            threshold = p.mean() + 2 * p.std()
            outliers = (df["Pressure"] > threshold).sum()
            if outliers > 0:
                insights.append(f"{outliers} equipment entries have unusually high pressure values.")

    return insights
