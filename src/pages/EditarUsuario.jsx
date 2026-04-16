import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance as api } from "../api";

export default function EditarUsuario() {
  const { id } = useParams();

  const [form, setForm] = useState({
    first_name: "",
    email: "",
    role: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const fakeUser = {
          first_name: "Juan",
          email: "juan@test.com",
          role: "STUDENT",
          is_active: true,
        };

        await new Promise((res) => setTimeout(res, 500));
        setForm(fakeUser);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.patch(`/users/${id}`, form);
      alert("Usuario actualizado");
    } catch (error) {
      alert("Error (modo simulado activo)");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1f3a] text-white">
        Cargando...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-8">

      <div className="mx-auto max-w-5xl">

        <section className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_35px_100px_rgba(7,19,39,0.32)] lg:grid-cols-[0.9fr_1.2fr]">

          {/* LADO IZQUIERDO */}
          <aside className="relative flex flex-col justify-between bg-[#143963] px-8 py-10 text-white">

            {/* MISMO GRADIENTE DEL LOGIN */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(106,144,216,0.9)_0%,rgba(129,117,216,0.82)_40%,rgba(236,157,211,0.92)_78%,rgba(16,44,80,0.98)_100%)]" />

            <div className="relative z-10">
              <h1 className="text-2xl font-bold tracking-[0.2em]">FUNVAL</h1>

              <h2 className="mt-6 text-3xl font-semibold">
                Editar Usuario
              </h2>

              <p className="mt-4 text-sm text-white/80">
                Modifica la información del usuario seleccionado.
              </p>
            </div>

            <div className="relative z-10 text-sm text-white/70">
              ID: {id}
            </div>
          </aside>

          {/* FORMULARIO */}
          <div className="px-8 py-10">

            <h2 className="text-2xl font-semibold text-slate-800">
              Datos del usuario
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
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

              <label className="flex items-center gap-3 text-slate-700">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#5d80c8]"
                />
                Usuario activo
              </label>

              {/* BOTÓN IGUAL AL LOGIN */}
              <button
                className="w-full rounded-full bg-[linear-gradient(90deg,#7796db_0%,#5d80c8_45%,#3b5f9f_100%)] px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Guardar cambios
              </button>

            </form>
          </div>

        </section>
      </div>
    </main>
  );
}
