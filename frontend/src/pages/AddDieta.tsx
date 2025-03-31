import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages_styles/AddDieta.module.css";

const AddDieta: React.FC = () => {
  const [nombreDieta, setNombreDieta] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoDieta, setTipoDieta] = useState("Volumen");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dietaData = {
      nombre_dieta: nombreDieta,
      descripcion,
      tipo_dieta: tipoDieta,
    };

    try {
      const response = await fetch("http://localhost:4000/api/dieta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dietaData),
      });
      if (!response.ok) {
        throw new Error("Error al crear la dieta");
      }
      navigate("/mis-dietas");
    } catch (error: unknown) {
      let errMsg = "Error al crear la dieta.";
      if (error instanceof Error) {
        errMsg = error.message;
      }
      setError(errMsg);
    }
  };

  return (
    <div className={styles.AddDieta}>
      <h2>Crear una nueva dieta</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre_dieta">Nombre de la dieta</label>
          <input
            type="text"
            id="nombre_dieta"
            value={nombreDieta}
            onChange={(e) => setNombreDieta(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tipo_dieta">Tipo de dieta</label>
          <select
            id="tipo_dieta"
            value={tipoDieta}
            onChange={(e) => setTipoDieta(e.target.value)}
            required
          >
            <option value="Volumen">Volumen</option>
            <option value="Definición">Definición</option>
            <option value="Tonificación">Tonificación</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <button type="submit" className={styles.button}>
          Crear dieta
        </button>
      </form>
    </div>
  );
};

export default AddDieta;