import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mediscan:history";
const MAX_ENTRIES = 20;

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Persists analyzed reports to localStorage so users can revisit past scans
 * and track trends over time. Keeps the most recent MAX_ENTRIES reports.
 */
export const useHistory = () => {
  const [history, setHistory] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore quota errors — history is a non-critical enhancement.
    }
  }, [history]);

  const addReport = useCallback((report) => {
    const entry = {
      id: `${report.meta?.generatedAt || new Date().toISOString()}-${Math.round(
        performance.now()
      )}`,
      savedAt: new Date().toISOString(),
      report,
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
    return entry;
  }, []);

  const removeReport = useCallback((id) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addReport, removeReport, clearHistory };
};
