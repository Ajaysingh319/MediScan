import { useState } from "react";
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

/** Circular avatar + dropdown menu with the user's details and logout. */
function UserMenu() {
  const { user, logout } = useAuth();
  const [anchor, setAnchor] = useState(null);
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Account menu">
        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40, fontSize: 16 }}>
          {initials}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography fontWeight={700}>{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <FiLogOut />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}

export default function Header() {
  const { user } = useAuth();

  return (
    <Box sx={{ position: "relative", textAlign: "center", mb: 4 }}>
      {user && (
        <Box sx={{ position: "absolute", right: 0, top: 0 }}>
          <UserMenu />
        </Box>
      )}
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
      {user && (
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Welcome back, {user.name.split(" ")[0]} 👋
        </Typography>
      )}
    </Box>
  );
}
