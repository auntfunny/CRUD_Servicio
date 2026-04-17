import ModalBase from "./ModalBase";

function ModalConfirmacion({ titulo, mensaje, onConfirm, onCancel }) {
  return (
    <ModalBase
      onClose={onCancel}
      title={titulo}
      widthClass="max-w-md"
      zClass="z-[60]"
    >
      <div className="space-y-6">
        <p className="text-sm leading-6 text-slate-600">{mensaje}</p>
        <div className="flex justify-end gap-3">
          <button
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            onClick={onConfirm}
            type="button"
          >
            Confirmar
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

export default ModalConfirmacion;
