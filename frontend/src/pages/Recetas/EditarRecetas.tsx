import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/pages_styles/AddRecetas.module.css";

interface AlimentoData {
  id_alimento: number;
  nombre_alimento: string;
  calorias: number;
  nutrientes: { nombre_nutriente: string; cantidad: number }[];
}

interface IngredienteItem {
  id_alimento: number;
  nombre_alimento: string;
  calorias: number;
  nutrientes: { nombre_nutriente: string; cantidad: number }[];
  cantidad: number;
  unidad: string;
}

interface IngredienteFetched {
  id_alimento: number;
  nombre_alimento: string;
  calorias: number;
  nutrientes: { nombre_nutriente: string; cantidad: number }[];
  cantidad: number;
  unidad: string;
}

interface RecetaFetched {
  nombre: string;
  descripcion: string;
  instrucciones: string;
  tiempo_preparacion: string;
  ingredientes?: IngredienteFetched[];
}

const EditarRecetas: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // CAMPOS DE RECETA
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [tiempoPreparacion, setTiempoPreparacion] = useState("");
  const user_id = 1; // Valor fijo

  // Manejo de ingredientes y búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [allAlimentos, setAllAlimentos] = useState<AlimentoData[]>([]);
  const [searchResults, setSearchResults] = useState<AlimentoData[]>([]);
  const [selectedAlimento, setSelectedAlimento] = useState<AlimentoData | null>(null);
  const [gramosInput, setGramosInput] = useState<number | "">("");
  const [ingredientes, setIngredientes] = useState<IngredienteItem[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);

  // Obtener todos los alimentos
  useEffect(() => {
    fetch("http://localhost:4000/api/alimentos")
      .then((res) => res.json())
      .then((data: AlimentoData[]) => setAllAlimentos(data))
      .catch((err) => console.error("Error fetching alimentos:", err));
  }, []);

  // Obtener la receta a editar
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:4000/api/recetas/${id}`)
        .then((res) => res.json())
        .then((data: RecetaFetched) => {
          setNombre(data.nombre);
          setDescripcion(data.descripcion);
          setInstrucciones(data.instrucciones);
          setTiempoPreparacion(data.tiempo_preparacion);
          if (data.ingredientes) {
            const ingredientesTransformados: IngredienteItem[] = data.ingredientes.map(
              (ing: IngredienteFetched) => ({
                id_alimento: ing.id_alimento,
                nombre_alimento: ing.nombre_alimento,
                calorias: ing.calorias,
                nutrientes: ing.nutrientes, // Puede venir vacío
                cantidad: ing.cantidad,
                unidad: ing.unidad,
              })
            );
            // Actualiza cada ingrediente que no tenga nutrientes consultando el endpoint de alimentos
            Promise.all(
              ingredientesTransformados.map(async (ing) => {
                if (!ing.nutrientes || ing.nutrientes.length === 0) {
                  // Se busca obtener información completa del alimento
                  try {
                    const res = await fetch(
                      `http://localhost:4000/api/alimentos/${encodeURIComponent(ing.nombre_alimento)}`
                    );
                    const dataAlimento: AlimentoData = await res.json();
                    return { ...ing, nutrientes: dataAlimento.nutrientes || [] };
                  } catch (error) {
                    console.error("Error fetching alimento details for", ing.nombre_alimento, error);
                    return ing;
                  }
                }
                return ing;
              })
            ).then((updatedIngredientes) => setIngredientes(updatedIngredientes));
          }
        })
        .catch((err) => console.error("Error fetching receta:", err));
    }
  }, [id]);

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

  // Selección de alimento
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

  // Agregar ingrediente a la lista
  const addIngrediente = () => {
    if (selectedAlimento && gramosInput !== "" && Number(gramosInput) > 0) {
      setIngredientes([
        ...ingredientes,
        {
          id_alimento: selectedAlimento.id_alimento,
          nombre_alimento: selectedAlimento.nombre_alimento,
          calorias: selectedAlimento.calorias,
          nutrientes: selectedAlimento.nutrientes,
          cantidad: Number(gramosInput),
          unidad: "g",
        },
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

  // Actualizar receta
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ingredientesPayload = ingredientes.map((ing) => ({
      nombre_alimento: ing.nombre_alimento,
      cantidad: ing.cantidad,
      unidad: ing.unidad,
    }));

    const recetaPayload = {
      nombre,
      descripcion,
      instrucciones,
      tiempo_preparacion: tiempoPreparacion, // Nota: asegúrate de que los nombres concuerden
      user_id,
      ingredientes: ingredientesPayload,
    };

    fetch(`http://localhost:4000/api/recetas/${id}`, { 
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recetaPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar la receta");
        return res.json();
      })
      .then((data) => {
        console.log("Receta actualizada con éxito:", data);
        navigate("/recetas");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const overallCalories = ingredientes.reduce(
    (acc, ing) => acc + ing.calorias * (ing.cantidad / 100),
    0
  );

  const overallNutrients = ingredientes.reduce((acc, ing) => {
    (ing.nutrientes ?? []).forEach((nutr) => {
      const total = nutr.cantidad * (ing.cantidad / 100);
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
      <h1>Editar Receta</h1>
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
              <label htmlFor="tiempoPreparacion">Tiempo de Preparación:</label>
              <input
                type="text"
                id="tiempoPreparacion"
                value={tiempoPreparacion}
                onChange={(e) => setTiempoPreparacion(e.target.value)}
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
                    value={gramosInput === null ? "" : gramosInput}
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
                      {ing.nombre_alimento} - {ing.cantidad} g
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
          {ingredientes.map((ing, index) => (
            <div key={index} className={styles.ingredientStat}>
              <h4>{ing.nombre_alimento}</h4>
              <p>
                {(ing.calorias * (ing.cantidad / 100)).toFixed(2)} kcal
              </p>
              <button
                type="button"
                onClick={() => toggleIngredientDetails(index)}
                className={styles.toggleButton}
              >
                {expanded.includes(index)
                  ? "Ocultar detalles"
                  : "Mostrar detalles"}
              </button>
              {expanded.includes(index) && (
                <div className={styles.details}>
                  {(ing.nutrientes ?? []).map((nut, i) => (
                    <div key={i} className={styles.nutrientStat}>
                      <span>{nut.nombre_nutriente}:</span>
                      <span>{(nut.cantidad * (ing.cantidad / 100)).toFixed(2)} g</span>
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

export default EditarRecetas;