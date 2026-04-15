import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

const useSession = (user) => {
  const [cookies] = useCookies(["token"]);
  const {pathname} = useLocation
  let notification = "";

  useEffect(() => {
    if (user?.role && !cookies?.token) {
      user = null;
      notification = "Sesión expirada, por favor ingrese de nuevo.";
    }
  }, [user, cookies.token, pathname]);


  return { user, notification };
};

export default useSession;
