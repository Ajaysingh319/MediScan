import { Box, Button, Typography } from "@mui/material";
import { FiDownload, FiRotateCcw } from "react-icons/fi";
import SummaryCard from "./SummaryCard";
import AdviceCard from "./AdviceCard";
import TestResultsTable from "./TestResultsTable";
import Disclaimer from "./Disclaimer";
import { printReport } from "../utils/print";

/** Full report display: summary, advice, tests table, disclaimer + actions. */
export default function ResultsView({ report, onReset }) {
  return (
    <Box>
      <Typography variant="h4" color="primary" textAlign="center" mb={3}>
        Simplified Report
      </Typography>

      {/* Printable region */}
      <Box id="report-print-area">
        <SummaryCard
          summary={report.summary}
          explanations={report.explanations}
          meta={report.meta}
        />
        <AdviceCard advice={report.advice} />
        <TestResultsTable tests={report.tests} />
        <Disclaimer sx={{ mt: 3 }} />
      </Box>

      <Box display="flex" gap={2} mt={4} className="no-print" flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<FiDownload />}
          onClick={printReport}
          sx={{ flex: 1 }}
        >
          Save as PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={<FiRotateCcw />}
          onClick={onReset}
          sx={{ flex: 1 }}
        >
          Analyze Another Report
        </Button>
      </Box>
    </Box>
  );
}
