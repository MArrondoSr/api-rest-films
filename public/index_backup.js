import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Middleware de aplicación
app.use((req, res, next) => {
console.log(`Datos recibidos: ${req.method} ${req.url}`);
next(); // Pasa el control al siguiente middleware o ruta
});

//Archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// app.get('/', (req,res) => {
//     res.send('Hola, mundo, desde Express!')
// });

// app.get('/productos', (req,res) => {
//     res.send('Hola, mundo, desde PRODUCTOS!')
// });

// app.post('/productos', (req,res) => {
//     res.send('Hola, mundo, desde PRODUCTOS!')
// });


// Configurar middleware para servir archivos estáticos

// Ruta JSON
app.get('/peliculas', (req, res) => {
    const peliculas = [
        {
            id: 1,
            title: "Streets of Fire",
            year: 1984
        },
        {
            id: 2,
            title: "The Girls on a Motorcycle",
            year: 1968
        }
    ];

    res.json(peliculas);
});


const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Servidor en http://localhost:${PORT}`);
});