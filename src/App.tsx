import { useState, useEffect } from "react";
import './App.css'

type Filter = {
  uiType: string;
  name: string;
  id: number;
  value: string | null;  // value может быть либо строкой, либо null
  availableValues: { id: number; value: string }[];
};

function App() {
  const defaultFilters: Filter[] = [
    {
      uiType: "SelectList", 
      name: "Citizenship",
      id: 1,
      value: null,
      availableValues: [
        { id: 1, value: "US Citizen / Permanent Resident" },
        { id: 2, value: "Non-Permanent Resident" },
        { id: 3, value: "Foreign national" },
        { id: 727, value: "ITIN" }
      ]
    },
    {
      uiType: "SelectList", 
      name: "Income Type", 
      id: 2,
      value: null,
      availableValues: [
        { id: 4, value: "Asset Utilization" },
        { id: 5, value: "12 Months Bank Statement" },
        { id: 6, value: "24 Months Bank Statement" },
        { id: 7, value: "1Y P&L" },
        { id: 8, value: "2Y P&L" },
        { id: 9, value: "1Y Full Doc" },
        { id: 10, value: "2Y Full Doc" },
        { id: 11, value: "WVOE" },
        { id: 12, value: "DSCR 1.00 - 1.24" },
        { id: 167, value: "1099" },
        { id: 502, value: "DSCR 0.75-0.99" },
        { id: 503, value: "DSCR < 0.75" },
        { id: 857, value: "DSCR >= 1.25" }
      ]
    },
    // Добавьте другие фильтры по аналогии
  ];

  const [filters, setFilters] = useState<Filter[]>(defaultFilters);
  const [buttonState, setButtonState] = useState([false, false, false]); // Состояние кнопок

  useEffect(() => {
    // Проверка наличия сохраненных сценариев при загрузке страницы
    [1, 2, 3].forEach((scenarioId) => {
      if (localStorage.getItem(`scenario_${scenarioId}`)) {
        setButtonState((prev) => {
          const newState = [...prev];
          newState[scenarioId - 1] = true; // Меняем состояние кнопки на "Показать"
          return newState;
        });
      }
    });
  }, []);

  // Функция обновления значения фильтра
  const handleFilterChange = (id: number, selectedValue: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === id ? { ...filter, value: selectedValue } : filter
      )
    );
  };

  // Функция сохранения сценария в LocalStorage
  const saveScenario = (scenarioId: number) => {
    localStorage.setItem(`scenario_${scenarioId}`, JSON.stringify(filters));
    setButtonState((prev) => {
      const newState = [...prev];
      newState[scenarioId - 1] = true; // Меняем состояние кнопки на "Показать"
      return newState;
    });
  };

  // Функция загрузки сценария из LocalStorage
  const loadScenario = (scenarioId: number) => {
    const savedScenario = localStorage.getItem(`scenario_${scenarioId}`);
    if (savedScenario) {
      setFilters(JSON.parse(savedScenario));
    }
  };

  // Функция очистки всех сценариев
  const clearScenarios = () => {
    localStorage.removeItem("scenario_1");
    localStorage.removeItem("scenario_2");
    localStorage.removeItem("scenario_3");
    setButtonState([false, false, false]);
    setFilters(defaultFilters);
  };

  return (
    <div className="app-container">
      <h2>Mortgage Calculator</h2>
      <div className="filters">
        {/* Отрисовка фильтров */}
        {filters.map((filter) => (
          <div key={filter.id} className="filter-item">
            <label>{filter.name}:</label>
            <select
              value={filter.value || ""}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            >
              <option value="">Select an option</option>
              {filter.availableValues.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Кнопки сохранения/показа сценариев */}
      <div className="button-group">
        {[1, 2, 3].map((scenarioId) => (
          <button
            key={scenarioId}
            onClick={() =>
              buttonState[scenarioId - 1]
                ? loadScenario(scenarioId)
                : saveScenario(scenarioId)
            }
            className={ buttonState[scenarioId - 1] ? "scenario-button_active" : "scenario-button"}
          >
            {buttonState[scenarioId - 1]
              ? `Show scenario ${scenarioId}`
              : `Save scenario ${scenarioId}`}
          </button>
        ))}
      </div>

      {/* Кнопка для очистки сценариев */}
      <div className="clear-button-container">
        <button onClick={clearScenarios} className="clear-scenarios-button">
          Clear scenarios
        </button>
      </div>
    </div>
  );
}

export default App;