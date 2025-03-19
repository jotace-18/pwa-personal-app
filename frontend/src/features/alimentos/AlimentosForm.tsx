import { useState } from "react";
import axios from "axios";

// Lista fija de nutrientes
const nutrientNames = [
  "Grasas",
  "Grasas Saturadas",
  "Azúcares",
  "Hidratos de carbono",
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

  // Guardamos los valores de cada nutriente (clave: nombre, valor: cantidad)
  const [nutrients, setNutrients] = useState<{ [key: string]: string }>(initialNutrients);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Maneja el cambio en el valor de un nutriente
  const handleNutrientChange = (nutrient: string, value: string) => {
    setNutrients({
      ...nutrients,
      [nutrient]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que se haya completado la información de todos los nutrientes
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
      marca, // Se agregó la marca aquí
      precio: Number(precio),
      calorias: Number(calorias),
      nutrientes: nutrientNames.map((nutrient) => ({
        nombre_nutriente: nutrient,
        unidad: "g", // Unidad fija en gramos
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
      setMarca(""); // Limpiar el campo de marca
      setPrecio("");
      setCalorias("");
      setNutrients(initialNutrients);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message || "Error al crear el alimento. Inténtalo nuevamente.");
      } else {
        setErrorMessage("Error al crear el alimento. Inténtalo nuevamente.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Crear Alimento</h2>
      <div>
        <label>Nombre del Alimento:</label>
        <input
          type="text"
          value={nombreAlimento}
          onChange={(e) => setNombreAlimento(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tipo:</label>
        <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required />
      </div>
      <div>
        <label>Supermercado:</label>
        <input
          type="text"
          value={supermercado}
          onChange={(e) => setSupermercado(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Marca:</label>
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          // required si quieres hacerlo obligatorio
        />
      </div>
      <div>
        <label>Precio:</label>
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Calorías:</label>
        <input
          type="number"
          value={calorias}
          onChange={(e) => setCalorias(e.target.value)}
          required
        />
      </div>

      <h3>Nutrientes (en gramos)</h3>
      {nutrientNames.map((nutrient) => (
        <div key={nutrient} style={{ marginBottom: "10px" }}>
          <label>{nutrient}:</label>
          <input
            type="number"
            step="0.01"
            value={nutrients[nutrient]}
            onChange={(e) => handleNutrientChange(nutrient, e.target.value)}
            required
          />
        </div>
      ))}

      <button type="submit">Crear Alimento</button>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
};

export default AlimentosForm;
