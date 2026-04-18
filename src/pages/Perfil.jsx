import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, PageHero, panelBaseClass, primaryButtonClass, secondaryButtonClass } from "../components/PageShell";
import { ProfileSkeleton } from "../components/SkeletonBlocks";
import useAxios from "../hooks/useAxios";

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
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    if (perfil) {
      load();
    }
  }, [perfil, requestPais]);

  const nombreCompleto = useMemo(
    () => [form.first_name, form.middle_name, form.last_name, form.second_lastname].filter(Boolean).join(" "),
    [form.first_name, form.middle_name, form.last_name, form.second_lastname],
  );

  const iniciales = useMemo(() => {
    const partes = [form.first_name, form.last_name].filter(Boolean);
    return partes.map((parte) => parte[0]?.toUpperCase()).join("").slice(0, 2) || "FP";
  }, [form.first_name, form.last_name]);

  if (loading) {
    return (
      <PageShell>
        <ProfileSkeleton />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHero
          eyebrow="Perfil"
          title={nombreCompleto || "Mi perfil"}
          description={form.email || "--"}
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={() => navigate("/cambiarpassword")} type="button">
                Cambiar contraseña
              </button>
              <button className={primaryButtonClass} onClick={() => navigate("/perfil/editar")} type="button">
                Editar perfil
              </button>
            </>
          )}
          meta={(
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#1f6ed4,_#7aa8eb)] font-montserrat text-3xl font-bold text-white shadow-[0_16px_30px_rgba(31,110,212,0.22)]">
              {iniciales}
            </div>
          )}
        />

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className={`${panelBaseClass} !bg-white`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Información personal
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <CampoPerfil etiqueta="Primer nombre" valor={form.first_name} />
              <CampoPerfil etiqueta="Segundo nombre" valor={form.middle_name} />
              <CampoPerfil etiqueta="Apellido" valor={form.last_name} />
              <CampoPerfil etiqueta="Segundo apellido" valor={form.second_lastname} />
              <CampoPerfil etiqueta="Correo" valor={form.email} />
              <CampoPerfil etiqueta="Telefono" valor={form.phone_number} />
              <CampoPerfil etiqueta="Fecha de nacimiento" valor={form.birthdate} />
              <CampoPerfil etiqueta="Pais" valor={form.country_id} />
            </div>
          </article>

          <aside className="space-y-6">
            <section className={`${panelBaseClass} !bg-white`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Resumen
              </p>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Estado:</span> Activo</p>
                <p><span className="font-semibold text-slate-800">Pais:</span> {form.country_id || "--"}</p>
                <p><span className="font-semibold text-slate-800">ID de usuario:</span> {form.id || "--"}</p>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </PageShell>
  );
}
