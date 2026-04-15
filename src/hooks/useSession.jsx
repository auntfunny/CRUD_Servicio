import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

const useSession = (user) => {
  const [cookies] = useCookies(["token"]);
  const { pathname } = useLocation();
  const [notification, setNotification] = useState("");

  const checkedUser = cookies?.token ? user : null;

  useEffect(() => {
    if (user?.role && !cookies?.token) {
      setNotification("Sesión expirada, por favor ingrese de nuevo.");
    } else {
      setNotification("");
    }
  }, [user, cookies.token, pathname]);

  return { user: checkedUser, notification };
};

export default useSession;
