import { useState, useRef } from "react";

import Layout from "../components/layout.component";
function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dropRef = useRef();

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setSuccess(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
    dropRef.current.classList.remove("border-blue-600");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.add("border-blue-600");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.remove("border-blue-600");
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Selectează sau trage un fișier înainte de a trimite.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("myfile", file); // cheia este myfile conform backend

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      setSuccess("Fișierul a fost trimis cu succes!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("A apărut o eroare la trimiterea fișierului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-blue-100 p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4 border border-blue-200">
          <h1 className="text-xl font-bold text-gray-800 text-center">
            Încarcă fișier Excel
          </h1>

          {/* Drag & Drop */}
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-400 rounded-md bg-gray-50 text-gray-500 text-center cursor-pointer hover:border-blue-600 transition-colors"
          >
            {file ? (
              <p className="truncate">{file.name}</p>
            ) : (
              <p>Trage fișierul aici sau click pentru a selecta</p>
            )}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="absolute w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </div>

          {/* Mesaje */}
          {file && (
            <p className="text-gray-700 text-sm mt-1 truncate">
              Fișier selectat: {file.name}
            </p>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Se trimite..." : "Trimite fișierul"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default UploadPage;
