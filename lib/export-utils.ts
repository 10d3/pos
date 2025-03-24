/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utility functions for exporting data to different formats
 */

/**
 * Export data to CSV format and trigger download
 * @param data Array of objects to export
 * @param filename Name of the file to download
 * @param headers Optional custom headers (defaults to object keys)
 */
export function exportToCSV(
  data: Record<string, any>[],
  filename: string,
  headers?: string[]
) {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Use provided headers or extract from first data item
  const columnHeaders = headers || Object.keys(data[0]);

  // Create CSV header row
  let csvContent = columnHeaders.join(",") + "\n";

  // Add data rows
  data.forEach((item) => {
    const row = columnHeaders
      .map((header) => {
        // Handle values that need quotes (commas, quotes, etc.)
        const value = item[header] !== undefined ? item[header] : "";
        const valueStr = String(value);

        // Escape quotes and wrap in quotes if needed
        if (
          valueStr.includes(",") ||
          valueStr.includes('"') ||
          valueStr.includes("\n")
        ) {
          return `"${valueStr.replace(/"/g, '""')}"`;
        }
        return valueStr;
      })
      .join(",");

    csvContent += row + "\n";
  });

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  // Create download link
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date for report filenames
 */
export function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}`;
}
