import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/ui/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./features/auth/AuthPage";
import AlimentosForm from "./features/alimentos/AlimentosForm";
import AlimentosList from "./features/alimentos/AlimentosList";
import Planificacion from "./pages/planificacion";
import MisDietas from "./pages/MisDietas";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* RUTA PADRE con Layout */}
        <Route path="/" element={<Layout />}>
          {/* RUTA HIJA: al ir a "/" => HomePage */}
          <Route index element={<HomePage />} />

          {/* Más rutas hijas */}
          <Route path="alimentos" element={<AlimentosForm />} />
          <Route path="alimentos-list" element={<AlimentosList />} />
          <Route path=":type" element={<AuthPage />} />
          <Route path="planificacion" element={<Planificacion />} />
          <Route path="mis-dietas" element={<MisDietas />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
