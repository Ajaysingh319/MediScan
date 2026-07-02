import { useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Divider, Grid, IconButton, InputAdornment,
  Link, Paper, Stack, TextField, Typography,
} from "@mui/material";
import {
  FiActivity, FiEye, FiEyeOff, FiHeart, FiLock, FiMail, FiShield, FiTrendingUp, FiUser,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";

const FEATURES = [
  { icon: <FiActivity />, title: "Understand every result", text: "Plain-language explanations of each test value." },
  { icon: <FiHeart />, title: "Personalized tips", text: "General diet & lifestyle suggestions for your results." },
  { icon: <FiTrendingUp />, title: "Track your trends", text: "Watch how your values change across reports over time." },
  { icon: <FiShield />, title: "Private & secure", text: "Your account is protected with encrypted passwords." },
];

/** Left-hand branded panel (hidden on small screens). */
function BrandPanel() {
  return (
    <Box
      sx={{
        height: "100%",
        p: { xs: 4, md: 6 },
        color: "#fff",
        background: "linear-gradient(135deg, #6a45d1 0%, #483d8b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" fontWeight={800} gutterBottom>
        MediScan
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontFamily: "Inter, sans-serif" }}>
        Understand your medical reports in seconds.
      </Typography>
      <Stack spacing={2.5}>
        {FEATURES.map((f) => (
          <Box key={f.title} display="flex" gap={2} alignItems="flex-start">
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                p: 1,
                display: "flex",
                fontSize: 20,
              }}
            >
              {f.icon}
            </Box>
            <Box>
              <Typography fontWeight={700}>{f.title}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {f.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
  };

  const validate = () => {
    if (isSignup && !form.name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    setError("");
    setSubmitting(true);
    try {
      if (isSignup) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      // On success the AuthProvider sets the user and the app re-renders.
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
        background: "linear-gradient(135deg, #f9f9f9 0%, #efeaf9 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 960,
          overflow: "hidden",
          borderRadius: 5,
          boxShadow: "0 20px 60px rgba(72,61,139,0.18)",
        }}
      >
        <Grid container>
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "block" } }}>
            <BrandPanel />
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ p: { xs: 3, sm: 5 } }} component="form" onSubmit={submit}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {isSignup ? "Create your account" : "Welcome back"}
              </Typography>
              <Typography color="text.secondary" mb={3}>
                {isSignup
                  ? "Sign up to start simplifying your medical reports."
                  : "Log in to continue to MediScan."}
              </Typography>

              <Stack spacing={2.5}>
                {isSignup && (
                  <TextField
                    label="Full name"
                    value={form.name}
                    onChange={set("name")}
                    fullWidth
                    autoComplete="name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FiUser />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  fullWidth
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMail />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  fullWidth
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  helperText={isSignup ? "At least 8 characters." : " "}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPw((s) => !s)}
                          edge="end"
                          aria-label={showPw ? "Hide password" : "Show password"}
                        >
                          {showPw ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  {submitting ? "Please wait..." : isSignup ? "Create account" : "Log in"}
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography textAlign="center" color="text.secondary">
                {isSignup ? "Already have an account?" : "New to MediScan?"}{" "}
                <Link component="button" type="button" onClick={switchMode} fontWeight={700} underline="hover">
                  {isSignup ? "Log in" : "Create one"}
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
