const BASE_URL = "https://api-cesfam.vercel.app/api";

async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const hasBody = body !== undefined && body !== null;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }

  return res.headers.get("content-type")?.includes("application/json")
    ? res.json()
    : res.text();
}

export { apiFetch };
