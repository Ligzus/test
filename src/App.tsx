import { useState, useEffect } from "react";
import "./App.css";

type Filter = {
  uiType: string;
  name: string;
  id: number;
  value: string | null;
  availableValues?: { id: number; value: string }[];
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
        { id: 727, value: "ITIN" },
      ],
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
        { id: 857, value: "DSCR >= 1.25" },
      ],
    },
    {
      uiType: "Range",
      name: "Loan Amount",
      id: 3,
      value: "500000", // Значение по умолчанию
    },
  ];

  const [filters, setFilters] = useState<Filter[]>(defaultFilters);
  const [buttonState, setButtonState] = useState([false, false, false]);
  const [savedScenarios, setSavedScenarios] = useState<(Filter[] | null)[]>([null, null, null]);

  useEffect(() => {
    [1, 2, 3].forEach((scenarioId) => {
      const savedScenario = localStorage.getItem(`scenario_${scenarioId}`);
      if (savedScenario) {
        setButtonState((prev) => {
          const newState = [...prev];
          newState[scenarioId - 1] = true;
          return newState;
        });
        setSavedScenarios((prev) => {
          const newState = [...prev];
          newState[scenarioId - 1] = JSON.parse(savedScenario);
          return newState;
        });
      }
    });
  }, []);

  const handleFilterChange = (id: number, selectedValue: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === id ? { ...filter, value: selectedValue } : filter
      )
    );
  };

  const saveScenario = (scenarioId: number) => {
    localStorage.setItem(`scenario_${scenarioId}`, JSON.stringify(filters));
    setButtonState((prev) => {
      const newState = [...prev];
      newState[scenarioId - 1] = true;
      return newState;
    });
    setSavedScenarios((prev) => {
      const newState = [...prev];
      newState[scenarioId - 1] = filters;
      return newState;
    });
  };

  const loadScenario = (scenarioId: number) => {
    const savedScenario = localStorage.getItem(`scenario_${scenarioId}`);
    if (savedScenario) {
      setFilters(JSON.parse(savedScenario));
    }
  };

  const clearScenarios = () => {
    localStorage.removeItem("scenario_1");
    localStorage.removeItem("scenario_2");
    localStorage.removeItem("scenario_3");
    setButtonState([false, false, false]);
    setSavedScenarios([null, null, null]);
    setFilters(defaultFilters);
  };

  return (
    <div className="app-container">
      <h2>Mortgage Calculator</h2>
      <div className="filters">
        {filters.map((filter) => (
          <div key={filter.id} className="filter-item">
            <label>{filter.name}:</label>
            {filter.uiType === "SelectList" && (
              <select
                value={filter.value || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {filter.availableValues?.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            )}
            {filter.uiType === "Range" && (
              <input
                type="range"
                min="50000"
                max="2000000"
                step="5000"
                value={filter.value || "500000"}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              />
            )}
            {filter.uiType === "Range" && <span>{filter.value}</span>}
          </div>
        ))}
      </div>

      <div className="button-group">
        {[1, 2, 3].map((scenarioId) => (
          <div key={scenarioId} className="scenario-container">
            <button
              onClick={() =>
                buttonState[scenarioId - 1]
                  ? loadScenario(scenarioId)
                  : saveScenario(scenarioId)
              }
              className={buttonState[scenarioId - 1] ? "scenario-button_active" : "scenario-button"}
            >
              {buttonState[scenarioId - 1] ? `Show scenario ${scenarioId}` : `Save scenario ${scenarioId}`}
            </button>
            {savedScenarios[scenarioId - 1] && (
              <ul className="saved-values">
                {savedScenarios[scenarioId - 1]?.map((filter) =>
                  filter.value ? <li key={filter.id}>{filter.name}: {filter.value}</li> : null
                )}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="clear-button-container">
        <button onClick={clearScenarios} className="clear-scenarios-button">
          Clear scenarios
        </button>
      </div>
    </div>
  );
}

export default App;
