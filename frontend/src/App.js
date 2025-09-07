import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login.page";
import Login2Page from "./pages/login2.page";
import UploadPage from "./pages/upload.page";
import Taxes from "./pages/taxes.page";


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/login2" element={<Login2Page />} />

            <Route path="/upload" element={<UploadPage />} />
            <Route path="/taxes" element={<Taxes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;