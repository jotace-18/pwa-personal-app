import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage";
import AlimentosForm from "./features/alimentos/AlimentosForm";
import AlimentosList from "./features/alimentos/AlimentosList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/alimentos" element={<AlimentosForm />} />
        <Route path="/:type" element={<AuthPage />} />
        <Route path="/" element={<h1 className="text-center mt-10">INICIO</h1>} />
        <Route path="/alimentos-list" element={<AlimentosList />} />
      </Routes>
    </Router>
  );
};

export default App;
