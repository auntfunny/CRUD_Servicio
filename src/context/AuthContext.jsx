import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import useAxios from "../hooks/useAxios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authCheck, setAuthCheck] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const {
    loading: loginLoading,
    error: loginError,
    request: loginRequest,
  } = useAxios("/auth/login", {
    method: "POST",
  });
  const {
    loading: userLoading,
    error: userError,
    request: userRequest,
  } = useAxios("/profile/me", {
    method: "GET",
    auto: false,
  });
  const {
    loading: logoutLoading,
    error: logoutError,
    request: logoutRequest,
  } = useAxios("/auth/logout", { method: "POST" });

  const error = loginError || userError || logoutError;
  const loading = loginLoading || userLoading || logoutLoading;

  useEffect(() => {
    if (error) {
      console.error("Algo salió mal: ", error);
    }
  }, [error]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      reload();
    } else {
      setAuthCheck(true)
    }
  }, [cookies.token]);

  const reload = async () => {
    try {
      const data = await userRequest();

      setUser(data);
      setAuthCheck(true);
      if (data.role === "ADMIN") {
        navigate("/");
      } else if (data.role === "STUDENT") {
        navigate("/estudiante/dash");
      }
    } catch (error) {
      console.error(error);
      await logout();
    } 
  };

  const login = async (email, password) => {
    try {
      const loginResponse = await loginRequest({
        body: JSON.stringify({ email: email, password: password }),
      });

      const token = loginResponse?.access_token;
      setCookie("token", token, { path: "/" });

      if (!token) return;

      try {
        const data = await userRequest();

        setUser(data);
        setAuthCheck(true);

        if (data.role === "ADMIN") {
          navigate("/");
        } else if (data.role === "STUDENT") {
          navigate("/estudiante/dash");
        }
      } catch (error) {
        console.error(error);
        await logout();
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Error al hacer logout en el servidor");
    }

    removeCookie("token");
    setUser(null);
    setAuthCheck(true);

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authCheck,
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
