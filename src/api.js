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
    console.log("Respuesta exitosa");
    return response;
  },
  function onRejected(error) {
    const status = error.response?.status;

    if (status === 401) {
      alert("Credentials Incorrectas o sessión expirada");
      window.location.href = "/#/login";
    } else if (status === 403) {
      alert("No estás autorizado para eso");
      window.location.href = "/#/unauthorized";
    } else if (status === 409) {
      alert(error.message);
    }

    return Promise.reject(error);
  },
);