import React, { useState } from "react";
import { Paper, Typography, Button, Box, Grid } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { endpoints } from "../api/endpoints";

import SummaryCards from "../components/SummaryCards";
import WarningsPanel from "../components/WarningsPanel";
import TypeDistributionBar from "../charts/TypeDistributionBar";

export default function Home() {
  const { client, isAuthed, saveLatestReport, latestReport } = useAuth();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  async function downloadBlob(url, filename) {
  const res = await client.get(url, { responseType: "blob" });
  const blobUrl = window.URL.createObjectURL(res.data);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(blobUrl);
}

  async function upload() {
    setError("");
    setSuccess(false);

    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);

      const res = await client.post(endpoints.upload, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      saveLatestReport(res.data);
      setError("");
      setSuccess(true);
      setFile(null);
    } catch (e) {
      const data = e?.response?.data;

      // backend error (has response)
      if (e?.response) {
        setError(
          data?.error ||
            (typeof data === "object" ? JSON.stringify(data, null, 2) : "") ||
            `Upload failed (HTTP ${e.response.status})`
        );
      } else {
        // true network/js error
        setError(e?.message || "Upload failed (no response)");
      }

      setSuccess(false);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Box>
      {/* Upload Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Upload CSV</Typography>

        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          {isAuthed
            ? "Logged in: uploads are saved to your history."
            : "Public mode: uploads are temporary. Login to save reports and star important datasets."}
        </Typography>

        <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError("");
              setSuccess(false);
            }}
          />

          <Button variant="contained" onClick={upload} disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          {file && (
            <Typography sx={{ opacity: 0.75 }}>
              Selected: <b>{file.name}</b>
            </Typography>
          )}
        </Box>

        {error && (
          <Typography sx={{ mt: 2, color: "red", whiteSpace: "pre-line" }}>
            {error}
          </Typography>
        )}

        {success && !error && (
          <Typography sx={{ mt: 2, color: "green" }}>
            Upload successful ✔️ Scroll down to view overview and download report.
          </Typography>
        )}
      </Paper>

      {/* Overview Section (same page) */}
      {latestReport && (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">Overview</Typography>
            <Typography sx={{ mt: 1, opacity: 0.8 }}>
              Latest dataset ID: <b>{latestReport.dataset}</b>
            </Typography>

            <SummaryCards report={latestReport} />
            <WarningsPanel warnings={latestReport.warnings} />

            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
 <Button
  variant="outlined"
  onClick={() => downloadBlob(endpoints.pdf(latestReport.dataset), `chemviz_report_${latestReport.dataset}.pdf`)}
>
  Download PDF
</Button>

<Button
  variant="outlined"
  onClick={() => downloadBlob(endpoints.summaryCsv(latestReport.dataset), `chemviz_summary_${latestReport.dataset}.csv`)}
>
  Download Summary CSV
</Button>

            </Box>
          </Paper>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Equipment Type Distribution</Typography>
                <TypeDistributionBar distribution={latestReport.equipment_distribution} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Insights</Typography>
                {(latestReport.analytics?.insights || []).length ? (
                  (latestReport.analytics.insights || []).map((t, i) => (
                    <Typography key={i} sx={{ mt: 0.5 }}>
                      • {t}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ mt: 1, opacity: 0.7 }}>
                    No insights available.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
