import Usuario from './usuarioModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../config/env.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body; // username viene del frontend
    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario (mapeando username a nombre)
        const newUser = await Usuario.create({
            nombre: username,
            email,
            password: hashedPassword,
        });

        // Crear un token de autenticación usando el id_user
        const token = jwt.sign({ userId: newUser.id_user }, jwtSecret, { expiresIn: '1h' });

        res.status(201).json({ message: 'Registro exitoso.', token });
    } catch (error) {
        console.error("Error en register:", error);
        res.status(500).json({ message: 'Error al registrar. Por favor, intenta nuevamente.' });
    }
};

export default { register };
