import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import SummaryCards from "../components/SummaryCards";
import WarningsPanel from "../components/WarningsPanel";
import TypeDistributionBar from "../charts/TypeDistributionBar";

export default function Overview() {
  const { latestReport } = useAuth();

  if (!latestReport) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">No dataset loaded</Typography>
        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          Upload a CSV on the Upload page first.
        </Typography>
      </Paper>
    );
  }

  const insights = latestReport.analytics?.insights || [];

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Overview</Typography>
        <SummaryCards report={latestReport} />
        <WarningsPanel warnings={latestReport.warnings} />
      </Paper>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Equipment Type Distribution</Typography>
            <TypeDistributionBar distribution={latestReport.equipment_distribution} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Insights</Typography>
            {insights.length ? (
              insights.map((t, i) => (
                <Typography key={i} sx={{ mt: 1 }}>• {t}</Typography>
              ))
            ) : (
              <Typography sx={{ mt: 1, opacity: 0.7 }}>No insights available.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
