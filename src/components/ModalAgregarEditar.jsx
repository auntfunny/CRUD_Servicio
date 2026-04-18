import { useState } from "react";
import useAxios from "../hooks/useAxios";
import ModalConfirmacion from "./ModalConfirmacion";
import ModalBase from "./ModalBase";
import { useToast } from "../context/ToastContext";

const traducciones = {
  categories: "Categoria",
  countries: "Pais",
  courses: "Curso",
  name: "Nombre",
  description: "Descripcion",
  code: "Codigo",
  duration: "Duracion",
  required_service_hours: "Horas de Servicio Requeridas",
  price: "Precio",
};

function getErrorMessage(err) {
  if (Array.isArray(err.response?.data?.detail)) {
    return err.response.data.detail
      .map((item) => item?.msg)
      .filter(Boolean)
      .join(", ");
  }

  return (
    err.response?.data?.detail ||
    err.response?.data?.message ||
    err.userMessage ||
    err.message
  );
}

const ModalAgregarEditar = ({
  url,
  campos,
  cerrar,
  existingNames = [],
  currentItemId = null,
}) => {
  const [formBody, setFormBody] = useState(campos);
  const [confirmar, setConfirmar] = useState(false);
  const { setToastMensaje } = useToast();
  const urlInfo = url.split("/").filter(Boolean);
  const numbers = ["duration", "required_service_hours", "price"];
  const metodo = urlInfo.length === 1 ? "POST" : "PATCH";
  const requiredFields = Object.keys(campos).filter((key) => key !== "description");

  const { loading, request } = useAxios(url, { method: metodo });

  const handleChange = (event) => {
    const value =
      event.target.name === "code"
        ? event.target.value.toUpperCase()
        : event.target.value;
    setFormBody((prev) => ({ ...prev, [event.target.name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedName = String(formBody.name ?? "").trim().toLowerCase();

    const hasMissingRequiredField = requiredFields.some((key) => {
      const value = formBody[key];

      if (numbers.includes(key)) {
        return value === "" || value === null || value === undefined;
      }

      return !String(value ?? "").trim();
    });

    if (hasMissingRequiredField) {
      setToastMensaje("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const duplicateName = existingNames.some((item) => {
      if (currentItemId !== null && item.id === currentItemId) {
        return false;
      }

      return String(item.name ?? "").trim().toLowerCase() === normalizedName;
    });

    if (normalizedName && duplicateName) {
      setToastMensaje("Ya existe una categoria con ese nombre.");
      return;
    }

    setConfirmar(true);
  };

  const handleConfirm = async () => {
    const payload = Object.fromEntries(
      Object.entries(formBody).map(([key, value]) => {
        if (typeof value === "string") {
          return [key, key === "code" ? value.trim().toUpperCase() : value.trim()];
        }

        return [key, value];
      }),
    );

    try {
      await request({ body: payload });
      setConfirmar(false);
      cerrar(true);
    } catch (err) {
      setToastMensaje(
        `Error al ${metodo === "POST" ? "crear" : "editar"}: ${getErrorMessage(err)}`,
      );
    }
  };

  return (
    <>
      {confirmar ? (
        <ModalConfirmacion
          mensaje={`Quieres ${metodo === "POST" ? "crear" : "editar"} este ${traducciones[urlInfo[0]]?.toLowerCase() ?? "registro"}?`}
          onCancel={() => setConfirmar(false)}
          onConfirm={handleConfirm}
          titulo={"Confirma accion"}
        />
      ) : null}

      <ModalBase
        onClose={() => cerrar(false)}
        title={`${metodo === "POST" ? "Crear" : "Editar"} ${traducciones[urlInfo[0]] ?? "registro"}`}
        widthClass="max-w-xl"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          {Object.keys(campos).map((key) => (
            <label
              key={key}
              className="flex flex-col gap-2 text-sm font-medium text-slate-700"
            >
              {traducciones[key] ?? key}
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 outline-none transition focus:border-acc1 focus:ring-2 focus:ring-[rgba(42,125,225,0.14)]"
                id={key}
                name={key}
                onChange={handleChange}
                placeholder={traducciones[key] ?? key}
                type={numbers.includes(key) ? "number" : "text"}
                value={formBody[key]}
              />
            </label>
          ))}

          <div className="flex justify-end gap-3">
            <button
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              onClick={() => cerrar(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="rounded-full bg-[linear-gradient(180deg,#2f80ed,#195ec9)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(42,125,225,0.28)] transition hover:brightness-95 disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {metodo === "POST" ? "Crear" : "Guardar"}
            </button>
          </div>
        </form>
      </ModalBase>
    </>
  );
};

export default ModalAgregarEditar;
