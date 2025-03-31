import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/pages_styles/EditDieta.module.css";

const Lunes: React.FC = () => {
  const navigate = useNavigate();

  // Estados para cada comida
  const [desayuno1Foods, setDesayuno1Foods] = useState<string[]>([]);
  const [inputDesayuno1, setInputDesayuno1] = useState("");

  const [desayuno2Foods, setDesayuno2Foods] = useState<string[]>([]);
  const [inputDesayuno2, setInputDesayuno2] = useState("");

  const [almuerzoFoods, setAlmuerzoFoods] = useState<string[]>([]);
  const [inputAlmuerzo, setInputAlmuerzo] = useState("");

  const [meriendaFoods, setMeriendaFoods] = useState<string[]>([]);
  const [inputMerienda, setInputMerienda] = useState("");

  const [cenaFoods, setCenaFoods] = useState<string[]>([]);
  const [inputCena, setInputCena] = useState("");

  // Funciones para Desayuno 1
  const addDesayuno1Food = () => {
    if (inputDesayuno1.trim()) {
      setDesayuno1Foods([...desayuno1Foods, inputDesayuno1.trim()]);
      setInputDesayuno1("");
    }
  };
  const removeDesayuno1Food = (index: number) => {
    setDesayuno1Foods(desayuno1Foods.filter((_, i) => i !== index));
  };

  // Funciones para Desayuno 2
  const addDesayuno2Food = () => {
    if (inputDesayuno2.trim()) {
      setDesayuno2Foods([...desayuno2Foods, inputDesayuno2.trim()]);
      setInputDesayuno2("");
    }
  };
  const removeDesayuno2Food = (index: number) => {
    setDesayuno2Foods(desayuno2Foods.filter((_, i) => i !== index));
  };

  // Funciones para Almuerzo
  const addAlmuerzoFood = () => {
    if (inputAlmuerzo.trim()) {
      setAlmuerzoFoods([...almuerzoFoods, inputAlmuerzo.trim()]);
      setInputAlmuerzo("");
    }
  };
  const removeAlmuerzoFood = (index: number) => {
    setAlmuerzoFoods(almuerzoFoods.filter((_, i) => i !== index));
  };

  // Funciones para Merienda
  const addMeriendaFood = () => {
    if (inputMerienda.trim()) {
      setMeriendaFoods([...meriendaFoods, inputMerienda.trim()]);
      setInputMerienda("");
    }
  };
  const removeMeriendaFood = (index: number) => {
    setMeriendaFoods(meriendaFoods.filter((_, i) => i !== index));
  };

  // Funciones para Cena
  const addCenaFood = () => {
    if (inputCena.trim()) {
      setCenaFoods([...cenaFoods, inputCena.trim()]);
      setInputCena("");
    }
  };
  const removeCenaFood = (index: number) => {
    setCenaFoods(cenaFoods.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.editDietaContainer}>
      <h1>Editar Dieta - Lunes</h1>
      <div className={styles.twoColumns}>
        {/* Columna izquierda: Formulario */}
        <div className={styles.formContainer}>
          <section className={styles.formSection}>
            <h2>Datos Alimenticios</h2>

            {/* Desayuno 1 */}
            <div className={styles.formGroup}>
              <label htmlFor="desayuno1">Desayuno 1:</label>
              <div className={styles.mealInputContainer} style={{ flexDirection: "column", alignItems: "stretch" }}>
                <input
                  type="text"
                  id="desayuno1"
                  value={inputDesayuno1}
                  onChange={(e) => setInputDesayuno1(e.target.value)}
                  placeholder="Ej.: Tostada"
                />
              </div>
              <button type="button" onClick={addDesayuno1Food}>
                Añadir alimento
              </button>
              <ul className={styles.mealList}>
                {desayuno1Foods.map((food, index) => (
                  <li key={index}>
                    {food}{" "}
                    <button type="button" onClick={() => removeDesayuno1Food(index)}>
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desayuno 2 */}
            <div className={styles.formGroup}>
              <label htmlFor="desayuno2">Desayuno 2:</label>
              <div className={styles.mealInputContainer} style={{ flexDirection: "column", alignItems: "stretch" }}>
                <input
                  type="text"
                  id="desayuno2"
                  value={inputDesayuno2}
                  onChange={(e) => setInputDesayuno2(e.target.value)}
                  placeholder="Ej.: Café"
                />
              </div>
              <button type="button" onClick={addDesayuno2Food}>
                Añadir alimento
              </button>
              <ul className={styles.mealList}>
                {desayuno2Foods.map((food, index) => (
                  <li key={index}>
                    {food}{" "}
                    <button type="button" onClick={() => removeDesayuno2Food(index)}>
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Almuerzo */}
            <div className={styles.formGroup}>
              <label htmlFor="almuerzo">Almuerzo:</label>
              <div className={styles.mealInputContainer} style={{ flexDirection: "column", alignItems: "stretch" }}>
                <input
                  type="text"
                  id="almuerzo"
                  value={inputAlmuerzo}
                  onChange={(e) => setInputAlmuerzo(e.target.value)}
                  placeholder="Ej.: Pollo"
                />
              </div>
              <button type="button" onClick={addAlmuerzoFood}>
                Añadir alimento
              </button>
              <ul className={styles.mealList}>
                {almuerzoFoods.map((food, index) => (
                  <li key={index}>
                    {food}{" "}
                    <button type="button" onClick={() => removeAlmuerzoFood(index)}>
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Merienda */}
            <div className={styles.formGroup}>
              <label htmlFor="merienda">Merienda:</label>
              <div className={styles.mealInputContainer} style={{ flexDirection: "column", alignItems: "stretch" }}>
                <input
                  type="text"
                  id="merienda"
                  value={inputMerienda}
                  onChange={(e) => setInputMerienda(e.target.value)}
                  placeholder="Ej.: Fruta"
                />
              </div>
              <button type="button" onClick={addMeriendaFood}>
                Añadir alimento
              </button>
              <ul className={styles.mealList}>
                {meriendaFoods.map((food, index) => (
                  <li key={index}>
                    {food}{" "}
                    <button type="button" onClick={() => removeMeriendaFood(index)}>
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cena */}
            <div className={styles.formGroup}>
              <label htmlFor="cena">Cena:</label>
              <div className={styles.mealInputContainer} style={{ flexDirection: "column", alignItems: "stretch" }}>
                <input
                  type="text"
                  id="cena"
                  value={inputCena}
                  onChange={(e) => setInputCena(e.target.value)}
                  placeholder="Ej.: Ensalada"
                />
              </div>
              <button type="button" onClick={addCenaFood}>
                Añadir alimento
              </button>
              <ul className={styles.mealList}>
                {cenaFoods.map((food, index) => (
                  <li key={index}>
                    {food}{" "}
                    <button type="button" onClick={() => removeCenaFood(index)}>
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Columna derecha: Estadísticas y botones */}
        <div className={styles.sideContainer}>
          <section className={styles.statsSection}>
            <h2>Estadísticas del Día</h2>
            <div className={styles.statsItem}>
              <span className={styles.statLabel}>Calorías Totales:</span>
              <span className={styles.statValue}>2000 kcal</span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statLabel}>Proteínas:</span>
              <span className={styles.statValue}>150 g</span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statLabel}>Carbohidratos:</span>
              <span className={styles.statValue}>250 g</span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statLabel}>Grasas:</span>
              <span className={styles.statValue}>70 g</span>
            </div>
          </section>

          <section className={styles.navigationButtons}>
            <button
              className={styles.btnPrev}
              onClick={() => navigate("/edit-dieta/resumen")}
            >
              Descartar
            </button>
            <button
              className={styles.btnNext}
              onClick={() => navigate("/edit-dieta/resumen")}
            >
              Guardar
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Lunes;