import { List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { FiHeart } from "react-icons/fi";

/** General diet & lifestyle tips returned by the AI (never treatment advice). */
export default function AdviceCard({ advice = [] }) {
  if (!advice.length) return null;
  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Diet & Lifestyle Tips
      </Typography>
      <List dense>
        {advice.map((tip, i) => (
          <ListItem key={i} disableGutters alignItems="flex-start">
            <ListItemIcon sx={{ minWidth: 32, mt: 0.5, color: "primary.main" }}>
              <FiHeart />
            </ListItemIcon>
            <ListItemText primary={tip} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
