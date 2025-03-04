import LoginForm from "./LoginForm";


const AuthPage = () => {
    return (
      <div className="vh-100 w-100 bg-light d-flex justify-content-center align-items-center">
        <div className="bg-secondary p-5 rounded position-relative" style={{ width: "90%", height: "95%", opacity: 0.8 }}>
          
          {/* Contenedor oscuro */}
          <div className="bg-dark rounded p-5 d-flex justify-content-center align-items-center position-relative"
               style={{ width: "65%", height: "100%" }}>
            
            {/* Tarjeta del login */}
            <div className="bg-light rounded p-4 shadow-lg d-flex flex-column align-content-center"
                 style={{ width: "50%", height: "100%" }}> {/* Ajustamos la altura */}
                 < LoginForm />
            </div>
  
            {/* Logo en la esquina superior izquierda del contenedor oscuro */}
            <div className="position-absolute top-0 start-0 bg-warning p-2 rounded"
                 style={{ margin: "10px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h5 className="text-white m-0">L</h5>
            </div>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default AuthPage;
  