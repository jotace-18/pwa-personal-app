import React from "react";
import styles from "../styles/pages_styles/planificacion.module.css";
import { useNavigate } from "react-router-dom";


const Planificacion = () => {
  const navigate = useNavigate();
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const comidas = ["Desayuno 1", "Desayuno 2", "Almuerzo", "Merienda", "Cena"];
  const handleEditarDieta = () => {
    navigate("/edit-dieta");
  };


  return (
    <div className={styles.home}>
      <div className={styles.buttonsContainer}>
      <button className={styles.button} onClick={handleEditarDieta}>
          Editar dieta
        </button>
        <button className={styles.button}>Mostrar macros</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            {dias.map((dia) => (
              <th key={dia}>{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comidas.map((comida) => (
            <tr key={comida}>
              <td className={styles.rowHeader}>{comida}</td>
              {dias.map((dia) => (
                <td key={`${comida}-${dia}`} className={styles.cell}>
                  {/* Aquí puedes agregar contenido dinámico */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Planificacion;