const API_URL = "http://localhost:3000";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJsonResponse = contentType.includes("application/json");
  const data = isJsonResponse ? await response.json() : null;

  if (!response.ok) {
    const message =
      data?.message || data?.error || "Erro na requisicao";

    throw new Error(message);
  }

  return data;
}

export default request
