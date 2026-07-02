import { lazy, Suspense, useState } from "react";
import { Alert, Box, Card, Container, Skeleton, Stack } from "@mui/material";
import Header from "./components/Header";
import Disclaimer from "./components/Disclaimer";
import ReportInput from "./components/ReportInput";
import ResultsView from "./components/ResultsView";
import HistoryPanel from "./components/HistoryPanel";
import { useHistory } from "./hooks/useHistory";
import { analyzeReport, getErrorMessage } from "./api/client";
import "./App.css";

// recharts is heavy — load it only when there's history to chart.
const TrendChart = lazy(() => import("./components/TrendChart"));

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { history, addReport, removeReport, clearHistory } = useHistory();

  const handleSubmit = async (input) => {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const result = await analyzeReport(input);
      setReport(result);
      addReport(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError("");
  };

  return (
    <Container maxWidth="md" sx={{ my: 5 }}>
      <Header />

      <Card sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
        {report ? (
          <ResultsView report={report} onReset={handleReset} />
        ) : (
          <Stack spacing={3}>
            <Disclaimer />
            <ReportInput loading={loading} onSubmit={handleSubmit} />
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
          </Stack>
        )}
      </Card>

      {!report && history.length > 0 && (
        <Box className="no-print" mt={4}>
          <Stack spacing={3}>
            <Suspense fallback={<Skeleton variant="rounded" height={320} />}>
              <TrendChart history={history} />
            </Suspense>
            <HistoryPanel
              history={history}
              onOpen={(entry) => setReport(entry.report)}
              onRemove={removeReport}
              onClear={clearHistory}
            />
          </Stack>
        </Box>
      )}
    </Container>
  );
}

export default App;
