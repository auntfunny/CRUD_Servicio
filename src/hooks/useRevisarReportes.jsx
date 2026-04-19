import { useState } from "react";

const useRevisarReportes = (
  actualizarReporte,
  setToastMensaje,
  recargarReportes,
  paramsConsulta,
) => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [reporteRevisando, setReporteRevisando] = useState(null);

  const abrirDetalle = (reporte) => setReporteSeleccionado(reporte);
  const cerrarDetalle = () => setReporteSeleccionado(null);
  const abrirRevision = () => {
    if (!reporteSeleccionado) return;
    setReporteRevisando(reporteSeleccionado);
    cerrarDetalle();
  };
  const cerrarRevision = () => setReporteRevisando(null);

  const guardarRevision = async (payload) => {
    if (!reporteRevisando) return;

    await actualizarReporte({
      url: `/reports/${reporteRevisando.id}/review`,
      body: payload,
      method: "PATCH",
    });

    setToastMensaje("Estado del reporte actualizado exitosamente");
    cerrarRevision();
    await recargarReportes({
      params: paramsConsulta,
    });
  };

  return {
    reporteSeleccionado,
    reporteRevisando,
    abrirDetalle,
    cerrarDetalle,
    abrirRevision,
    cerrarRevision,
    guardarRevision,
  };
};

export default useRevisarReportes;
