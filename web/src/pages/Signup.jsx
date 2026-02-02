import React, { useState } from "react";
import { Paper, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { endpoints } from "../api/endpoints";

export default function Signup() {
  const { client } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    setMsg("");
    try {
      await client.post(endpoints.signup, { username, email, password });
      setMsg("Account created. Please login.");
      setTimeout(() => nav("/login"), 800);
    } catch (e) {
      setErr("Signup failed (username may already exist).");
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 520 }}>
      <Typography variant="h5">Signup</Typography>
      <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={submit}>Create Account</Button>
        {msg && <Typography sx={{ color: "green" }}>{msg}</Typography>}
        {err && <Typography sx={{ color: "red" }}>{err}</Typography>}
      </Box>
    </Paper>
  );
}
