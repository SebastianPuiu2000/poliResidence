import { useState, useEffect } from "react";
import Card from "../components/card.component";

function Menu({ categories, selected, onSelect }) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`w-36 h-12 rounded-lg text-sm font-medium transition-transform duration-200 
              ${
                selected === cat
                  ? "bg-blue-600 text-white scale-105 shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

function Taxes() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(undefined);

  const columnMap = {
    B: "Număr persoane",
    C: "Cheltuieli pe număr de persoane",
    D: "Cheltuieli pe contoare",
    E: "Cheltuieli pe încălzire",
    F: "Cheltuieli pe cota indiviză 1.02%",
    G: "Ajutor",
    H: "Total lună curentă",
    I: "Taxe boxă",
    J: "Fond reparații",
    K: "Revizie gaz",
    L: "Fond rulment",
    M: "Apometre",
    N: "Taxe boxă",
    O: "Fond reparații",
    P: "Fond rulment",
    Q: "Cote întreținere",
    R: "Penalități",
    S: "Debit / Credit",
    T: "TOTAL GENERAL DE PLATA",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendData = {
          B: { value: "2", category: undefined },
          C: { value: "3", category: "Cheltuieli" },
          D: { value: "4", category: "Cheltuieli" },
          E: { value: "5", category: "Cheltuieli" },
          F: { value: "6", category: "Cheltuieli" },
          G: { value: "7", category: "Ajustări financiare" },
          H: { value: "8", category: undefined },
          I: { value: "9", category: "Contribuții auxiliare" },
          J: { value: "10", category: "Contribuții auxiliare" },
          K: { value: "11", category: "Contribuții auxiliare" },
          L: { value: "12", category: "Contribuții auxiliare" },
          M: { value: "13", category: undefined },
          N: { value: "14", category: "Restanțe" },
          O: { value: "15", category: "Restanțe" },
          P: { value: "16", category: "Restanțe" },
          Q: { value: "17", category: "Restanțe" },
          R: { value: "18", category: "Ajustări financiare" },
          S: { value: "19", category: "Ajustări financiare" },
          T: { value: "20", category: "Total" },
        };
        setData(backendData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Se încarcă datele...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Extragem totalul separat
  const totalKey = Object.keys(data).find((k) => data[k].category === "Total");
  const totalValue = totalKey ? data[totalKey].value : null;

  // Categorii unice (fără undefined și fără "Total")
  const categories = [
    "Cheltuieli",
    "Contribuții auxiliare",
    "Restanțe",
    "Ajustări financiare",
  ];

  // Carduri filtrate: dacă nu e selectată nicio categorie => afișăm tot
  const filteredKeys = Object.keys(data).filter((k) =>
    selectedCategory
      ? data[k].category === selectedCategory
      : data[k].category !== undefined && data[k].category !== "Total"
  );

  return (
    <div className="flex flex-col p-6 gap-14">
      {/* Buton pentru total general */}
      {totalValue && (
        <div className="flex justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-transform duration-200 text-center
        ${
          selectedCategory === null
            ? "bg-blue-600 text-white scale-105 shadow-lg"
            : "bg-blue-300 text-blue-900 hover:bg-blue-400"
        }`}
          >
            <div className="flex flex-col items-center">
              <span>TOTAL GENERAL DE PLATĂ</span>
              <span className="text-4xl font-extrabold mt-1">
                {totalValue} LEI
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Meniu categorii */}
      <Menu
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Carduri filtrate */}
      <div className="flex flex-wrap justify-center gap-12">
        {filteredKeys.map((key) => (
          <Card
            key={key}
            label={columnMap[key] || key}
            value={data[key].value}
          />
        ))}
      </div>
    </div>
  );
}

export default Taxes;
