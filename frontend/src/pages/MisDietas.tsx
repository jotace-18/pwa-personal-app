import React, { useEffect, useState } from "react";
import styles from "../styles/pages_styles/MisDietas.module.css";

interface Dieta {
  id_dieta: number;
  nombre_dieta: string;
  descripcion: string;
  tipo_dieta: string;
  fecha_inicio: string;
  activa: boolean;
}

const MisDietas: React.FC = () => {
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener las dietas desde la API
  const fetchDietas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/dieta"); // URL de la API
      if (!response.ok) {
        throw new Error("Error al obtener las dietas");
      }
      const data: Dieta[] = await response.json();
      setDietas(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietas();
  }, []);

  return (
    <div className={styles.MisDietas}>
      <div>Bienvenido, User</div>
      <div>Semana, Día del mes, Año</div>
      <div className={styles.dietasContainer}>
        {loading && <p>Cargando dietas...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && dietas.length === 0 && (
          <div>
            <p>No hay ninguna dieta creada.</p>
            <button className={styles.button}>Crear dieta</button>
          </div>
        )}
        {!loading && !error && dietas.length > 0 && (
          <>
            {dietas.map((dieta) => (
              <div key={dieta.id_dieta} className={styles.dietaCard}>
                <h3>{dieta.nombre_dieta}</h3>
                <p>{dieta.descripcion}</p>
                <p>
                  <strong>Tipo:</strong> {dieta.tipo_dieta}
                </p>
                <p>
                  <strong>Fecha de inicio:</strong> {dieta.fecha_inicio}
                </p>
                {/* Opcional: mostrar si la dieta está activa */}
                {/* <p>
                  <strong>Activa:</strong> {dieta.activa ? "Sí" : "No"}
                </p> */}
              </div>
            ))}
            <button className={styles.button}>Crear dieta</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MisDietas;