export default function FilaCategoria({ nombre, total_reportes, horas_aprobadas }) {
  return (
    <div className="bg-gray-100 rounded-2xl px-5 py-4 shadow flex items-center justify-between">
      <p className="font-bold text-[#2a7de1] text-sm">{nombre}</p>
      <div className="flex gap-6 text-center">
        <div>
          <p className="text-lg font-extrabold text-[#003764]">{total_reportes}</p>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
            Reportes </p>
        </div>
        <div>
          <p className="text-lg font-extrabold text-[#003764]">{horas_aprobadas}</p>
          <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
            Hrs aprobadas </p>
        </div>
      </div>
    </div>
  );
}