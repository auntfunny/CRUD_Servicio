import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Verificar sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      //VALIDACIÓN DE ROL
      const validRoles = ["ADMIN", "STUDENT"];

      if (!validRoles.includes(payload.role)) {
        logout();
        return;
      }

      //verificar expiración
      if (payload.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      //reconstruir sesión desde el token
      setUser({
        id: payload.sub,
        role: payload.role,
      });

      setRole(payload.role);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  //LOGIN
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://hs-api.devfunval.cloud/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!res.ok) {
        alert("Credenciales incorrectas");
        setLoading(false);
        return;
      }

      const data = await res.json();

      const token = data.access_token;

      if (!token) return;

      localStorage.setItem("token", token);

      try {
        const decoded = jwtDecode(token);

        //VALIDACIÓN DE ROL
        const validRoles = ["ADMIN", "STUDENT"];

        if (!validRoles.includes(decoded.role)) {
          logout();
          return;
        }

        setUser({
          id: decoded.sub,
          role: decoded.role,
        });

        setRole(decoded.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decodificando token", error);
        logout();
      }

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
  };

  //LOGOUT
  const logout = async () => {
    try {
      await fetch("https://hs-api.devfunval.cloud/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.warn("Error al hacer logout en el servidor");
    }

    // limpiar sesión local SIEMPRE
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);

    //redirección
    window.location.href = "/#/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
