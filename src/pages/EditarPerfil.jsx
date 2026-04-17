import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { PageShell } from "../components/PageShell";

function CampoEditable({ error, ...props }) {
  return (
    <div>
      <input
        {...props}
        className={`w-full rounded-[1.1rem] bg-slate-50 px-4 py-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-[var(--color-acc1)]/20 ${props.className || ""}`}
      />
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

export default function EditarPerfil() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);

  const { request: getProfile } = useAxios("/profile/me", { auto: false });
  const { loading: updateLoading, request: updateProfile } = useAxios("/profile/me", {
    method: "PATCH",
    auto: false,
  });
  const { request: getCountries } = useAxios("/countries/", { auto: false });

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getProfile();
        const countriesData = await getCountries();

        setCountries(countriesData);
        setForm({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          middle_name: profile.middle_name || "",
          second_lastname: profile.second_lastname || "",
          email: profile.email || "",
          phone_number: profile.phone_number || "",
          birthdate: profile.birthdate ? profile.birthdate.split("T")[0] : "",
          country_id: profile.country_id ? String(profile.country_id) : "",
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getCountries, getProfile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      middle_name: form.middle_name || null,
      second_lastname: form.second_lastname || null,
      phone_number: form.phone_number,
      birthdate: form.birthdate,
      country_id: form.country_id ? Number(form.country_id) : null,
    };

    try {
      await updateProfile({ body: payload });
      alert("Perfil actualizado");
      navigate("/perfil");
    } catch (err) {
      console.error("ERROR BACKEND:", err.response?.data);

      if (err.response?.data?.detail) {
        const apiErrors = {};
        err.response.data.detail.forEach((item) => {
          const field = item.loc[item.loc.length - 1];
          apiErrors[field] = item.msg;
        });
        setErrors(apiErrors);
      } else {
        alert("Error al actualizar");
      }
    }
  };

  const nombreCompleto = useMemo(
    () => [form.first_name, form.last_name].filter(Boolean).join(" ") || "Editar perfil",
    [form.first_name, form.last_name],
  );

  const iniciales = useMemo(() => {
    const partes = [form.first_name, form.last_name].filter(Boolean);
    return partes.map((parte) => parte[0]?.toUpperCase()).join("").slice(0, 2) || "EP";
  }, [form.first_name, form.last_name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-acc1">
        Cargando...
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
                    {nombreCompleto}
                  </p>
                  <p className="mt-2 text-base text-slate-500">{form.email || "--"}</p>
                </div>
              </div>

              <div className="flex gap-3 md:pt-8">
                <button
                  onClick={() => navigate("/perfil")}
                  className="inline-flex min-w-[150px] items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="grid gap-4 md:grid-cols-2">
                <CampoEditable error={errors.first_name} name="first_name" onChange={handleChange} placeholder="Primer nombre" value={form.first_name} />
                <CampoEditable name="middle_name" onChange={handleChange} placeholder="Segundo nombre" value={form.middle_name} />
                <CampoEditable error={errors.last_name} name="last_name" onChange={handleChange} placeholder="Apellido" value={form.last_name} />
                <CampoEditable name="second_lastname" onChange={handleChange} placeholder="Segundo apellido" value={form.second_lastname} />
                <CampoEditable className="bg-slate-100 text-slate-400" disabled name="email" placeholder="Correo" value={form.email} />
                <CampoEditable error={errors.phone_number} name="phone_number" onChange={handleChange} placeholder="Telefono" value={form.phone_number} />
                <CampoEditable name="birthdate" onChange={handleChange} type="date" value={form.birthdate} />
                <div>
                  <select
                    className="w-full rounded-[1.1rem] bg-slate-50 px-4 py-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-[var(--color-acc1)]/20"
                    name="country_id"
                    onChange={handleChange}
                    value={form.country_id}
                  >
                    <option value="">Seleccionar pais</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-[var(--color-acc1)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(42,125,225,0.24)] transition hover:brightness-95"
                  type="submit"
                >
                  {updateLoading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  className="inline-flex min-w-[170px] items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  onClick={() => navigate("/perfil")}
                  type="button"
                >
                  Volver al perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
