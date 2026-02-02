import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import HistogramBar from "../charts/HistogramBar";
import GroupedBar from "../charts/GroupedBar";

export default function Analytics() {
  const { latestReport } = useAuth();

  if (!latestReport) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">No dataset loaded</Typography>
        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          Upload a CSV first.
        </Typography>
      </Paper>
    );
  }

  const h = latestReport.analytics?.histograms;
  const g = latestReport.analytics?.grouped_averages;

  const corr1 = latestReport.analytics?.correlations?.flowrate_vs_pressure?.corr;
  const corr2 = latestReport.analytics?.correlations?.pressure_vs_temperature?.corr;

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Analytics</Typography>
        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          Correlation (Flowrate vs Pressure): {corr1 == null ? "N/A" : corr1.toFixed(3)} <br/>
          Correlation (Pressure vs Temperature): {corr2 == null ? "N/A" : corr2.toFixed(3)}
        </Typography>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Flowrate Distribution</Typography>
            <HistogramBar hist={h?.flowrate} title="Flowrate" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pressure Distribution</Typography>
            <HistogramBar hist={h?.pressure} title="Pressure" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Temperature Distribution</Typography>
            <HistogramBar hist={h?.temperature} title="Temperature" />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Avg Pressure by Type</Typography>
           <GroupedBar
            obj={g?.avg_pressure_by_type}
             title="Avg Pressure"
      color="rgba(245, 158, 11, 0.9)"   // orange
                 />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Avg Temperature by Type</Typography>
           <GroupedBar
             obj={g?.avg_temperature_by_type}
            title="Avg Temperature"
            color="rgba(239, 68, 68, 0.9)"   // red
              />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
