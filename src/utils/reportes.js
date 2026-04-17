export const estadoLabels = {
  PENDING: "Pendiente",
  APPROVED_FULL: "Aprobado",
  APPROVED_PARTIAL: "Aprobado parcial",
  REJECTED: "Rechazado",
};

export const estadoOptions = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: estadoLabels.PENDING },
  { value: "APPROVED_FULL", label: estadoLabels.APPROVED_FULL },
  { value: "APPROVED_PARTIAL", label: estadoLabels.APPROVED_PARTIAL },
  { value: "REJECTED", label: estadoLabels.REJECTED },
];

export function getEstadoLabel(estado) {
  return estadoLabels[estado] ?? estado;
}

export function formatHoras(valor) {
  const numero = Number(valor ?? 0);
  return `${numero} horas`;
}

export function formatFecha(valor) {
  if (!valor) return "Sin fecha";

  const fecha = new Date(getFechaOrdenable(valor));

  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }

  return fecha.toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getFechaOrdenable(valor) {
  if (!valor) return 0;

  if (typeof valor === "number") {
    return valor;
  }

  if (typeof valor === "string") {
    const texto = valor.trim();

    const fechaIso = Date.parse(texto);
    if (!Number.isNaN(fechaIso)) {
      return fechaIso;
    }

    const coincidenciaFecha = texto.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
    );

    if (coincidenciaFecha) {
      const [, dia, mes, anio, hora = "0", minuto = "0", segundo = "0"] = coincidenciaFecha;
      return new Date(
        Number(anio),
        Number(mes) - 1,
        Number(dia),
        Number(hora),
        Number(minuto),
        Number(segundo),
      ).getTime();
    }
  }

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? 0 : fecha.getTime();
}

export function buildReporteFormData(formulario) {
  const formData = new FormData();

  if (formulario.evidence) {
    formData.append("evidence", formulario.evidence);
  }

  if (formulario.hoursSpent !== "" && formulario.hoursSpent !== null) {
    formData.append("hours_spent", String(formulario.hoursSpent));
  }

  if (formulario.categoryId) {
    formData.append("category_id", String(formulario.categoryId));
  }

  if (formulario.description) {
    formData.append("description", formulario.description);
  }

  return formData;
}

export function createReporteFormState(reporte = null) {
  return {
    categoryId: reporte?.category_id ? String(reporte.category_id) : "",
    description: reporte?.description ?? "",
    evidence: null,
    evidenceName: reporte?.evidence_name ?? "",
    hoursSpent: reporte?.hours_spent ?? "",
  };
}
