// Tarjeta de estadística individual

export default function TarjetaEstadistica({ valor, etiqueta, colorBorde }) {
  return (
    <div className={`bg-gray-100 rounded-2xl p-5 shadow border-t-4 ${colorBorde}`}>
      <p className="text-4xl font-extrabold text-[#003764]">{valor}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-2">
        {etiqueta}
      </p>
    </div>
  );
}