import { useMemo, useState } from "react";
import { Box, MenuItem, Paper, TextField, Typography } from "@mui/material";
import {
  CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

/**
 * Plots how a single test's value has changed across saved reports.
 * The killer health-app feature: turns one-off scans into a trend over time.
 */
export default function TrendChart({ history = [] }) {
  // Collect test names that appear in more than one saved report.
  const testNames = useMemo(() => {
    const counts = {};
    history.forEach((entry) => {
      entry.report.tests?.forEach((t) => {
        counts[t.name] = (counts[t.name] || 0) + 1;
      });
    });
    return Object.keys(counts).filter((n) => counts[n] >= 2);
  }, [history]);

  const [selected, setSelected] = useState("");
  const active = selected || testNames[0] || "";

  const data = useMemo(() => {
    if (!active) return [];
    return history
      .filter((e) => e.report.tests?.some((t) => t.name === active))
      .map((e) => {
        const t = e.report.tests.find((x) => x.name === active);
        return {
          date: new Date(e.savedAt).toLocaleDateString(),
          value: t.value,
          low: t.ref_range?.low,
          high: t.ref_range?.high,
        };
      })
      .reverse(); // oldest → newest
  }, [history, active]);

  if (testNames.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="h6" gutterBottom>
          Trends
        </Typography>
        <Typography color="text.secondary">
          Analyze at least two reports containing the same test to see how your values change over time.
        </Typography>
      </Paper>
    );
  }

  const range = data.find((d) => typeof d.low === "number" && typeof d.high === "number");

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
        <Typography variant="h6">Trends</Typography>
        <TextField
          select
          size="small"
          label="Test"
          value={active}
          onChange={(e) => setSelected(e.target.value)}
          sx={{ minWidth: 200, ml: "auto" }}
        >
          {testNames.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          {range && (
            <ReferenceArea y1={range.low} y2={range.high} fill="#2e7d32" fillOpacity={0.08} />
          )}
          <Line type="monotone" dataKey="value" stroke="#6a45d1" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
      {range && (
        <Typography variant="caption" color="text.secondary">
          Shaded band = normal reference range ({range.low}–{range.high}).
        </Typography>
      )}
    </Paper>
  );
}
