import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Nutriente {
  nombre_nutriente: string;
  cantidad: number;
}

interface Alimento {
  id_alimento: number;
  nombre_alimento: string;
  tipo: string;
  supermercado: string;
  marca: string;
  precio: number;
  calorias: number;
  // Ojo: en la lista inicial, quizá no tengas "nutrientes" (o está vacío).
  nutrientes?: Nutriente[];
}

const AlimentosList = () => {
  const [showAlimentos, setShowAlimentos] = useState(false);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [editingAlimento, setEditingAlimento] = useState<Alimento | null>(null);
  const navigate = useNavigate();

  // 1. Mostrar la lista de alimentos (versión resumida, sin nutrientes)
  const handleMostrar = async () => {
    try {
      const response = await axios.get<Alimento[]>("http://localhost:4000/api/alimentos");
      setAlimentos(response.data);
      setShowAlimentos(true);
    } catch (error) {
      console.error("Error al obtener alimentos:", error);
    }
  };

  const handleOcultar = () => {
    setShowAlimentos(false);
  };

  // 2. Al hacer clic en "Editar":
  //    - Pedimos los datos detallados (incluyendo nutrientes) de ese alimento
  //    - Guardamos la respuesta en editingAlimento
  const handleEditar = async (alimento: Alimento) => {
    try {
      const response = await axios.get<Alimento>(
        `http://localhost:4000/api/alimentos/${alimento.nombre_alimento}`
      );
      // Ahora response.data contendrá nombre, tipo, supermercado, marca, precio, calorias y un array "Nutrientes"
      // Ajustamos la estructura para tener la propiedad "nutrientes" en minúsculas (o como prefieras)
      const detalle = response.data;
      setEditingAlimento({
        ...detalle,
        nutrientes: detalle["nutrientes"] || [],
      });
    } catch (error) {
      console.error("Error al obtener detalle del alimento:", error);
    }
  };

  const handleCancelarEdicion = () => {
    setEditingAlimento(null);
  };

  // 3. Guardar los cambios (por ahora solo en consola)
  //    Aquí harías la llamada PUT/PATCH a tu backend para actualizar
  const handleGuardar = () => {
    console.log("Guardar cambios:", editingAlimento);
    setEditingAlimento(null);
  };

  // Manejo de cambios en los campos básicos del alimento
  const handleChange = (field: keyof Alimento, value: string | number) => {
    if (editingAlimento) {
      setEditingAlimento({ ...editingAlimento, [field]: value });
    }
  };

  // Manejo de cambios en la cantidad de un nutriente
  const handleNutrienteChange = (index: number, value: number) => {
    if (editingAlimento && editingAlimento.nutrientes) {
      const updatedNutrientes = [...editingAlimento.nutrientes];
      updatedNutrientes[index].cantidad = value;
      setEditingAlimento({ ...editingAlimento, nutrientes: updatedNutrientes });
    }
  };

  const handleAñadir = () => {
    navigate("/alimentos");
  };

  return (
    <div style={{ margin: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        {!showAlimentos ? (
          <button onClick={handleMostrar}>Mostrar Alimentos</button>
        ) : (
          <button onClick={handleOcultar}>Ocultar Alimentos</button>
        )}
        <button onClick={handleAñadir} style={{ marginLeft: "1rem" }}>
          Añadir Alimento
        </button>
      </div>

      {showAlimentos && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {alimentos.map((alimento) => (
            <li
              key={alimento.id_alimento}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{alimento.nombre_alimento}</span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#007bff",
                    }}
                    onClick={() => handleEditar(alimento)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#dc3545",
                    }}
                    onClick={() => console.log(`Eliminar alimento: ${alimento.id_alimento}`)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Mostrar formulario de edición solo si es el alimento en edición */}
              {editingAlimento?.id_alimento === alimento.id_alimento && (
                <form style={{ marginTop: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Nombre del Alimento:</label>
                    <input
                      type="text"
                      value={editingAlimento.nombre_alimento}
                      onChange={(e) => handleChange("nombre_alimento", e.target.value)}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Tipo:</label>
                    <input
                      type="text"
                      value={editingAlimento.tipo}
                      onChange={(e) => handleChange("tipo", e.target.value)}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Supermercado:</label>
                    <input
                      type="text"
                      value={editingAlimento.supermercado}
                      onChange={(e) => handleChange("supermercado", e.target.value)}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Marca:</label>
                    <input
                      type="text"
                      value={editingAlimento.marca}
                      onChange={(e) => handleChange("marca", e.target.value)}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Precio:</label>
                    <input
                      type="number"
                      value={editingAlimento.precio}
                      onChange={(e) => handleChange("precio", parseFloat(e.target.value))}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Calorías:</label>
                    <input
                      type="number"
                      value={editingAlimento.calorias}
                      onChange={(e) => handleChange("calorias", parseFloat(e.target.value))}
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </div>

                  <h4>Nutrientes:</h4>
                  {editingAlimento.nutrientes && editingAlimento.nutrientes.map((nutriente, index) => (
                    <div key={index} style={{ marginBottom: "0.5rem" }}>
                      <label>{nutriente.nombre_nutriente}:</label>
                      <input
                        type="number"
                        value={nutriente.cantidad}
                        onChange={(e) => handleNutrienteChange(index, parseFloat(e.target.value))}
                        style={{ marginLeft: "0.5rem" }}
                      />
                    </div>
                  ))}

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="button" onClick={handleGuardar}>
                      Guardar
                    </button>
                    <button type="button" onClick={handleCancelarEdicion}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlimentosList;
