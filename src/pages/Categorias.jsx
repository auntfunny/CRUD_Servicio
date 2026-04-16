import { useState } from "react";
import useAxios from "../hooks/useAxios";
import ModalAgregarEditar from "../components/ModalAgregarEditar";

const Categorias = () => {
  const [modalAgregar, setModalAgregar] = useState(false);
    const {data, loading, error} = useAxios("/categories/");

    const handleCloseAgregar = () => {
      setModalAgregar(false);
    }

  return (
    <div className="flex flex-col items-center gap-10 py-18 w-full min-h-screen">
      {modalAgregar && <ModalAgregarEditar url={"/categories/"} campos={{name: "", description: ""}} cerrar={handleCloseAgregar} />}
      <div className="flex justify-between items-center w-11/12 md:w-4/5 h-20 bg-gray-200 rounded-xl p-6">
        <h2 className="text-lg text-acc2 font-avenir font-medium">Gestión de Categorias</h2>
        <button onClick={() => setModalAgregar(true)} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-acc1 text-white hover:bg-acc2 hover:cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-2 lg:gap-4">
        {loading ? Array(4).fill().map((_,index) => (
            <div key={index} className="w-40 h-40 md:w-50 md:h-50 rounded-lg bg-gray-400 animate-pulse"></div>
        )) : data?.map((category) => (
          <div key={category.id} className="flex flex-col justify-between w-40 h-40 md:w-50 md:h-50 p-2 rounded-lg bg-gray-100 border border-acc1 shadow-lg">
            <p className="text-xs text-gray-500">{category.id}</p>
            <div className="px-3 flex flex-col justify-center h-full gap-2">
              <h3 className="text-acc1 text-sm md:text-lg font-avenir text-center">{category.name}</h3>
              <p className="text-acc2 text-xs md:text-base font-montserrat line-clamp-2">{category.description}</p>
            </div>
            <p className="text-xs text-gray-500">Creado: {category.created_at.split("T")[0]}</p>
          </div>
        )) }
      </section>
    </div>
  );
};

export default Categorias;
