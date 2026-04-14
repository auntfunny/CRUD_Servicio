import { useEffect, useState } from "react";
import { instance as api } from "../api";

export default function Perfil() {
  const [form, setForm] = useState({
    first_name: "",
    email: "",
    phone_number: "",
    birthdate: "",
    country_id: "",
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // SIMULACIÓN
        const fakeProfile = {
          first_name: "Martin",
          email: "martin@funval.com",
          phone_number: "123456789",
          birthdate: "1995-05-10",
          country_id: 1,
        };

        const fakeCountries = [
          { id: 1, name: "Argentina" },
          { id: 2, name: "México" },
          { id: 3, name: "Colombia" },
        ];

        await new Promise((res) => setTimeout(res, 500));

        setForm(fakeProfile);
        setCountries(fakeCountries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.patch("/profile/me", form);
      alert("Perfil actualizado");
    } catch (error) {
      alert("Error al actualizar (token inválido)");
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
          
          {/* LADO IZQUIERDO (decoración igual que login) */}
          <aside className="relative flex flex-col justify-between bg-[#143963] px-8 py-10 text-white">
            
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(106,144,216,0.9)_0%,rgba(129,117,216,0.82)_40%,rgba(236,157,211,0.92)_78%,rgba(16,44,80,0.98)_100%)]" />
            
            <div className="relative z-10">
              <h1 className="text-2xl font-bold tracking-[0.2em]">FUNVAL</h1>
              <h2 className="mt-6 text-3xl font-semibold">
                Tu Perfil
              </h2>
              <p className="mt-4 text-sm text-white/80">
                Aquí puedes actualizar tu información personal.
              </p>
            </div>

            <div className="relative z-10 text-sm text-white/70">
              2026
            </div>
          </aside>

          {/* FORMULARIO */}
          <div className="px-8 py-10">
            
            <h2 className="text-2xl font-semibold text-slate-800">
              Editar Perfil
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

              {/* INPUT */}
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

              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
              />

              <input
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
              />

              <select
                name="country_id"
                value={form.country_id}
                onChange={handleChange}
                className="w-full border-b border-slate-300 pb-2 outline-none focus:border-[#5d80c8]"
              >
                <option value="">Seleccionar país</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* BOTÓN */}
              <button
                className="w-full rounded-full bg-[linear-gradient(90deg,#f4a024_0%,#f7b347_50%,#f4a024_100%)] px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Guardar Cambios
              </button>

            </form>
          </div>
        </section>
      </div>
    </main>
  );
}