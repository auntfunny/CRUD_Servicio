import { useState } from "react";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";

export default function CambiarPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const { loading, error, request } = useAxios("/profile/password", {
    method: "PATCH",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden" });
      return;
    }

    try {
      await request({
        body: {
          current_password: form.current_password,
          new_password: form.new_password,
        },
      });

      setMensaje({ tipo: "ok", texto: "Contraseña actualizada correctamente" });
      
      setTimeout(() => {
        navigate("/perfil");
      }, 1200)
    } catch (error) {
      console.log("ERROR:", error.response?.data);

      if (error.response?.status === 401) {
        setMensaje({ tipo: "error", texto: "Contraseña actual incorrecta" });
      } else {
        setMensaje({ tipo: "error", texto: "Error inesperado" });
      }
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-[32px] bg-white shadow-[0_35px_100px_rgba(7,19,39,0.32)] px-8 py-10">
        {/* HEADER */}
        <span className="inline-flex rounded-full bg-[#eaf1ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#476fb5]">
          Seguridad
        </span>

        <h2 className="mt-6 text-3xl font-semibold text-slate-800">
          Cambiar contraseña
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          Mantén tu cuenta segura actualizando tu contraseña regularmente.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          <input
            type="password"
            name="current_password"
            placeholder="Contraseña actual"
            value={form.current_password}
            onChange={handleChange}
            className="w-full border-b border-slate-200 bg-transparent pb-3 pt-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5d80c8]"
            required
          />

          <input
            type="password"
            name="new_password"
            placeholder="Nueva contraseña"
            value={form.new_password}
            onChange={handleChange}
            className="w-full border-b border-slate-200 bg-transparent pb-3 pt-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5d80c8]"
            required
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirmar nueva contraseña"
            value={form.confirm_password}
            onChange={handleChange}
            className="w-full border-b border-slate-200 bg-transparent pb-3 pt-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5d80c8]"
            required
          />
          <button
            disabled={loading}
            className="w-full rounded-full bg-[linear-gradient(90deg,#7796db_0%,#5d80c8_45%,#3b5f9f_100%)] px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(93,128,200,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(93,128,200,0.42)] focus:outline-none focus:ring-2 focus:ring-[#7b9ae0] focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? "Procesando..." : "Actualizar contraseña"}
          </button>
        </form>

        {/* MENSAJE */}
        {mensaje && (
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium ${
              mensaje.tipo === "ok"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensaje.texto}
          </div>
        )}
      </div>
    </main>
  );
}
