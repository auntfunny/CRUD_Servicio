import useAxios from "./useAxios";

function useUpload() {
  const {
    loading: guardandoReporte,
    error: errorGuardarReporte,
    request: requestGuardarReporte,
  } = useAxios("/reports/", {
    auto: false,
    method: "POST",
  });
  const {
    loading: actualizandoReporte,
    error: errorActualizarReporte,
    request: requestActualizarReporte,
  } = useAxios("/reports/", {
    auto: false,
    method: "PATCH",
  });

  const guardarReporte = async (formData) => {
    return requestGuardarReporte({
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const actualizarReporte = async (reporteId, formData) => {
    return requestActualizarReporte({
      url: `/reports/${reporteId}`,
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
      method: "PATCH",
    });
  };

  return {
    actualizarReporte,
    guardarReporte,
    guardandoReporte,
    actualizandoReporte,
    errorGuardarReporte,
    errorActualizarReporte,
  };
}

export default useUpload;
