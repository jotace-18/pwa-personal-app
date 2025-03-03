import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<h1 className="text-center mt-10">INICIO</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
