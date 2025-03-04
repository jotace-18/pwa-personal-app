import { useParams, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
  const { type } = useParams(); // Obtiene 'login' o 'register' de la URL
  const navigate = useNavigate();

  // Redirigir a /login si no es un tipo válido
  if (type !== "login" && type !== "register") {
    navigate("/login", { replace: true });
  }

  return (
    <div className="vh-100 w-100 bg-light d-flex justify-content-center align-items-center">
      <div
        className="bg-secondary p-5 rounded position-relative"
        style={{ width: "90%", height: "95%", opacity: 0.8 }}
      >
        {/* Contenedor oscuro */}
        <div
          className="bg-dark rounded p-5 d-flex justify-content-center align-items-center position-relative"
          style={{ width: "65%", height: "100%" }}
        >
          {/* Tarjeta del login o registro */}
          <div
            className="bg-light rounded p-4 shadow-lg d-flex flex-column align-content-center"
            style={{ width: "50%", height: "100%" }}
          >
            {type === "login" ? <LoginForm /> : <RegisterForm />}
          </div>

          {/* Logo en la esquina superior izquierda */}
          <div
            className="position-absolute top-0 start-0 bg-warning p-2 rounded"
            style={{
              margin: "10px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h5 className="text-white m-0">L</h5>
          </div>
        </div>

        {/* Botón para cambiar entre Login y Registro */}
        <div className="text-center mt-3">
          <button
            className="btn btn-link text-white"
            onClick={() => navigate(type === "login" ? "/register" : "/login")}
          >
            {type === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
