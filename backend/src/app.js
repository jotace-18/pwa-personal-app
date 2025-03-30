import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import sequelize from './config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Habilitar CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Conectar a la base de datos
sequelize.authenticate()
    .then(() => console.log('Conectado a la base de datos'))
    .catch((error) => console.error('Error al conectar a la base de datos:', error));

// Middleware
app.use(bodyParser.json());

// Usar las rutas
app.use('/api', routes);

export default app;
