import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordsMatch(e.target.value === password2);
    };

    const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword2(e.target.value);
        setPasswordsMatch(e.target.value === password);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordsMatch) {
            const userData = {
                username,
                email,
                password,
            };
            // Handle form submission
            console.log("Form submitted", userData);
        } else {
            console.log("Passwords do not match");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="text-center mb-3 mt-4 py-5" style={{ fontSize: "32px" }}>
                Formulario de Registro
            </div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Nombre de Usuario
                </label>
                <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <label htmlFor="email" className="form-label mt-3">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={handleEmailChange}
                />
                <label htmlFor="password" className="form-label mt-3">
                    Contraseña
                </label>
                <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <label htmlFor="password2" className="form-label mt-3">
                    Confirmar Contraseña
                </label>
                <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password2"
                        className="form-control"
                        value={password2}
                        onChange={handlePassword2Change}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {!passwordsMatch && (
                    <div className="text-danger mt-2">Las contraseñas no coinciden</div>
                )}
            </div>
            <div className="d-flex flex-column align-items-center gap-2 mt-3">
                    <button type="submit" className="btn btn-secondary text-black w-100">
                      Registrate
                    </button>
            
                    <p className="my-2">o</p>
            
                    <p>
                      Inicia sesión <a href="/login">aquí</a>
                    </p>
            </div>
        </form>
    );
};

export default RegisterForm;
