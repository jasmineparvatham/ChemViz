import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

function fmt(v) {
  if (v === null || v === undefined) return "N/A";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

export default function DeltaCards({ deltas }) {
  if (!deltas) return null;

  const items = [
    ["Total", deltas.total_pct],
    ["Avg Flowrate", deltas.avg_flowrate_pct],
    ["Avg Pressure", deltas.avg_pressure_pct],
    ["Avg Temperature", deltas.avg_temperature_pct],
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {items.map(([label, value]) => (
        <Grid item xs={12} md={3} key={label}>
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ opacity: 0.7 }}>{label} Δ</Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>{fmt(value)}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
