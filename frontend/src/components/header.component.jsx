import { Menu, LogOut } from "lucide-react";

function Header({ onLogout }) {
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-gray-100 shadow-md">
      <button
        className="p-1 rounded-md hover:bg-gray-200 transition-colors"
        onClick={() => {}}
        title="Menu"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      <button
        className="flex items-center gap-1 p-1 rounded-md hover:bg-red-100 transition-colors"
        onClick={onLogout}
        title="Deconectare"
      >
        <LogOut className="w-5 h-5 text-red-600" />
        <span className="text-sm font-medium text-red-600">Deconectare</span>
      </button>
    </header>
  );
}

export default Header;
