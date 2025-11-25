// import { useState } from "react";
// import { TextField, Button, Container, Typography, Box } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     try {
//      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
// localStorage.setItem("token", res.data.token);


//       // simpan token ke localStorage
//       localStorage.setItem("token", res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       alert("Login gagal: " + err.response.data.message);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ mt: 8 }}>
//         <Typography variant="h4" gutterBottom>Login</Typography>
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
//           Login
//         </Button>
//         <Typography sx={{ mt: 2 }}>
//           Belum punya akun? <Link to="/register">Register</Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// }

import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      // simpan token ke localStorage
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
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
          Login
        </Button>
        <Typography sx={{ mt: 2 }}>
          Belum punya akun? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Container>
  );
}
