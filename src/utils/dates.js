const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Formatea una fecha en "dd/mm/yyyy hh:mm".
 * Acepta string, number (timestamp) o Date.
 * Si el valor no es una fecha válida, devuelve el input original como string.
 */
export function formatFecha(input) {
  const d =
    input instanceof Date
      ? input
      : (input ?? null) !== null
      ? new Date(input)
      : null;

  if (!d || Number.isNaN(d.getTime())) {
    return String(input ?? "");
  }

  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}
