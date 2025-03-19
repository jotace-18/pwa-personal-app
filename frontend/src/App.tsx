import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/ui/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./features/auth/AuthPage";
import AlimentosForm from "./features/alimentos/AlimentosForm";
import AlimentosList from "./features/alimentos/AlimentosList";

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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
