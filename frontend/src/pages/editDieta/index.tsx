import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Lunes from "./Lunes";
/*import Martes from "./Martes";
import Miercoles from "./Miercoles";
import Jueves from "./Jueves";
import Viernes from "./Viernes";*/
import Resumen from "./Resumen";

const EditDietaIndex: React.FC = () => {
  return (
    <Routes>
      {/* Por defecto redirige a Lunes */}
      <Route path="/" element={<Navigate to="lunes" />} />
      <Route path="lunes" element={<Lunes />} />
      
      <Route path="resumen" element={<Resumen />} />
      {/* Opción fallback */}
      <Route path="*" element={<Navigate to="resumen" />} />
    </Routes>
  );
};

export default EditDietaIndex;