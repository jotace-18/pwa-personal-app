import app from './app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
