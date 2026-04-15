import useAxios from "./useAxios";

function useUpload() {
  const {
    loading,
    error,
    request: requestGuardarReporte,
  } = useAxios("/reports/", {
    auto: false,
    method: "POST",
  });

  const guardarReporte = async (formData) => {
    return requestGuardarReporte({
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return {
    guardarReporte,
    guardandoReporte: loading,
    errorGuardarReporte: error,
  };
}

export default useUpload;
