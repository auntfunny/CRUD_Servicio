import axios from "axios";

export const instance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    const detailMessage = Array.isArray(detail)
      ? detail.map((item) => item?.msg).filter(Boolean).join(", ")
      : typeof detail === "string"
        ? detail
        : error.response?.data?.message;

    if (status === 401) {
      alert("Credenciales Incorrectas o sesión expirada");
      window.location.href = "/#/login";
    } else if (status === 403) {
      alert("No estás autorizado para eso");
      window.location.href = "/#/unauthorized";
    }

    error.userMessage = detailMessage || error.message;
    return Promise.reject(error);
  },
);
