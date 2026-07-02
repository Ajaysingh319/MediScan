import { useRef, useState } from "react";
import {
  Box, Button, Tabs, Tab, TextField, Typography, CircularProgress,
} from "@mui/material";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import Lottie from "react-lottie-player";
import lottieJson from "../assets/animation.json";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

/**
 * Input surface: tabbed image-upload (with drag & drop + client-side
 * validation) or paste-text. Owns only local input state and hands the chosen
 * input up to the parent on submit.
 */
export default function ReportInput({ loading, onSubmit }) {
  const [tab, setTab] = useState(0);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const changeTab = (_e, v) => {
    setTab(v);
    setFile(null);
    setText("");
    setLocalError("");
  };

  const validateAndSetFile = (f) => {
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setLocalError("Unsupported file type. Please upload a PNG, JPG, or WEBP image.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setLocalError("Image is too large (max 5 MB).");
      return;
    }
    setLocalError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (tab === 0) {
      if (!file) return setLocalError("Please select an image to analyze.");
      onSubmit({ file });
    } else {
      if (!text.trim()) return setLocalError("Please paste your report text.");
      onSubmit({ text: text.trim() });
    }
  };

  return (
    <Box component="form" onSubmit={submit}>
      <Tabs value={tab} onChange={changeTab} centered sx={{ mb: 3 }}>
        <Tab icon={<FiUploadCloud />} iconPosition="start" label="Upload Image" />
        <Tab icon={<FiFileText />} iconPosition="start" label="Paste Text" />
      </Tabs>

      {tab === 0 && (
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload report image"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          sx={{
            my: 3, p: 4, textAlign: "center", cursor: "pointer",
            border: "2px dashed",
            borderColor: dragOver ? "primary.main" : "divider",
            borderRadius: 3,
            bgcolor: dragOver ? "action.hover" : "transparent",
            transition: "all 0.2s",
          }}
        >
          <FiUploadCloud size={36} style={{ opacity: 0.6 }} />
          <Typography mt={1} fontWeight={600}>
            {file ? file.name : "Drag & drop or click to select an image"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG, or WEBP · up to 5 MB
          </Typography>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            hidden
            onChange={(e) => validateAndSetFile(e.target.files?.[0])}
          />
        </Box>
      )}

      {tab === 1 && (
        <TextField
          multiline
          rows={10}
          fullWidth
          label="Paste your report text"
          placeholder="e.g. Hemoglobin 10.2 g/dL (Low), WBC 11200 /uL (High)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ my: 2 }}
        />
      )}

      {loading ? (
        <Box textAlign="center" my={2}>
          <Lottie loop animationData={lottieJson} play style={{ width: 150, height: 100, margin: "auto" }} />
          <Typography>Analyzing your report...</Typography>
        </Box>
      ) : (
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          Simplify Report
        </Button>
      )}

      {localError && (
        <Typography color="error" mt={2} role="alert">
          {localError}
        </Typography>
      )}
    </Box>
  );
}
