import { useState } from "react";
import useAxios from "../hooks/useAxios";
import ModalConfirmacion from "./ModalConfirmacion";

const traducciones = {
  categories: "Categoria",
  countries: "País",
  courses: "Curso",
  name: "Nombre",
  description: "Descripción",
  code: "Código",
  duration: "Duración",
  required_service_hours: "Horas de Servicio Requeridas",
  price: "Precio",
};

const ModalAgregarEditar = ({ url, campos, cerrar }) => {
  const [formBody, setFormBody] = useState(campos);
  const [confirmar, setConfirmar] = useState(false);
  const urlInfo = url.split("/").filter(Boolean);
  const numbers = ["duration", "required_service_hours", "price"];
  const metodo = urlInfo.length === 1 ? "POST" : "PATCH";

  const { data, loading, error, request } = useAxios(url, { method: metodo });

  const handleChange = (event) => {
    setFormBody(
      (prev) => (prev = { ...prev, [event.target.name]: event.target.value }),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirmar(true);
  };

  const handleConfirm = async () => {
    try {
      await request({ body: formBody });
      setConfirmar(false);
      cerrar(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setConfirmar(false);
  };

  const handleClose = (event) => {
    const current = event.target.closest("form");
    const button = event.target.closest("button");
    if (!current || button?.id === "close") {
      cerrar(false);
    }
  };

  return (
    <div onClick={handleClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
      {confirmar && (
        <ModalConfirmacion
          titulo={"Confirma Acción"}
          mensaje={`Quieres ${metodo === "POST" ? "crear" : "editar"} este ${traducciones[urlInfo[0]].toLowerCase()}?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center gap-8 p-6 w-xs md:w-sm font-montserrat bg-white border border-acc1 rounded-2xl"
      >
        <button type="button" id="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="absolute top-3 right-3 size-6 text-gray-400 hover:text-red-500 hover:cursor-pointer active:scale-125"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-avenir font-bold">
          {metodo === "POST" ? "Crear" : "Editar"} {traducciones[urlInfo[0]]}
        </h2>

        {Object.keys(campos).map((key) => (
          <input
            key={key}
            onChange={handleChange}
            value={formBody[key]}
            type={numbers.includes(key) ? "number" : "text"}
            placeholder={traducciones[key]}
            id={key}
            name={key}
            className="w-4/5 p-2 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:border-acc1 focus:bg-gray-100"
          />
        ))}

        <button
          type="submit"
          className="w-32 p-2 bg-acc1 text-white rounded-lg hover:bg-acc2 hover:cursor-pointer"
        >
          {metodo === "POST" ? "Crear" : "Guardar"}
        </button>
      </form>
    </div>
  );
};

export default ModalAgregarEditar;
