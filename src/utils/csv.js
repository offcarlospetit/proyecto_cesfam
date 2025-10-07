// src/utils/csv.js
export function toCsv(rows, columns) {
  const header = columns.map((c) => c.header).join(",");
  const lines = rows.map((r) =>
    columns
      .map((c) => {
        const val = c.renderExport ? c.renderExport(r) : r[c.key] ?? "";
        const s = String(val).replace(/"/g, '""');
        return `"${s}"`;
      })
      .join(",")
  );
  return [header, ...lines].join("\n");
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
