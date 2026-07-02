import {
  Chip, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from "@mui/material";
import { getStatusMeta } from "../utils/status";

/** Renders the normalized test rows with color-coded status chips. */
export default function TestResultsTable({ tests = [] }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Full Test Results
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Full test results">
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reference Range</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test, index) => {
              const meta = getStatusMeta(test.status);
              const range = test.ref_range;
              const hasRange =
                range && typeof range.low === "number" && typeof range.high === "number";
              return (
                <TableRow key={`${test.name}-${index}`} sx={{ backgroundColor: meta.rowBg }}>
                  <TableCell>{test.name}</TableCell>
                  <TableCell align="right">{test.value}</TableCell>
                  <TableCell>{test.unit}</TableCell>
                  <TableCell>
                    <Chip label={meta.label} color={meta.color} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{hasRange ? `${range.low} – ${range.high}` : "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
