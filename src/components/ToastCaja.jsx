import React from "react";

const ToastCaja = ({toastMensaje, toastClases, setMostrarToast}) => {
    

  return (
    <aside className={`${toastClases} fixed bottom-0 right-5 flex flex-col z-30 p-4 h-40 gap-3 w-xs rounded-t-lg overflow-hidden bg-acc1 transition-transform duration-500 ease-in-out`} >
      <p className="text-lg text-acc3">Nuevo Mensaje!</p>
      <p className="text-white">{toastMensaje}</p>
      <button onClick={() => setMostrarToast(false)} type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="absolute top-3 right-3 size-6 text-gray-400 hover:text-red-500 hover:cursor-pointer active:scale-125"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </aside>
  );
};

export default ToastCaja;
