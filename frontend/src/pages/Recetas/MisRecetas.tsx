import React, { useEffect, useState } from "react";
import styles from "../../styles/pages_styles/MisRecetas.module.css";

interface Receta {
  id_receta: number;
  nombre: string;
  descripcion: string;
  instrucciones: string;
  tiempo_preparacion: string;
  user_id: number;
}

const MisRecetas: React.FC = () => {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecetas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/receta");
      if (!response.ok) {
        throw new Error("Error al obtener las recetas");
      }
      const data: Receta[] = await response.json();
      setRecetas(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al obtener las recetas");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  return (
    <div className={styles.MisRecetas}>
      <div className={styles.header}>
        <h2>Bienvenido, User</h2>
        <p>Semana, Día del mes, Año</p>
      </div>
      <button className={styles.createButton}>Crear receta</button>

      {loading && <p className={styles.message}>Cargando recetas...</p>}
      {error && <p className={styles.error}>Error al obtener las recetas</p>}
      {!loading && !error && recetas.length === 0 && (
        <p className={styles.message}>No hay ninguna receta creada</p>
      )}

      <div className={styles.recetasContainer}>
        {!loading && !error && recetas.map((receta) => (
          <div key={receta.id_receta} className={styles.recetaCard}>
            <div className={styles.cardHeader}>
              <button className={styles.editButton}>✏️</button>
              <button className={styles.deleteButton}>🗑️</button>
            </div>
            <h3>{receta.nombre}</h3>
            <p>{receta.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisRecetas;