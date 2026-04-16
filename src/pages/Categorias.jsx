import React from "react";
import useAxios from "../hooks/useAxios";

const Categorias = () => {
    const {data, loading, error} = useAxios("/categories/");
    console.log(data);


  return (
    <div className="flex flex-col items-center justify-center gap-10  w-full min-h-screen">
      <div className="flex justify-between items-center w-11/12 md:w-4/5 h-20 bg-gray-200 rounded-xl p-6">
        <h2 className="text-lg text-acc2 font-avenir font-medium">Gestión de Categorias</h2>
        <button type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-acc1 text-white hover:bg-acc2 hover:cursor-pointer">
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
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-6 w-11/12 md:4/5">
        {loading && Array(4).fill().map((_,index) => (
            <div key={index} className="w-40 h-40 rounded-lg bg-gray-400 animate-pulse"></div>
        )) }
      </section>
    </div>
  );
};

export default Categorias;
