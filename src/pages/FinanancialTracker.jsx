import { Container, Typography, Box } from "@mui/material";

export default function FinancialTracker() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Financial Tracker</Typography>
        <Typography sx={{ mt: 2 }}>
          Halaman ini untuk mencatat pemasukan dan pengeluaran (coming soon 🚀).
        </Typography>
      </Box>
    </Container>
  );
}
