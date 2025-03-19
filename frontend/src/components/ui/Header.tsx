import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components_styles/Header.module.css";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                {/* Menú de navegación */}
                <Link to="/">Mi casa</Link>
                <Link to="/gym">Gym</Link>
                <Link to="/super">Super</Link>
                <Link to="/despensa">Despensa</Link>
                <Link to="/recetas">Recetas</Link>
                <Link to="/cartera">Cartera</Link>
                <Link to="/yo">Yo</Link> 
            </nav>
        </header>
    )
};
export default Header;