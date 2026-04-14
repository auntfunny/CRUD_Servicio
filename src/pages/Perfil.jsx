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
        const [profileRes, countriesRes] = await Promise.all([
          api.get("/profile/me"),
          api.get("/countries/"),
        ]);

        setForm(profileRes.data);
        setCountries(countriesRes.data || []);
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

    await api.patch("/profile/me", form);

    alert("Perfil actualizado");
  }

  if (loading) return <h2>Cargando...</h2>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="first_name" value={form.first_name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="phone_number" value={form.phone_number} onChange={handleChange} />
      <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />

      <select name="country_id" value={form.country_id} onChange={handleChange}>
        <option value="">Seleccionar</option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button>Guardar</button>
    </form>
  );
}