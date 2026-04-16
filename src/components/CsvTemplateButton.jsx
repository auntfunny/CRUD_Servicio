export default function CsvTemplateButton() {
  const downloadTemplate = () => {
    const csv =
      "email,first_name,last_name,document_number,role\n" +
      "ejemplo@funval.com,Juan,Perez,12345678,STUDENT\n";

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_usuarios.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadTemplate}
      className="text-blue-600 hover:underline text-sm"
    >
      📄 Descargar plantilla CSV
    </button>
  );
}