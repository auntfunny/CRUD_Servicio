import { useState } from "react";
import useAxios from "../hooks/useAxios";
import { useToast } from "../context/ToastContext";

export default function ImportUsers() {
  const {setToastMensaje} = useToast(); 
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [exporting, setExporting] = useState(false);

  const { loading, error, request } = useAxios("/users/bulk", {
    method: "POST",
  });
  const { request: requestUsuarios } = useAxios("/users/", {
    auto: false,
    params: { page_size: 100 },
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const importUsersCSV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await request({
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const data = await importUsersCSV(file);
      setToastMensaje("Usuarios importados correctemente");
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error al importar usuarios");
    }
  };

  // EXPORT FIXED (SIN fetch RELATIVO)
  const exportToCSV = async () => {
    try {
      setExporting(true);
      let page = 1;
      let allUsers = [];
      let hasMore = true;

      while (hasMore) {
        const response = await requestUsuarios({ params: { page: page } });
        allUsers = [...allUsers, ...response.items];

        if (allUsers.length >= response.total || response.items.length === 0) {
          hasMore = false;
        } else {
          page++;
        }
      }

      const headers = "email,first_name,last_name,document_number,role\n";

      const rows = allUsers
        .map((u) => {
          return [
            `"${u.email}"`,
            `"${u.first_name}"`,
            `"${u.last_name}"`,
            `"${u.document_number}"`,
            `"${u.role || "STUDENT"}"`,
          ].join(",");
        })
        .join("\n");

      const csvContent = headers + rows;

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "usuarios_exportados.csv";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error al exportar usuarios");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📥 Importar usuarios
        </h2>

        <p className="text-gray-500 mb-6">
          Carga un archivo CSV con los usuarios a registrar
        </p>

        {/* UPLOAD */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csvUpload"
          />

          <label
            htmlFor="csvUpload"
            className="cursor-pointer text-blue-600 font-medium"
          >
            Selecciona un archivo CSV
          </label>

          {file && <p className="mt-3 text-sm text-gray-600">📄 {file.name}</p>}
        </div>

        {/* IMPORT BUTTON */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold transition
            ${
              !file || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {loading ? "Importando..." : "Subir archivo"}
        </button>

        {/* EXPORT BUTTON */}
        <button
          onClick={exportToCSV}
          disabled={exporting}
          className="w-full mt-3 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition"
        >
          {exporting ? "Exportando..." : "📤 Exportar usuarios a CSV"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-8 bg-gray-50 border rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Resultado de importación
            </h3>

            <div className="flex gap-4 mb-4">
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                ✔ Creados: {result.created}
              </div>

              <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg">
                ⚠ Omitidos: {result.skipped}
              </div>
            </div>

            {result.errors?.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Errores</h4>

                <ul className="list-disc pl-5 text-sm text-red-500 space-y-1">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
