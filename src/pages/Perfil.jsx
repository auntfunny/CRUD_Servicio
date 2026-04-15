import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";

export default function Perfil() {
  const [form, setForm] = useState({
    id: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    second_lastname: "",
    email: "",
    phone_number: "",
    birthdate: "",
    country_id: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { request: getProfile } = useAxios("/profile/me", { auto: false });

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getProfile();

        setForm({
          id: profile.id || "",
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          middle_name: profile.middle_name || "",
          second_lastname: profile.second_lastname || "",
          email: profile.email || "",
          phone_number: profile.phone_number || "",
          // 🔥 CORRECCIÓN FECHA
          birthdate: profile.birthdate
            ? profile.birthdate.split("T")[0]
            : "",
          country_id: profile.country_id
            ? String(profile.country_id)
            : "",
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando perfil...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-8">
      <div className="mx-auto max-w-5xl">

        <section className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_35px_100px_rgba(7,19,39,0.32)] lg:grid-cols-[0.9fr_1.2fr]">

          {/* LADO IZQUIERDO */}
          <aside className="relative flex flex-col justify-between bg-[#143963] px-8 py-10 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(106,144,216,0.9)_0%,rgba(129,117,216,0.82)_40%,rgba(236,157,211,0.92)_78%,rgba(16,44,80,0.98)_100%)]" />

            <div className="relative z-10">
              <h1 className="text-2xl font-bold tracking-[0.2em]">FUNVAL</h1>
              <h2 className="mt-6 text-3xl font-semibold">Tu Perfil</h2>
              <p className="mt-4 text-sm text-white/80">
                Aquí puedes ver tu información personal.
              </p>
            </div>

            <div className="relative z-10 text-sm text-white/70">
              2026
            </div>
          </aside>

          {/* DATOS */}
          <div className="px-8 py-10">
            <h2 className="text-2xl font-semibold text-slate-800">
              Información del Perfil
            </h2>

            <div className="mt-8 space-y-6">

              <input value={form.first_name} disabled className="w-full border-b pb-2 bg-gray-100" />
              <input value={form.last_name} disabled className="w-full border-b pb-2 bg-gray-100" />
              <input value={form.email} disabled className="w-full border-b pb-2 bg-gray-100" />
              <input value={form.phone_number} disabled className="w-full border-b pb-2 bg-gray-100" />
              <input value={form.birthdate} disabled className="w-full border-b pb-2 bg-gray-100" />

              {/* 🔥 PAÍS DESDE API */}
              <input
                value={form.country_id ? `ID País: ${form.country_id}` : "No definido"}
                disabled
                className="w-full border-b pb-2 bg-gray-100"
              />

              {/* 🔥 BOTÓN CORREGIDO */}
              <button
                onClick={() => navigate(`/usuarios/${form.id}/editar`)}
                className="w-full rounded-full bg-[linear-gradient(90deg,#f4a024_0%,#f7b347_50%,#f4a024_100%)] px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Editar Perfil
              </button>

              <button
                onClick={() => navigate("/usuarios/crear")}
                className="w-full rounded-full bg-[linear-gradient(90deg,#5d80c8_0%,#3b5f9f_100%)] px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Crear Usuario
              </button>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}