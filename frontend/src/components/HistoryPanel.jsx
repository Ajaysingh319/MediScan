import {
  Box, Button, Chip, IconButton, List, ListItemButton, ListItemText, Paper, Tooltip, Typography,
} from "@mui/material";
import { FiClock, FiTrash2 } from "react-icons/fi";

/** Sidebar of past analyses; clicking one re-opens it, with delete/clear. */
export default function HistoryPanel({ history, onOpen, onRemove, onClear }) {
  if (!history.length) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <FiClock />
        <Typography variant="h6">History</Typography>
        <Button size="small" onClick={onClear} sx={{ ml: "auto" }}>
          Clear all
        </Button>
      </Box>
      <List dense disablePadding>
        {history.map((entry) => {
          const { report } = entry;
          const abnormal = report.meta?.abnormalCount ?? 0;
          return (
            <ListItemButton
              key={entry.id}
              onClick={() => onOpen(entry)}
              sx={{ borderRadius: 2, mb: 0.5 }}
              secondaryAction={
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(entry.id);
                    }}
                  >
                    <FiTrash2 />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemText
                primary={new Date(entry.savedAt).toLocaleString()}
                secondary={`${report.meta?.totalTests ?? report.tests?.length ?? 0} tests`}
              />
              <Chip
                size="small"
                color={abnormal > 0 ? "warning" : "success"}
                label={abnormal > 0 ? `${abnormal} flagged` : "All normal"}
                sx={{ mr: 5 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
}
