import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function DatasetPicker({ label, value, onChange, datasets }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(e) => onChange(e.target.value)}>
        {datasets.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {d.name} — {new Date(d.created_at).toLocaleString()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
