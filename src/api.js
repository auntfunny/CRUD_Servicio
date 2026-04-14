import axios from "axios";

export const instance = axios.create({
  baseURL: "https://hs-api.devfunval.cloud/api/v1",
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
      console.log("Credentials Incorrectas o sessión expirada");
      window.location.href = "/#/login";
    } else if (status === 403) {
      console.log("No estás autorizado para eso");
      window.location.href = "/#/unauthorized";
    }

    return Promise.reject(error);
  },
);
