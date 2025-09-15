import Header from "./header.component";

export default function Layout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header-ul cu butonul de deconectare */}

      <Header onLogout={handleLogout} />
      {/* Continutul paginii */}

      <main className="flex-1">{children}</main>
    </div>
  );
}
