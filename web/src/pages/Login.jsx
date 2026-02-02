import React, { useState } from "react";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { endpoints } from "../api/endpoints";

export default function Login() {
  const { client, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    try {
      const res = await client.post(endpoints.login, { username, password });
      login(res.data.access);
      nav("/reports");
    } catch (e) {
      setErr("Invalid credentials");
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 520 }}>
      <Typography variant="h5">Login</Typography>
      <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={submit}>Login</Button>
       

        {err && <Typography sx={{ color: "red" }}>{err}</Typography>}
      </Box>
    </Paper>
  );
}
