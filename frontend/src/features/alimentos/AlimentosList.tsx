import { useState } from "react";
import axios from "axios";

// Definimos la interfaz de Alimento
interface Alimento {
  id_alimento: number;
  nombre_alimento: string;
}

const AlimentosList = () => {
  const [showAlimentos, setShowAlimentos] = useState(false);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);

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

  return (
    <div style={{ margin: "2rem" }}>
      {!showAlimentos && (
        <button onClick={handleMostrar}>Mostrar Alimentos</button>
      )}

      {showAlimentos && (
        <>
          <ul>
            {alimentos.map((alimento) => (
              <li key={alimento.id_alimento}>{alimento.nombre_alimento}</li>
            ))}
          </ul>
          <button onClick={handleOcultar}>Ocultar Alimentos</button>
        </>
      )}
    </div>
  );
};

export default AlimentosList;
