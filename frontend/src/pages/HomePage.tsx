import React from "react";
import styles from "../styles/pages_styles/HomePage.module.css";

const HomePage: React.FC = () => {
    return(
        <div className={styles.home}>
            <div>Bienvenido, User</div>
            <div>Semana, Día del mes, Año</div>
        </div>
    )
};
export default HomePage;