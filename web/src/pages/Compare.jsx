import React, { useEffect, useState } from "react";
import { Paper, Typography, Grid, Button, Box } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { endpoints } from "../api/endpoints";
import DatasetPicker from "../components/DatasetPicker";
import HistogramBar from "../charts/HistogramBar";
import TypeDistributionBar from "../charts/TypeDistributionBar";
import DeltaCards from "../components/DeltaCards";
export default function Compare() {
  const { client, isAuthed } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      if (!isAuthed) return;
      try {
        const res = await client.get(endpoints.history);
        setDatasets(res.data);
      } catch {
        // ignore
      }
    }
    load();
  }, [isAuthed, client]);

  async function compareSaved() {
    setErr(""); setResult(null);
    if (!a || !b) return setErr("Select two saved datasets.");
    try {
      const res = await client.get(endpoints.compareSaved(a, b));
      setResult(res.data);
    } catch (e) {
      setErr("Compare failed.");
    }
  }

  async function compareTemp() {
    setErr(""); setResult(null);
    if (!fileA || !fileB) return setErr("Select file A and file B.");
    const form = new FormData();
    form.append("file_a", fileA);
    form.append("file_b", fileB);
    try {
      const res = await client.post(endpoints.compareTemp, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (e) {
      setErr("Temp compare failed (check CSV columns).");
    }
  }

  const overlayP = result?.overlay_histograms?.pressure;
  const overlayT = result?.overlay_histograms?.temperature;

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Compare</Typography>
        <Typography sx={{ mt: 1, opacity: 0.8 }}>
          Public users can compare two uploaded CSVs (temporary). Logged-in users can compare saved datasets.
        </Typography>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Public Compare (Temporary)</Typography>
            <Box sx={{ mt: 1, display: "grid", gap: 1 }}>
              <input type="file" accept=".csv" onChange={(e) => setFileA(e.target.files?.[0] || null)} />
              <input type="file" accept=".csv" onChange={(e) => setFileB(e.target.files?.[0] || null)} />
              <Button variant="contained" onClick={compareTemp}>Compare Files</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Saved Compare (Login Required)</Typography>
            {!isAuthed ? (
              <Typography sx={{ mt: 1, opacity: 0.7 }}>Login to compare saved datasets.</Typography>
            ) : (
              <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
                <DatasetPicker label="Dataset A" value={a} onChange={setA} datasets={datasets} />
                <DatasetPicker label="Dataset B" value={b} onChange={setB} datasets={datasets} />
                <Button variant="contained" onClick={compareSaved}>Compare Saved</Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {err && <Typography sx={{ mt: 2, color: "red" }}>{err}</Typography>}
      {result && <DeltaCards deltas={result.deltas_pct} />}
      {result && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Type Distribution — Dataset A</Typography>
              <TypeDistributionBar distribution={result.summary?.dataset_a?.type_distribution} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Type Distribution — Dataset B</Typography>
              <TypeDistributionBar distribution={result.summary?.dataset_b?.type_distribution} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Pressure Overlay (A)</Typography>
              <HistogramBar hist={overlayP?.a} title="Pressure A" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Pressure Overlay (B)</Typography>
              <HistogramBar hist={overlayP?.b} title="Pressure B" />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Temperature Overlay (A)</Typography>
              <HistogramBar hist={overlayT?.a} title="Temp A" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Temperature Overlay (B)</Typography>
              <HistogramBar hist={overlayT?.b} title="Temp B" />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Comparison Insights</Typography>
              {(result.insights || []).map((t, i) => (
                <Typography key={i} sx={{ mt: 0.5 }}>• {t}</Typography>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}
