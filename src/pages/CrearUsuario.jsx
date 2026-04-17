import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useToast } from "../context/ToastContext";

export default function CrearUsuario() {
  const navigate = useNavigate();
  const { setToastMensaje } = useToast();

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

  const {
    data: paisData,
    loading: paisLoading,
    error: paisError,
  } = useAxios("/countries/");
  const {
    data: cursoData,
    loading: cursoLoading,
    error: cursoError,
  } = useAxios("/courses/");
  const { data, loading, error, request } = useAxios("/users/", {
    method: "POST",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrors({});
    setMensaje(null);

    if (!form.email.endsWith("@funval.com")) {
      setMensaje({
        tipo: "error",
        texto: "El email debe ser @funval.com",
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

      setToastMensaje("Usuario creado correctamente");

      navigate("/usuarios");
    } catch (error) {
      console.log("ERROR API:", error.response?.data);

      const response = error.response?.data;

      if (response?.errors) {
        const apiErrors = {};

        response.errors.forEach((e, index) => {
          const field = e.loc?.length
            ? e.loc[e.loc.length - 1]
            : e.field || `error_${index}`;

          apiErrors[field] = e.msg || "Error en el campo";
        });

        setErrors(apiErrors);

        setMensaje({
          tipo: "error",
          texto: "Revisa los campos ❌",
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: response?.detail || "Error del servidor ❌",
        });
      }
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] p-4 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-[32px] p-8 shadow-[0_35px_100px_rgba(7,19,39,0.32)]">
        <h2 className="text-2xl font-semibold text-slate-800">Crear Usuario</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            name="first_name"
            placeholder="Nombre"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border-b pb-2"
            required
          />
          <input
            name="middle_name"
            placeholder="Segundo nombre"
            value={form.middle_name}
            onChange={handleChange}
            className="w-full border-b pb-2"
          />
          <input
            name="last_name"
            placeholder="Apellido"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border-b pb-2"
            required
          />
          <input
            name="second_lastname"
            placeholder="Segundo apellido"
            value={form.second_lastname}
            onChange={handleChange}
            className="w-full border-b pb-2"
          />

          <input
            name="email"
            placeholder="Email (@funval.com)"
            value={form.email}
            onChange={handleChange}
            className="w-full border-b pb-2"
            required
          />
          <input
            name="document_number"
            placeholder="Documento"
            value={form.document_number}
            onChange={handleChange}
            className="w-full border-b pb-2"
            required
          />

          <input
            name="phone_number"
            placeholder="Teléfono"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full border-b pb-2"
          />

          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            className="w-full border-b pb-2"
          />

          <select
            name="country_id"
            id="country_id"
            onChange={handleChange}
            className="w-full border-b pb-2"
            required
          >
            <option value="">Seleccione un país</option>
            {paisData?.map((pais) => (
              <option key={pais.id} value={pais.id}>
                {pais.name}
              </option>
            ))}
          </select>
          <select
            name="course_id"
            id="course_id"
            onChange={handleChange}
            className="w-full border-b pb-2"
            required
          >
            <option value="">Seleccione un curso</option>
            {cursoData?.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.name}
              </option>
            ))}
          </select>

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border-b pb-2"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border-b pb-2"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="STUDENT">STUDENT</option>
          </select>

          <button
            disabled={loading}
            className="w-full rounded-full bg-[linear-gradient(90deg,#7796db,#3b5f9f)] px-6 py-3 text-white font-semibold"
          >
            {loading ? "Creando..." : "Crear usuario"}
          </button>
        </form>

        {mensaje && (
          <div
            className={`mt-6 px-4 py-3 text-sm ${
              mensaje.tipo === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensaje.texto}
          </div>
        )}
      </div>
    </main>
  );
}
