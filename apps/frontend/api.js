const API_URL = import.meta.env.VITE_API_URL || "";

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON from API, but received ${contentType || "unknown content type"}. Check VITE_API_URL.`
    );
  }

  return response.json();
}

export async function getItems(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/api/items?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  return parseJsonResponse(response);
}

export async function createItem(item) {
  const response = await fetch(`${API_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Failed to create item");
  }

  return parseJsonResponse(response);
}
