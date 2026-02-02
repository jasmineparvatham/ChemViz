import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

function Card({ title, value }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ opacity: 0.7 }}>{title}</Typography>
      <Typography variant="h5" sx={{ mt: 0.5 }}>{value}</Typography>
    </Paper>
  );
}

export default function SummaryCards({ report }) {
  if (!report) return null;

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12} md={3}>
        <Card title="Total Equipment" value={report.total_equipment} />
      </Grid>
      <Grid item xs={12} md={3}>
        <Card title="Avg Flowrate" value={Number(report.avg_flowrate).toFixed(2)} />
      </Grid>
      <Grid item xs={12} md={3}>
        <Card title="Avg Pressure" value={Number(report.avg_pressure).toFixed(2)} />
      </Grid>
      <Grid item xs={12} md={3}>
        <Card title="Avg Temperature" value={Number(report.avg_temperature).toFixed(2)} />
      </Grid>
    </Grid>
  );
}
