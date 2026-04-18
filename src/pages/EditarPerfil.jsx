import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, PageHero, controlClass, panelBaseClass, primaryButtonClass, secondaryButtonClass } from "../components/PageShell";
import { ProfileSkeleton } from "../components/SkeletonBlocks";
import useAxios from "../hooks/useAxios";
import { useToast } from "../context/ToastContext";

function CampoEditable({ error, ...props }) {
  return (
    <div>
      <input
        {...props}
        className={`${controlClass} ${props.className || ""}`}
      />
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

export default function EditarPerfil() {
  const navigate = useNavigate();
  const {setToastMensaje} = useToast();

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
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getCountries, getProfile]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      await updateProfile({
        body: payload,
      });

      setToastMensaje("Perfil actualizado");
      navigate("/perfil");
    } catch (error) {
      if (error.response?.data?.detail) {
        const apiErrors = {};
        error.response.data.detail.forEach((item) => {
          const field = item.loc[item.loc.length - 1];
          apiErrors[field] = item.msg;
        });
        setErrors(apiErrors);
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
      <PageShell>
        <ProfileSkeleton editable />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHero
          eyebrow="Perfil"
          title={nombreCompleto}
          description={form.email || "--"}
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={() => navigate("/perfil")} type="button">
                Cancelar
              </button>
              <button className={primaryButtonClass} form="editar-perfil-form" type="submit">
                {updateLoading ? "Guardando..." : "Guardar cambios"}
              </button>
            </>
          )}
          meta={(
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#1f6ed4,_#7aa8eb)] font-montserrat text-3xl font-bold text-white shadow-[0_16px_30px_rgba(31,110,212,0.22)]">
              {iniciales}
            </div>
          )}
        />

        <form className={`${panelBaseClass} !bg-white`} id="editar-perfil-form" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <CampoEditable error={errors.first_name} name="first_name" onChange={handleChange} placeholder="Primer nombre" value={form.first_name} />
            <CampoEditable name="middle_name" onChange={handleChange} placeholder="Segundo nombre" value={form.middle_name} />
            <CampoEditable error={errors.last_name} name="last_name" onChange={handleChange} placeholder="Apellido" value={form.last_name} />
            <CampoEditable name="second_lastname" onChange={handleChange} placeholder="Segundo apellido" value={form.second_lastname} />
            <CampoEditable className="bg-slate-100 text-slate-400" disabled name="email" placeholder="Correo" value={form.email} />
            <CampoEditable error={errors.phone_number} name="phone_number" onChange={handleChange} placeholder="Telefono" value={form.phone_number} />
            <CampoEditable name="birthdate" onChange={handleChange} type="date" value={form.birthdate} />
            <div>
              <select className={controlClass} name="country_id" onChange={handleChange} value={form.country_id}>
                <option value="">Seleccionar pais</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
