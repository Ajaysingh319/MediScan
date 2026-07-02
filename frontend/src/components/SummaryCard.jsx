import { Box, Chip, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { FiActivity, FiAlertCircle } from "react-icons/fi";

/** Summary sentence + a count chip + per-finding plain-language explanations. */
export default function SummaryCard({ summary, explanations = [], meta }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <FiActivity />
        <Typography variant="h6">Summary</Typography>
        {meta && (
          <Chip
            size="small"
            color={meta.abnormalCount > 0 ? "warning" : "success"}
            label={
              meta.abnormalCount > 0
                ? `${meta.abnormalCount} of ${meta.totalTests} need attention`
                : `All ${meta.totalTests} normal`
            }
            sx={{ ml: "auto" }}
          />
        )}
      </Box>
      <Typography>{summary}</Typography>

      {explanations.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {explanations.map((exp, i) => (
            <ListItem key={i} disableGutters alignItems="flex-start">
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                <FiAlertCircle />
              </ListItemIcon>
              <ListItemText primary={exp} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
