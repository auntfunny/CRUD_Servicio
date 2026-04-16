function ModalBase({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded border bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="rounded border px-3 py-1 text-sm"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default ModalBase;
