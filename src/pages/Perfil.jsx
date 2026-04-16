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

  const navigate = useNavigate();

  const {data: perfil, loading: loadingPerfil, error: errorPerfil } = useAxios("/profile/me");
  const {loading: loadingPais, error: errorPais,request: requestPais} = useAxios("", {auto: false});

  const loading = loadingPerfil || loadingPais;

  useEffect(() => {
    const load = async () => {
      try {
        const pais = await requestPais({url: `/countries/${perfil.country_id}`})

        setForm({
          id: perfil.id || "",
          first_name: perfil.first_name || "",
          last_name: perfil.last_name || "",
          middle_name: perfil.middle_name || "",
          second_lastname: perfil.second_lastname || "",
          email: perfil.email || "",
          phone_number: perfil.phone_number || "",
          // 🔥 CORRECCIÓN FECHA
          birthdate: perfil.birthdate
            ? perfil.birthdate.split("T")[0]
            : "",
          country_id: pais.name,
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } 
    };
    
    if(perfil){
      load();
    }
  }, [perfil]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-acc1">
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
                value={form.country_id}
                disabled
                className="w-full border-b pb-2 bg-gray-100"
              />

              {/* 🔥 BOTÓN CORREGIDO */}
              <button
                onClick={() => navigate(`/perfil/editar`)}
                className="w-full rounded-full bg-[linear-gradient(90deg,#f4a024_0%,#f7b347_50%,#f4a024_100%)] px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Editar Perfil
              </button>
              <button
                onClick={() => navigate(`/cambiarpassword`)}
                className="w-full rounded-full bg-linear-to-r from-acc2 via-acc1 to-acc2 px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Cambiar Contraseña
              </button>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}