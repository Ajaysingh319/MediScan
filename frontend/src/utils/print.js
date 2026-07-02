/**
 * Opens the browser print dialog scoped to the report results.
 * Uses native print (which the user can "Save as PDF") — no heavy client-side
 * PDF library needed, and the output is crisp vector text.
 */
export const printReport = () => {
  window.print();
};
