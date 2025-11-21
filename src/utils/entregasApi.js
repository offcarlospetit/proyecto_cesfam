import { apiFetch } from "./apiClient";

export async function listEntregasAllSafe() {
  try {
    return await apiFetch(`/entregas`);
  } catch {
    return [];
  }
}
