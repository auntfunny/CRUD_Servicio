import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";

export default function EditarUsuario() {
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
  const { request: updateProfile } = useAxios("/profile/me", {
    method: "PATCH",
    auto: false,
  });

  const { request: getCountries } = useAxios("/countries/", {
    auto: false,
  });

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
      await updateProfile({
        body: payload,
      });

      alert("Perfil actualizado");
      navigate("/perfil");
    } catch (err) {
      console.error("ERROR BACKEND:", err.response?.data);

      //MANEJO DE ERRORES 422
      if (err.response?.data?.detail) {
        const apiErrors = {};
        err.response.data.detail.forEach((e) => {
          const field = e.loc[e.loc.length - 1];
          apiErrors[field] = e.msg;
        });
        setErrors(apiErrors);
      } else {
        alert("Error al actualizar");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
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
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(106,144,216,0.9)_0%,rgba(129,117,216,0.82)_40%,rgba(236,157,211,0.92)_78%,rgba(16,44,80,0.98)_100%)]" />

            <div className="relative z-10">
              <h1 className="text-2xl font-bold tracking-[0.2em]">FUNVAL</h1>
              <h2 className="mt-6 text-3xl font-semibold">Editar Perfil</h2>
              <p className="mt-4 text-sm text-white/80">
                Modifica tu información personal.
              </p>
            </div>

            <div className="relative z-10 text-sm text-white/70">
              2026
            </div>
          </aside>

          {/* FORM */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="mt-4 space-y-6">

              <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Nombre" className="w-full border-b pb-2 outline-none" />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}

              <input name="middle_name" value={form.middle_name} onChange={handleChange} placeholder="Segundo nombre" className="w-full border-b pb-2 outline-none" />

              <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Apellido" className="w-full border-b pb-2 outline-none" />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

              <input name="second_lastname" value={form.second_lastname} onChange={handleChange} placeholder="Segundo apellido" className="w-full border-b pb-2 outline-none" />

              <input name="email" value={form.email} disabled className="w-full border-b pb-2 outline-none bg-gray-100" />

              <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Teléfono" className="w-full border-b pb-2 outline-none" />
              {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}

              <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="w-full border-b pb-2 outline-none" />

              <select name="country_id" value={form.country_id} onChange={handleChange} className="w-full border-b pb-2 outline-none">
                <option value="">Seleccionar país</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button className="w-full rounded-full bg-[linear-gradient(90deg,#f4a024,#f7b347,#f4a024)] py-3 text-white font-semibold">
                Guardar Cambios
              </button>

            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
