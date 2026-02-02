import React from "react";
import { Paper, Typography } from "@mui/material";

export default function WarningsPanel({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <Paper sx={{ p: 2, mt: 2, borderLeft: "5px solid #f59e0b" }}>
      <Typography variant="h6">⚠ Data Quality Warnings</Typography>
      {warnings.map((w, i) => (
        <Typography key={i} sx={{ mt: 0.5 }}>• {w}</Typography>
      ))}
    </Paper>
  );
}
