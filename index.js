import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

import filmsRoutes from './routes/films.routes.js';
import authRouter from './routes/auth.routes.js';
import { authentication } from './middlewares/authentication.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Datos recibidos: ${req.method} ${req.url}`);
    next();
});

app.use(express.static(join(__dirname, 'public')));

// Routers
app.use('/auth', authRouter);
app.use('/api/films', authentication, filmsRoutes);

// 404 al final
app.use((req, res) => {
    res.status(404).send('Recurso no encontrado o ruta inválida');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});