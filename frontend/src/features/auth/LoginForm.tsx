import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const LoginForm = () => {
  return (
    <form>
    <div className="text-center mb-3 py-4" style={{ fontSize: '32px' }}>Login Form</div>
    <div className="input-group mb-3">
      <div className="input-group-prepend">
      <span className="input-group-text"><FaUser style={{fontSize: '24px'}}/></span>
      </div>
      <input type="text" className="form-control" placeholder="Nombre de usuario" />
    </div>
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text"><FaLock style={{ fontSize: '24px' }} /></span>
      </div>
      <input type="password" className="form-control" placeholder="Contraseña" />
    </div>
    <div className="form-check mb-3">
      <input type="checkbox" className="form-check-input" id="Recuérdame" />
      <label className="form-check-label" htmlFor="Recuérdame">Recuérdame</label>

    </div>
    <div className="mb-3 text-end">
      <a href="#">¿Olvidaste tu contraseña?</a>
    </div>
    <div className="d-grid">
      <button type="submit" className="btn btn-secondary text-black">Iniciar sesión</button>
      
    </div>
    <div className="mb-3 text-center">
      <p>o</p>
    </div>
    <div className="mb-3 text-center">
      <p>Registrate <a href="#">aqui</a></p>
    </div>
    
    </form>
  );
  };
  
  export default LoginForm;
  