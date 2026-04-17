import { createContext, useContext, useEffect, useState } from "react";
import ToastCaja from "../components/ToastCaja";


const ToastContext = createContext();

export const ToastProvider = ({children}) => {
    const [toastMensaje, setToastMensaje] = useState("");
    const [mostrarToast, setMostrarToast] = useState(false);
    const [toastClases, setToastClases] = useState("translate-y-40");


    useEffect(() => {
        if(toastMensaje){
            setMostrarToast(true);

            setTimeout(() => {
                setMostrarToast(false);
                setToastMensaje("")
            }, 3000)
        }
    }, [toastMensaje]);

    useEffect(() => {
        if(mostrarToast){
            setToastClases("");
        } else {
            setToastClases("translate-y-40")
        }
    }, [mostrarToast]);

    return (
        <ToastContext.Provider value={{ setToastMensaje }}>
            <ToastCaja toastMensaje={toastMensaje} toastClases={toastClases} setMostrarToast={setMostrarToast}/>
            {children}
        </ToastContext.Provider>
    )

}

export const useToast = () => useContext(ToastContext)