import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { endpoints } from "../api/endpoints";

export default function Reports() {
  const { client } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const res = await client.get(endpoints.history);
      setDatasets(res.data);
    } catch {
      setErr("Failed to load history.");
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleStar(d) {
    try {
      if (d.is_starred) await client.post(endpoints.unstar(d.id));
      else await client.post(endpoints.star(d.id));
      await load();
    } catch (e) {
      setErr(e?.response?.data?.error || "Star action failed.");
    }
  }
async function downloadBlob(url, filename) {
  try {
    const res = await client.get(url, { responseType: "blob" }); // ✅ includes Bearer token
    const blobUrl = window.URL.createObjectURL(res.data);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (e) {
    setErr("Download failed. Please try again.");
  }
}


  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Reports</Typography>
      {/* <Typography sx={{ mt: 1, opacity: 0.8 }}>
        Stored history is managed by backend limits: 10 normal + 10 starred.
      </Typography> */}

      {err && <Typography sx={{ mt: 2, color: "red" }}>{err}</Typography>}

      <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
        {datasets.map((d) => (
          <Paper key={d.id} sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6">
                {d.is_starred ? "⭐ " : ""}{d.name}
              </Typography>
              <Typography sx={{ opacity: 0.7 }}>
                {new Date(d.created_at).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="outlined" onClick={() => toggleStar(d)}>
                {d.is_starred ? "Unstar" : "Star"}
              </Button>
        <Button
  variant="outlined"
  onClick={() => downloadBlob(endpoints.pdf(d.id), `chemviz_report_${d.id}.pdf`)}
>
  PDF
</Button>

<Button
  variant="outlined"
  onClick={() => downloadBlob(endpoints.summaryCsv(d.id), `chemviz_summary_${d.id}.csv`)}
>
  Summary CSV
</Button>

            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}
