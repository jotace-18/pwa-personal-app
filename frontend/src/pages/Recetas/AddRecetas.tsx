import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/pages_styles/AddRecetas.module.css";

interface AlimentoData {
  id_alimento: number;
  nombre_alimento: string;
  calorias: number;
  nutrientes: { nombre_nutriente: string; cantidad: number }[];
}

interface IngredienteItem {
  alimento: AlimentoData;
  gramos: number;
}

const AddRecetas: React.FC = () => {
  const navigate = useNavigate();

  // CAMPOS DE RECETA
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [tiempo_preparacion, setTiempo_preparacion] = useState("");
  const user_id = 1; // Valor fijo

  // BÚSQUEDA Y SELECCIÓN DE ALIMENTO PARA INGREDIENTE
  const [searchQuery, setSearchQuery] = useState("");
  const [allAlimentos, setAllAlimentos] = useState<AlimentoData[]>([]);
  const [searchResults, setSearchResults] = useState<AlimentoData[]>([]);
  const [selectedAlimento, setSelectedAlimento] = useState<AlimentoData | null>(null);
  const [gramosInput, setGramosInput] = useState<number | "">("");
  const [ingredientes, setIngredientes] = useState<IngredienteItem[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);

  // AL MONTAR: Obtener alimentos
  useEffect(() => {
    fetch("http://localhost:4000/api/alimentos")
      .then((res) => res.json())
      .then((data: AlimentoData[]) => setAllAlimentos(data))
      .catch((err) => console.error("Error fetching alimentos:", err));
  }, []);

  // Filtrar alimentos según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const results = allAlimentos.filter((a) =>
        a.nombre_alimento.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchQuery, allAlimentos]);

  // Selección de alimento (obtiene información completa)
  const handleSelectAlimento = (alimento: AlimentoData) => {
    fetch(`http://localhost:4000/api/alimentos/${encodeURIComponent(alimento.nombre_alimento)}`)
      .then((res) => res.json())
      .then((data: AlimentoData) => {
        setSelectedAlimento(data);
        setSearchQuery(data.nombre_alimento);
        setSearchResults([]);
      })
      .catch((err) => console.error("Error fetching alimento details:", err));
  };

  // Agregar ingrediente a la lista (solo si es válido)
  const addIngrediente = () => {
    if (selectedAlimento && gramosInput !== "" && Number(gramosInput) > 0) {
      setIngredientes([
        ...ingredientes,
        { alimento: selectedAlimento, gramos: Number(gramosInput) },
      ]);
      setSelectedAlimento(null);
      setSearchQuery("");
      setGramosInput("");
    }
  };

  // Alternar despliegue de detalles por ingrediente
  const toggleIngredientDetails = (index: number) => {
    if (expanded.includes(index)) {
      setExpanded(expanded.filter((i) => i !== index));
    } else {
      setExpanded([...expanded, index]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Transforma los ingredientes al formato que espera el backend:
    const ingredientesPayload = ingredientes.map(ing => ({
      nombre_alimento: ing.alimento.nombre_alimento,
      cantidad: ing.gramos,
      unidad: "g"  // o la unidad que corresponda
    }));

    const recetaPayload = {
      nombre,
      descripcion,
      instrucciones,
      tiempo_preparacion,
      user_id,
      ingredientes: ingredientesPayload  // usa la versión transformada
    };

    fetch("http://localhost:4000/api/recetas/crear-receta", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recetaPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al añadir la receta");
        return res.json();
      })
      .then((data) => {
        console.log("Receta añadida con éxito:", data);
        navigate("/recetas");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const overallCalories = ingredientes.reduce(
    (acc, ing) => acc + ing.alimento.calorias * (ing.gramos / 100),
    0
  );

  const overallNutrients = ingredientes.reduce((acc, ing) => {
    ing.alimento.nutrientes.forEach((nutr) => {
      const total = nutr.cantidad * (ing.gramos / 100);
      if (acc[nutr.nombre_nutriente]) {
        acc[nutr.nombre_nutriente] += total;
      } else {
        acc[nutr.nombre_nutriente] = total;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.AddRecetas}>
      <h1>Crear Receta</h1>
      <div className={styles.twoColumns}>
        {/* FORMULARIO */}
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="instrucciones">Instrucciones:</label>
              <textarea
                id="instrucciones"
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                required
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="tiempo_preparacion">Tiempo de Preparación:</label>
              <input
                type="text"
                id="tiempo_preparacion"
                value={tiempo_preparacion}
                onChange={(e) => setTiempo_preparacion(e.target.value)}
                required
              />
            </div>
            {/* Campo de búsqueda de alimento */}
            <div className={styles.formGroup}>
              <label>Buscar Alimento:</label>
              <input
                type="text"
                placeholder="Escribe el nombre del alimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {/* Mostrar sugerencias solo si no se tiene un alimento seleccionado */}
              {searchResults.length > 0 && !selectedAlimento && (
                <ul className={styles.searchResults}>
                  {searchResults.map((alimento) => (
                    <li
                      key={alimento.id_alimento}
                      onClick={() => handleSelectAlimento(alimento)}
                    >
                      {alimento.nombre_alimento}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedAlimento && (
              <div className={styles.formGroup}>
                <label>Alimento seleccionado:</label>
                <div className={styles.selectedAlimento}>
                  <span>{selectedAlimento.nombre_alimento}</span>
                  <input
                    type="number"
                    placeholder="Gramos"
                    value={gramosInput}
                    onChange={(e) =>
                      setGramosInput(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className={styles.gramosInput}
                  />
                  <button
                    type="button"
                    onClick={addIngrediente}
                    className={styles.addButton}
                  >
                    Añadir ingrediente
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAlimento(null);
                      setSearchQuery("");
                      setGramosInput("");
                    }}
                    className={styles.discardButton}
                  >
                    Descartar
                  </button>
                </div>
              </div>
            )}
            {ingredientes.length > 0 && (
              <div className={styles.formGroup}>
                <label>Ingredientes añadidos:</label>
                <ul className={styles.ingredientList}>
                  {ingredientes.map((ing, index) => (
                    <li key={index}>
                      {ing.alimento.nombre_alimento} - {ing.gramos} g
                      <button
                        type="button"
                        onClick={() =>
                          setIngredientes(ingredientes.filter((_, i) => i !== index))
                        }
                        className={styles.discardButton}
                      >
                        Descartar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton}>
                Guardar Receta
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate("/recetas")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        
        {/* ESTADÍSTICAS */}
        <div className={styles.statsContainer}>
          <h2>Estadísticas de la Receta</h2>
          {/* Bloque grande con estadísticas totales */}
          <div className={styles.overallStats}>
            <h3>Totales</h3>
            <div className={styles.overallGrid}>
              <p>Calorías: {overallCalories.toFixed(2)} kcal</p>
              {Object.entries(overallNutrients).map(([nutName, amount]) => (
                <p key={nutName}>
                  {nutName}: {amount.toFixed(2)} g
                </p>
              ))}
            </div>
          </div>
          {/* Bloques individuales para cada ingrediente */}
          {ingredientes.map((ing, index) => (
            <div key={index} className={styles.ingredientStat}>
              <h4>{ing.alimento.nombre_alimento}</h4>
              <p>
                {(
                  ing.alimento.calorias *
                  (ing.gramos / 100)
                ).toFixed(2)}{" "}
                kcal
              </p>
              <button
                type="button"
                onClick={() => toggleIngredientDetails(index)}
                className={styles.toggleButton}
              >
                {expanded.includes(index) ? "Ocultar detalles" : "Mostrar detalles"}
              </button>
              {expanded.includes(index) && (
                <div className={styles.details}>
                  {ing.alimento.nutrientes.map((nut, i) => (
                    <div key={i} className={styles.nutrientStat}>
                      <span>{nut.nombre_nutriente}:</span>
                      <span>
                        {(nut.cantidad * (ing.gramos / 100)).toFixed(2)} g
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddRecetas;