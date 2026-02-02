import pandas as pd

CANONICAL = ["Equipment Name", "Type", "Flowrate", "Pressure", "Temperature"]

# Acceptable aliases users might upload
ALIASES = {
    "equipment name": "Equipment Name",
    "equipmentname": "Equipment Name",
    "equipment_name": "Equipment Name",
    "equipment": "Equipment Name",

    "type": "Type",
    "equipment type": "Type",
    "equip_type": "Type",

    "flowrate": "Flowrate",
    "flow rate": "Flowrate",
    "flow_rate": "Flowrate",

    "pressure": "Pressure",
    "press": "Pressure",

    "temperature": "Temperature",
    "temp": "Temperature",
    "temp_c": "Temperature",
    "temp(c)": "Temperature",
}

def _normalize_columns(cols):
    normed = []
    for c in cols:
        c = str(c).replace("\ufeff", "").strip()   # remove BOM + strip spaces
        key = c.lower().strip()
        key = key.replace("__", "_").replace("  ", " ")
        # map alias if known
        normed.append(ALIASES.get(key, c))
    return normed

def validate_and_clean(df: pd.DataFrame):
    warnings = []

    # Normalize headers strongly
    df.columns = _normalize_columns(df.columns)

    missing = [c for c in CANONICAL if c not in df.columns]
    if missing:
        return None, [
            f"Missing required columns: {', '.join(missing)}",
            f"Found columns: {list(df.columns)}",
        ]

    # Convert numeric columns safely
    for col in ["Flowrate", "Pressure", "Temperature"]:
        before_na = df[col].isna().sum()
        df[col] = pd.to_numeric(df[col], errors="coerce")
        after_na = df[col].isna().sum()
        added_na = after_na - before_na
        if added_na > 0:
            warnings.append(f"{added_na} rows have invalid {col} values (ignored in averages).")

    # Negative checks (don’t fail, just warn)
    for col in ["Flowrate", "Pressure", "Temperature"]:
        neg = (df[col] < 0).sum()
        if neg > 0:
            warnings.append(f"{int(neg)} rows have negative {col} values.")

    return df, warnings
