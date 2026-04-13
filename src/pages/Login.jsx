import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    //Validación básica
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://hs-api.devfunval.cloud/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // guardar sesión en contexto
      await login(data);

      //decodificar token
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));

      // redirección según rol
      if (payload.role === "ADMIN") {
        navigate("/");
      } else if (payload.role === "STUDENT") {
        navigate("/estudiante/dash");
      }

    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}