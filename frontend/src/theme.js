import { createTheme } from "@mui/material/styles";

/** The "Plum Vibe" light theme, extracted from main.jsx for reuse. */
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6a45d1" },
    success: { main: "#2e7d32" },
    error: { main: "#c62828" },
    warning: { main: "#ed6c02" },
    info: { main: "#0277bd" },
    background: { default: "#f9f9f9", paper: "#ffffff" },
    text: { primary: "#1a1a1a", secondary: "#5b5b5b" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontFamily: "Lora, serif", fontWeight: 700 },
    h2: { fontFamily: "Lora, serif", fontWeight: 700 },
    h3: { fontFamily: "Lora, serif", fontWeight: 700 },
    h4: { fontFamily: "Lora, serif", fontWeight: 700 },
    h5: { fontFamily: "Lora, serif", fontWeight: 700 },
    h6: { fontFamily: "Lora, serif", fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none", fontWeight: "bold" },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
          boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundImage: "none" },
      },
    },
  },
});
