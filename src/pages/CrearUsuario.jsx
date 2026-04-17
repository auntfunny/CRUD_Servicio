import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, PageHero, controlClass, panelBaseClass, primaryButtonClass, secondaryButtonClass } from "../components/PageShell";
import useAxios from "../hooks/useAxios";

function Field({ error, label, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error ? <span className="text-sm text-rose-600">{error}</span> : null}
    </label>
  );
}

export default function CrearUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    second_lastname: "",
    document_number: "",
    phone_number: "",
    birthdate: "",
    country_id: "",
    course_id: "",
    role: "STUDENT",
    password: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: paisData } = useAxios("/countries/");
  const { data: cursoData } = useAxios("/courses/");
  const { loading, request } = useAxios("/users/", { method: "POST" });

  function handleChange(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErrors({});
    setMensaje(null);

    if (!form.email.endsWith("@funval.com")) {
      setMensaje({
        tipo: "error",
        texto: "El correo debe pertenecer al dominio @funval.com.",
      });
      return;
    }

    const payload = {
      email: form.email,
      first_name: form.first_name,
      middle_name: form.middle_name || undefined,
      last_name: form.last_name,
      second_lastname: form.second_lastname || undefined,
      document_number: form.document_number,
      phone_number: form.phone_number || undefined,
      birthdate: form.birthdate || undefined,
      role: form.role,
      password: form.password || form.document_number,
      country_id: form.country_id,
      course_id: form.course_id,
    };

    try {
      await request({ body: payload });
      setMensaje({ tipo: "ok", texto: "Usuario creado correctamente." });
      setTimeout(() => {
        navigate("/usuarios");
      }, 1200);
    } catch (error) {
      const response = error.response?.data;

      if (Array.isArray(response?.errors)) {
        const apiErrors = {};
        response.errors.forEach((item, index) => {
          const field = item.loc?.length ? item.loc[item.loc.length - 1] : item.field || `error_${index}`;
          apiErrors[field] = item.msg || "Error en el campo";
        });
        setErrors(apiErrors);
        setMensaje({ tipo: "error", texto: "Revisa los campos obligatorios." });
        return;
      }

      setMensaje({
        tipo: "error",
        texto: response?.detail || "No se pudo crear el usuario.",
      });
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHero
          eyebrow="Usuarios"
          title="Crear usuario"
          description="Registra un nuevo administrador o estudiante usando la misma estructura visual del panel."
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={() => navigate("/usuarios")} type="button">
                Volver a usuarios
              </button>
              <button className={primaryButtonClass} disabled={loading} form="crear-usuario-form" type="submit">
                {loading ? "Creando..." : "Guardar usuario"}
              </button>
            </>
          )}
        />

        <form className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" id="crear-usuario-form" onSubmit={handleSubmit}>
          <section className={`${panelBaseClass} !bg-white space-y-6`}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Datos personales
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Informacion principal</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field error={errors.first_name} label="Primer nombre">
                <input className={controlClass} name="first_name" onChange={handleChange} required value={form.first_name} />
              </Field>
              <Field label="Segundo nombre">
                <input className={controlClass} name="middle_name" onChange={handleChange} value={form.middle_name} />
              </Field>
              <Field error={errors.last_name} label="Apellido">
                <input className={controlClass} name="last_name" onChange={handleChange} required value={form.last_name} />
              </Field>
              <Field label="Segundo apellido">
                <input className={controlClass} name="second_lastname" onChange={handleChange} value={form.second_lastname} />
              </Field>
              <Field error={errors.email} label="Correo institucional">
                <input className={controlClass} name="email" onChange={handleChange} placeholder="usuario@funval.com" required value={form.email} />
              </Field>
              <Field error={errors.document_number} label="Documento">
                <input className={controlClass} name="document_number" onChange={handleChange} required value={form.document_number} />
              </Field>
              <Field error={errors.phone_number} label="Telefono">
                <input className={controlClass} name="phone_number" onChange={handleChange} value={form.phone_number} />
              </Field>
              <Field label="Fecha de nacimiento">
                <input className={controlClass} name="birthdate" onChange={handleChange} type="date" value={form.birthdate} />
              </Field>
            </div>
          </section>

          <aside className="space-y-6">
            <section className={`${panelBaseClass} !bg-white space-y-5`}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Asignacion
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Rol y contexto</h2>
              </div>

              <Field error={errors.country_id} label="Pais">
                <select className={controlClass} name="country_id" onChange={handleChange} required value={form.country_id}>
                  <option value="">Selecciona un pais</option>
                  {paisData?.map((pais) => (
                    <option key={pais.id} value={pais.id}>{pais.name}</option>
                  ))}
                </select>
              </Field>

              <Field error={errors.course_id} label="Curso">
                <select className={controlClass} name="course_id" onChange={handleChange} required value={form.course_id}>
                  <option value="">Selecciona un curso</option>
                  {cursoData?.map((curso) => (
                    <option key={curso.id} value={curso.id}>{curso.name}</option>
                  ))}
                </select>
              </Field>

              <Field error={errors.role} label="Rol">
                <select className={controlClass} name="role" onChange={handleChange} value={form.role}>
                  <option value="ADMIN">Administrador</option>
                  <option value="STUDENT">Estudiante</option>
                </select>
              </Field>

              <Field error={errors.password} label="Contrasena inicial">
                <input className={controlClass} name="password" onChange={handleChange} placeholder="Opcional" type="password" value={form.password} />
              </Field>
            </section>

            <section className={`${panelBaseClass} !bg-white`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Resumen
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Nombre:</span> {[form.first_name, form.middle_name, form.last_name, form.second_lastname].filter(Boolean).join(" ") || "--"}</p>
                <p><span className="font-semibold text-slate-800">Rol:</span> {form.role === "ADMIN" ? "Administrador" : "Estudiante"}</p>
                <p><span className="font-semibold text-slate-800">Acceso:</span> {form.password ? "Contrasena definida" : "Usara el documento como contrasena inicial"}</p>
              </div>
            </section>
          </aside>
        </form>

        {mensaje ? (
          <section className={`${panelBaseClass} !bg-white ${mensaje.tipo === "ok" ? "text-emerald-700" : "text-rose-700"}`}>
            {mensaje.texto}
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
