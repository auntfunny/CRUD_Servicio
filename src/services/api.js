export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://hs-api.devfunval.cloud/api/v1${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, //CLAVE
      ...options.headers,
    },
  });

  if (res.status === 401) {
    console.error("No autorizado - token inválido o expirado");
    localStorage.removeItem("token");
    window.location.href = "/#/login";
    return;
  }

  return res.json();
}