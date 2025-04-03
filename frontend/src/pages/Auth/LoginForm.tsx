import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGithub, FaGoogle} from "react-icons/fa";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      <div className="text-center mb-3 mt-4 py-5" style={{ fontSize: "32px" }}>
        Login Form
      </div>

      {/* Campo de usuario */}
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <FaUser style={{ fontSize: "24px" }} />
          </span>
        </div>
        <input type="text" className="form-control" placeholder="Nombre de usuario" />
      </div>

      {/* Campo de contraseña con botón de ojo */}
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <FaLock style={{ fontSize: "24px" }} />
          </span>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          placeholder="Contraseña"
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Checkbox "Recuérdame" */}
      <div className="form-check mb-3">
        <input type="checkbox" className="form-check-input" id="Recuérdame" />
        <label className="form-check-label" htmlFor="Recuérdame">
          Recuérdame
        </label>
      </div>

      {/* Enlace "¿Olvidaste tu contraseña?" */}
      <div className="mb-3 text-end">
        <a href="#">¿Olvidaste tu contraseña?</a>
      </div>

      {/* Contenedor de inicio de sesión, separador y enlace de registro */}
      <div className="d-flex flex-column align-items-center gap-2 mt-3">
        <button type="submit" className="btn btn-secondary text-black w-100">
          Iniciar sesión
        </button>

        <p className="my-2">o</p>

        <p>
          Regístrate <a href="/register">aquí</a>
        </p>
      </div>
      <div className="d-flex justify-content-center gap-3 mt-3">
        <a href="#"><FaGithub style={{fontSize: "32px"}} /></a>
        <a href="#"><FaGoogle style={{fontSize: "32px"}} /></a>
      </div>

    </form>
  );
};

export default LoginForm;
