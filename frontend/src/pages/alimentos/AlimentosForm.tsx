import { useState } from "react";
import axios from "axios";
import styles from "../../styles/pages_styles/AlimentosForm.module.css";

// Lista fija de nutrientes (reordenados: "Hidratos de carbono" justo antes de "Azúcares")
const nutrientNames = [
  "Grasas",
  "Grasas Saturadas",
  "Hidratos de carbono",
  "Azúcares",
  "Fibra",
  "Proteínas",
  "Sal",
];

// Estado inicial para los nutrientes: cada uno con valor vacío
const initialNutrients = nutrientNames.reduce((acc, nutrient) => {
  acc[nutrient] = "";
  return acc;
}, {} as { [key: string]: string });

const AlimentosForm = () => {
  const [nombreAlimento, setNombreAlimento] = useState("");
  const [tipo, setTipo] = useState("");
  const [supermercado, setSupermercado] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState<number | string>("");
  const [calorias, setCalorias] = useState<number | string>("");

  const [nutrients, setNutrients] = useState<{ [key: string]: string }>(initialNutrients);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Maneja el cambio de valor en cada nutriente
  const handleNutrientChange = (nutrient: string, value: string) => {
    setNutrients({ ...nutrients, [nutrient]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación: asegurar que se completen todos los nutrientes
    for (const nutrient of nutrientNames) {
      if (!nutrients[nutrient].trim()) {
        setErrorMessage(`Debe completarse la información para ${nutrient}.`);
        return;
      }
    }

    const alimentoData = {
      nombre_alimento: nombreAlimento,
      tipo,
      supermercado,
      marca,
      precio: Number(precio),
      calorias: Number(calorias),
      nutrientes: nutrientNames.map((nutrient) => ({
        nombre_nutriente: nutrient,
        unidad: "g",
        cantidad: Number(nutrients[nutrient]),
      })),
    };

    try {
      const response = await axios.post("http://localhost:4000/api/alimentos", alimentoData);
      setSuccessMessage(response.data.message || "Alimento creado exitosamente.");
      setErrorMessage("");
      // Limpiar campos
      setNombreAlimento("");
      setTipo("");
      setSupermercado("");
      setMarca("");
      setPrecio("");
      setCalorias("");
      setNutrients(initialNutrients);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data.message || "Error al crear el alimento. Inténtalo nuevamente."
        );
      } else {
        setErrorMessage("Error al crear el alimento. Inténtalo nuevamente.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Crear Alimento</h2>
      <div className={styles.formGroup}>
        <label className={styles.label}>Nombre del Alimento:</label>
        <input
          type="text"
          value={nombreAlimento}
          onChange={(e) => setNombreAlimento(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Tipo:</label>
        <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Supermercado:</label>
        <input
          type="text"
          value={supermercado}
          onChange={(e) => setSupermercado(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Marca:</label>
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Precio:</label>
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Calorías:</label>
        <input
          type="number"
          value={calorias}
          onChange={(e) => setCalorias(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <h3 className={styles.subtitle}>Nutrientes (en gramos)</h3>
      {nutrientNames.map((nutrient) => (
        <div key={nutrient} className={styles.nutrientGroup}>
          <label className={styles.label}>
            {nutrient === "Grasas Saturadas"
              ? "De las cuales saturadas"
              : nutrient === "Azúcares"
              ? "De las cuales azúcares"
              : nutrient}
            :
          </label>
          <input
            type="number"
            step="0.01"
            value={nutrients[nutrient]}
            onChange={(e) => handleNutrientChange(nutrient, e.target.value)}
            required
            className={styles.input}
          />
        </div>
      ))}

      <button type="submit" className={styles.button}>Crear Alimento</button>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
};

export default AlimentosForm;
