import { createContext, useContext, useEffect, useRef, useState } from "react";
import ToastCaja from "../components/ToastCaja";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastMensaje, setToastMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  const timeoutRef = useRef(null);

  const cerrarToast = () => {
    setMostrarToast(false);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setToastMensaje("");
    }, 220);
  };

  useEffect(() => {
    if (!toastMensaje) return undefined;

    setMostrarToast(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      cerrarToast();
    }, 3000);

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, [toastMensaje]);

  return (
    <ToastContext.Provider value={{ toastMensaje, setToastMensaje }}>
      <ToastCaja
        onClose={cerrarToast}
        toastMensaje={toastMensaje}
        visible={mostrarToast && Boolean(toastMensaje)}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
