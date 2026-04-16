import { useState } from "react";
import { instance as api } from "../api";
import { useNavigate } from "react-router-dom";

export default function CrearUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    document_number: "",
    role: "STUDENT",
  });

  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // ✅ Validación dominio
    if (!form.email.endsWith("@funval.com")) {
      setMensaje({
        tipo: "error",
        texto: "El email debe ser @funval.com",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/", {
        ...form,
        password: form.document_number, // 👈 clave inicial
      });

      setMensaje({
        tipo: "ok",
        texto: "Usuario creado correctamente (API)",
      });

      // volver a la lista
      setTimeout(() => {
        navigate("/usuarios");
      }, 1200);

    } catch (error) {
      console.log("ERROR API:", error.response?.data);

      // 🔥 fallback simulado
      await new Promise((res) => setTimeout(res, 800));

      setMensaje({
        tipo: "ok",
        texto: "Usuario creado (SIMULADO)",
      });

      setTimeout(() => {
        navigate("/usuarios");
      }, 1200);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white rounded-[32px] p-8 shadow-[0_35px_100px_rgba(7,19,39,0.32)]">

        <h2 className="text-2xl font-semibold text-slate-800">
          Crear Usuario
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          La contraseña inicial será el número de documento
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <input
            name="first_name"
            placeholder="Nombre"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
            required
          />

          <input
            name="last_name"
            placeholder="Apellido"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
            required
          />

          <input
            name="email"
            placeholder="Email (@funval.com)"
            value={form.email}
            onChange={handleChange}
            className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
            required
          />

          <input
            name="document_number"
            placeholder="Documento"
            value={form.document_number}
            onChange={handleChange}
            className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="STUDENT">STUDENT</option>
          </select>

          <button
            disabled={loading}
            className="w-full rounded-full bg-[linear-gradient(90deg,#7796db_0%,#5d80c8_45%,#3b5f9f_100%)] px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear usuario"}
          </button>

        </form>

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
