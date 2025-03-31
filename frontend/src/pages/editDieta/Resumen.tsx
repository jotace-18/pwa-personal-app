import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/pages_styles/EditDieta.module.css";

const Resumen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.editDietaContainer}>
      <h1>Resumen de la Dieta</h1>
      <div className={styles.resumenContainer}>
        <div
          className={styles.resumenItem}
          onClick={() => navigate("/edit-dieta/lunes")}
        >
          <h2>Lunes</h2>
          <p>Visualiza y edita datos del Lunes</p>
        </div>
        <div
          className={styles.resumenItem}
          onClick={() => navigate("/edit-dieta/martes")}
        >
          <h2>Martes</h2>
          <p>Visualiza y edita datos del Martes</p>
        </div>
        <div
          className={styles.resumenItem}
          onClick={() => navigate("/edit-dieta/miercoles")}
        >
          <h2>Miércoles</h2>
          <p>Visualiza y edita datos del Miércoles</p>
        </div>
        <div
          className={styles.resumenItem}
          onClick={() => navigate("/edit-dieta/jueves")}
        >
          <h2>Jueves</h2>
          <p>Visualiza y edita datos del Jueves</p>
        </div>
        <div
          className={styles.resumenItem}
          onClick={() => navigate("/edit-dieta/viernes")}
        >
          <h2>Viernes</h2>
          <p>Visualiza y edita datos del Viernes</p>
        </div>
      </div>
      <div className={styles.navigationButtons}>
        <button className={styles.btnPrev} onClick={() => navigate(-1)}>
          Atrás
        </button>
        <button className={styles.btnNext} onClick={() => alert("Guardado!")}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default Resumen;