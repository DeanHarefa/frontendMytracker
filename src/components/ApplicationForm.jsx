import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

export default function ApplicationForm({ onSuccess }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Pending");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/applications", {
        company,
        position,
        status,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCompany("");
      setPosition("");
      setStatus("Pending");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <TextField 
        label="Perusahaan" 
        fullWidth 
        margin="normal"
        value={company}
        onChange={(e) => setCompany(e.target.value)} 
      />
      <TextField 
        label="Posisi" 
        fullWidth 
        margin="normal"
        value={position}
        onChange={(e) => setPosition(e.target.value)} 
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Tambah Lamaran
      </Button>
    </Box>
  );
}
