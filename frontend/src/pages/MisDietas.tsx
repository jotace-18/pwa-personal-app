import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [dietaToDelete, setDietaToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchDietas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/dieta");
      if (!response.ok) {
        throw new Error("Error al obtener las dietas");
      }
      const data: Dieta[] = await response.json();
      // Ordena: las dietas activas primero
      data.sort((a, b) => Number(b.activa) - Number(a.activa));
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

  const toggleActivation = (id: number, currentState: boolean) => {
    const newActivationValue = !currentState;
    // Actualiza localmente: la dieta clicada se activa o desactiva, y las demás se ponen en false
    const updatedDietas = dietas.map((dieta) =>
      dieta.id_dieta === id ? { ...dieta, activa: newActivationValue } : { ...dieta, activa: false }
    );
    setDietas(updatedDietas);

    fetch(`http://localhost:4000/api/dieta/${id}/activar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activa: newActivationValue }),
    })
      .then(() => fetchDietas())
      .catch((error) =>
        console.error("Error al actualizar la activación:", error)
      );
  };

  // Funciones del Modal de confirmación
  const openDeleteModal = (id: number) => {
    setDietaToDelete(id);
    setModalVisible(true);
  };

  const closeDeleteModal = () => {
    setModalVisible(false);
    setDietaToDelete(null);
  };

  const confirmDelete = () => {
    if (dietaToDelete !== null) {
      fetch(`http://localhost:4000/api/dieta/${dietaToDelete}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al eliminar la dieta");
          }
          return res.json();
        })
        .then(() => fetchDietas())
        .catch((error) => console.error("Error al eliminar la dieta:", error))
        .finally(() => closeDeleteModal());
    }
  };

  useEffect(() => {
    fetchDietas();
  }, []);

  return (
    <div className={styles.MisDietas}>
      <div className={styles.header}>
        <div>Bienvenido, User</div>
        <div>Semana, Día del mes, Año</div>
      </div>
      <div className={styles.dietasContainer}>
        {loading && <p>Cargando dietas...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && dietas.length === 0 && (
          <div className={styles.noDietas}>
            <p>No hay ninguna dieta creada.</p>
            <button
              className={styles.button}
              onClick={() => navigate("/add-dieta")}
            >
              Crear dieta
            </button>
          </div>
        )}
        {!loading && !error && dietas.length > 0 && (
          <>
            {dietas.map((dieta) => (
              <div
                key={dieta.id_dieta}
                className={`${styles.dietaCard} ${dieta.activa ? styles.active : ""}`}
              >
                <div className={styles.cardHeader}>
                  <h3>{dieta.nombre_dieta}</h3>
                  <div className={styles.actionButtons}>
                    <button className={styles.buttonEdit} onClick={() => navigate("/edit-dieta/resumen")}>
                      <FaEdit />
                    </button>
                    <button
                      className={styles.buttonDelete}
                      onClick={() => openDeleteModal(dieta.id_dieta)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <p>{dieta.descripcion}</p>
                  <p>
                    <strong>Tipo:</strong> {dieta.tipo_dieta}
                  </p>
                  <p>
                    <strong>Fecha de inicio:</strong> {dieta.fecha_inicio}
                  </p>
                </div>
                <div className={styles.cardFooter}>
                  <label className={styles.activationLabel}>Activado</label>
                  <input
                    type="checkbox"
                    checked={dieta.activa}
                    onChange={() =>
                      toggleActivation(dieta.id_dieta, dieta.activa)
                    }
                  />
                </div>
              </div>
            ))}
            <button
              className={styles.button}
              onClick={() => navigate("/add-dieta")}
            >
              Crear dieta
            </button>
          </>
        )}
      </div>
      {modalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>¿Estás seguro de que quieres eliminar esta dieta?</p>
            <div className={styles.modalButtons}>
              <button className={styles.modalConfirm} onClick={confirmDelete}>
                Sí
              </button>
              <button className={styles.modalCancel} onClick={closeDeleteModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisDietas;