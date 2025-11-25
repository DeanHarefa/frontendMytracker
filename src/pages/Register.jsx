// import { useState } from "react";
// import { TextField, Button, Container, Typography, Box } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//  try {
//   await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
//   alert("Registrasi berhasil, silakan login");
//   navigate("/");
// } catch (err) {
//   alert("Register gagal: " + (err.response?.data?.message || err.message));
// }

//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ mt: 8 }}>
//         <Typography variant="h4" gutterBottom>Register</Typography>
//         <TextField 
//           label="Name" 
//           fullWidth 
//           margin="normal"
//           value={name}
//           onChange={(e) => setName(e.target.value)} 
//         />
//         <TextField 
//           label="Email" 
//           fullWidth 
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)} 
//         />
//         <TextField 
//           label="Password" 
//           type="password" 
//           fullWidth 
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)} 
//         />
//         <Button 
//           variant="contained" 
//           fullWidth 
//           sx={{ mt: 2 }}
//           onClick={handleSubmit}
//         >
//           Register
//         </Button>
//         <Typography sx={{ mt: 2 }}>
//           Sudah punya akun? <Link to="/">Login</Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// }


import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password });
      alert("Registrasi berhasil, silakan login");
      navigate("/");
    } catch (err) {
      alert("Register gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <TextField 
          label="Name" 
          fullWidth 
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <TextField 
          label="Email" 
          fullWidth 
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <TextField 
          label="Password" 
          type="password" 
          fullWidth 
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Register
        </Button>
        <Typography sx={{ mt: 2 }}>
          Sudah punya akun? <Link to="/">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
}
