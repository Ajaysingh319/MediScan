import { Alert, AlertTitle } from "@mui/material";

/**
 * Prominent, always-visible medical disclaimer. Essential for a health app:
 * MediScan explains reports but does not diagnose or replace a clinician.
 */
export default function Disclaimer({ sx }) {
  return (
    <Alert severity="warning" sx={{ borderRadius: 2, ...sx }}>
      <AlertTitle sx={{ fontWeight: 700 }}>Not medical advice</AlertTitle>
      MediScan helps you understand your report in plain language. It does not diagnose
      conditions or replace professional care. Always consult a qualified doctor about your results.
    </Alert>
  );
}
