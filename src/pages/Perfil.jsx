import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { PageShell } from "../components/PageShell";

function CampoPerfil({ etiqueta, valor }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-700">{etiqueta}</p>
      <div className="rounded-[1.1rem] bg-slate-50 px-4 py-4 text-sm text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        {valor || "--"}
      </div>
    </div>
  );
}

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

  const { data: perfil, loading: loadingPerfil } = useAxios("/profile/me");
  const { loading: loadingPais, request: requestPais } = useAxios("", { auto: false });

  const loading = loadingPerfil || loadingPais;

  useEffect(() => {
    const load = async () => {
      try {
        const pais = await requestPais({ url: `/countries/${perfil.country_id}` });

        setForm({
          id: perfil.id || "",
          first_name: perfil.first_name || "",
          last_name: perfil.last_name || "",
          middle_name: perfil.middle_name || "",
          second_lastname: perfil.second_lastname || "",
          email: perfil.email || "",
          phone_number: perfil.phone_number || "",
          birthdate: perfil.birthdate ? perfil.birthdate.split("T")[0] : "",
          country_id: pais.name || "",
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    };

    if (perfil) {
      load();
    }
  }, [perfil, requestPais]);

  const nombreCompleto = useMemo(
    () =>
      [
        form.first_name,
        form.middle_name,
        form.last_name,
        form.second_lastname,
      ]
        .filter(Boolean)
        .join(" "),
    [form.first_name, form.middle_name, form.last_name, form.second_lastname],
  );

  const iniciales = useMemo(() => {
    const partes = [form.first_name, form.last_name].filter(Boolean);
    return partes.map((parte) => parte[0]?.toUpperCase()).join("").slice(0, 2) || "FP";
  }, [form.first_name, form.last_name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-acc1">
        Cargando perfil...
      </div>
    );
  }

  return (
    <PageShell>
      <section className="rounded-[2rem] bg-white/60 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-4">
        <div className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
          <div className="h-28 bg-[linear-gradient(90deg,_rgba(160,198,243,0.95),_rgba(230,236,247,0.92)_55%,_rgba(251,241,204,0.92))] md:h-32" />

          <div className="px-5 pb-6 pt-0 md:px-8 md:pb-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-[linear-gradient(135deg,_#1f6ed4,_#7aa8eb)] font-montserrat text-2xl font-bold text-white shadow-[0_16px_30px_rgba(31,110,212,0.22)] md:-mt-14 md:h-28 md:w-28 md:text-3xl">
                  {iniciales}
                </div>

                <div className="pt-1 md:pt-10">
                  <p className="font-montserrat text-2xl font-bold text-slate-800 md:text-3xl">
                    {nombreCompleto || "Mi perfil"}
                  </p>
                  <p className="mt-2 text-base text-slate-500">{form.email || "--"}</p>
                </div>
              </div>

              <div className="flex gap-3 md:pt-8">
                <button
                  onClick={() => navigate("/perfil/editar")}
                  className="inline-flex min-w-[150px] items-center justify-center rounded-xl bg-[var(--color-acc1)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(42,125,225,0.24)] transition hover:brightness-95"
                >
                  Editar
                </button>
                <button
                  onClick={() => navigate("/cambiarpassword")}
                  className="inline-flex min-w-[170px] items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Cambiar contrasena
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <CampoPerfil etiqueta="Primer nombre" valor={form.first_name} />
              <CampoPerfil etiqueta="Segundo nombre" valor={form.middle_name} />
              <CampoPerfil etiqueta="Apellido" valor={form.last_name} />
              <CampoPerfil etiqueta="Segundo apellido" valor={form.second_lastname} />
              <CampoPerfil etiqueta="Correo" valor={form.email} />
              <CampoPerfil etiqueta="Telefono" valor={form.phone_number} />
              <CampoPerfil etiqueta="Fecha de nacimiento" valor={form.birthdate} />
              <CampoPerfil etiqueta="Pais" valor={form.country_id} />
            </div>

            <div className="mt-8 rounded-[1.4rem] bg-slate-50 px-5 py-5">
              <p className="text-sm font-semibold text-slate-700">Resumen rapido</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.1rem] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Estado</p>
                  <p className="mt-2 font-montserrat text-2xl font-bold text-[var(--color-acc2)]">Activo</p>
                </div>
                <div className="rounded-[1.1rem] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Pais</p>
                  <p className="mt-2 text-base font-medium text-slate-700">{form.country_id || "--"}</p>
                </div>
                <div className="rounded-[1.1rem] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">ID de usuario</p>
                  <p className="mt-2 text-base font-medium text-slate-700">{form.id || "--"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
