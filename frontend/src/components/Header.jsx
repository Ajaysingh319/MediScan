import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box textAlign="center" mb={4}>
      <Typography
        variant="h3"
        component="h1"
        fontWeight="bold"
        sx={{
          background: "linear-gradient(90deg, rgba(138, 43, 226, 0.9), rgba(72, 61, 139, 0.9))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        MediScan
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Your AI-Powered Medical Report Simplifier
      </Typography>
    </Box>
  );
}
