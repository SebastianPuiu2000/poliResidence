import { useState, useEffect } from "react";
import Card from "../components/card.component";

async function mockApi(which, current) {
  const db = [
    {
      year: 2025,
      month: 8,
      data: {
        B: "3",
        C: "120",
        D: "85",
        E: "200",
        F: "50",
        G: "10",
        H: "468",
        I: "20",
        J: "30",
        K: "0",
        L: "15",
        M: "12",
        N: "5",
        O: "8",
        P: "10",
        Q: "40",
        R: "3",
        S: "-5",
        T: "606",
      },
    },
    {
      year: 2025,
      month: 9,
      data: {
        B: "2",
        C: "150",
        D: "95",
        E: "220",
        F: "60",
        G: "12",
        H: "527",
        I: "25",
        J: "35",
        K: "0",
        L: "20",
        M: "14",
        N: "7",
        O: "12",
        P: "10",
        Q: "55",
        R: "4",
        S: "-10",
        T: "729",
      },
    },
    {
      year: 2025,
      month: 10,
      data: {
        B: "4",
        C: "180",
        D: "100",
        E: "250",
        F: "70",
        G: "15",
        H: "619",
        I: "30",
        J: "40",
        K: "0",
        L: "25",
        M: "16",
        N: "10",
        O: "15",
        P: "12",
        Q: "65",
        R: "6",
        S: "-15",
        T: "877",
      },
    },
  ];
  // finding the current month index in db
  const currentIdx = db.findIndex(
    (m) => m.year === current.year && m.month === current.month
  );

  let targetIdx = currentIdx;
  if (which === "prev") targetIdx = currentIdx - 1;
  if (which === "next") targetIdx = currentIdx + 1;

  const result = db[targetIdx];
  return {
    ...result,
    hasPrev: targetIdx > 0,
    hasNext: targetIdx < db.length - 1,
  };
}

const monthNames = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

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
  const [monthData, setMonthData] = useState(null);
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
        const initial = await mockApi("current", { year: 2025, month: 9 });
        setMonthData(initial);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNav = async (dir) => {
    if (!monthData) return;
    try {
      setLoading(true);
      const newData = await mockApi(dir, {
        year: monthData.year,
        month: monthData.month,
      });
      setMonthData(newData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Se încarcă datele...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!monthData) return null;

  const totalValue = monthData.data.T;

  const categories = [
    "Cheltuieli",
    "Contribuții auxiliare",
    "Restanțe",
    "Ajustări financiare",
  ];
  const categoryMap = {
    C: "Cheltuieli",
    D: "Cheltuieli",
    E: "Cheltuieli",
    F: "Cheltuieli",
    I: "Contribuții auxiliare",
    J: "Contribuții auxiliare",
    K: "Contribuții auxiliare",
    L: "Contribuții auxiliare",
    N: "Restanțe",
    O: "Restanțe",
    P: "Restanțe",
    Q: "Restanțe",
    G: "Ajustări financiare",
    R: "Ajustări financiare",
    S: "Ajustări financiare",
  };

  const filteredKeys = Object.keys(monthData.data).filter((k) =>
    selectedCategory
      ? categoryMap[k] === selectedCategory
      : categoryMap[k] !== undefined
  );

  return (
    <div className="flex flex-col p-6 gap-14">
      <div className="flex justify-center items-center gap-4 text-xl font-bold">
        <button
          disabled={!monthData.hasPrev}
          onClick={() => handleNav("prev")}
          className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition"
        >
          ←
        </button>

        <h2>
          {monthNames[monthData.month - 1]} {monthData.year}
        </h2>

        <button
          disabled={!monthData.hasNext}
          onClick={() => handleNav("next")}
          className="px-3 py-1 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition"
        >
          →
        </button>
      </div>
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
            value={monthData.data[key]}
          />
        ))}
      </div>
    </div>
  );
}

export default Taxes;
