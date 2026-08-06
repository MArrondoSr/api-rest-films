# API REST Films

Aplicación web Full Stack desarrollada con **Node.js**, **Express** y **Firebase**, que permite autenticarse, consultar un catálogo de películas y reproducir videos desde una interfaz web.

El backend implementa una arquitectura por capas (Routes → Controllers → Services → Models) y utiliza **Firebase Authentication**, **JWT** y **Firebase Admin SDK** para proteger el acceso a los datos almacenados en **Cloud Firestore**.

El frontend está desarrollado con **HTML**, **CSS** y **JavaScript** puro, consumiendo la API mediante `fetch()`.

---

# Tecnologías utilizadas

## Backend

- Node.js
- Express
- Firebase Authentication
- Firebase Admin SDK
- Cloud Firestore
- JSON Web Token (JWT)
- dotenv
- CORS

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

---

# Funcionalidades

- Login mediante Firebase Authentication.
- Generación de JWT propios del servidor.
- Protección de rutas mediante middleware.
- Catálogo dinámico obtenido desde Firestore.
- Página individual para cada película.
- Reproducción integrada de video.
- Gestión centralizada de autenticación desde el frontend.
- Despliegue en Vercel.

---

# Arquitectura

```
Usuario
    │
    ▼
Frontend (HTML / CSS / JavaScript)
    │
    ▼
Express API
    │
    ▼
Middleware JWT
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Models
    │
    ▼
Firebase Admin SDK
    │
    ▼
Cloud Firestore
```

---

# Estructura del proyecto

```
api-rest-films/
│
├── controllers/
├── data/
├── middlewares/
├── models/
├── public/
│   ├── css/
│   ├── imagenes/
│   ├── js/
│   ├── videos/
│   ├── film.html
│   ├── index.html
│   └── login.html
│
├── routes/
├── services/
├── utils/
├── index.js
├── package.json
└── .env
```

---

# Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env`.

Ejecutar:

```bash
npm run start
```

Servidor:

```
http://localhost:3000
```

---

# Variables de entorno

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

JWT_SECRET_KEY=
```

---

# Endpoints principales

## Autenticación

### POST `/auth/login`

Devuelve un JWT válido para acceder a la API.

---

## Películas

### GET `/api/films`

Obtiene el catálogo completo.

### GET `/api/films/:id`

Obtiene una película.

### POST `/api/films`

Crea una nueva película.

---

# Modelo de datos

Cada documento de la colección **films** contiene información como:

```json
{
  "title": "Citizen Kane",
  "year": 1941,
  "director": "Orson Welles",
  "genre": "Drama",
  "duration": 119,
  "country": "Estados Unidos",
  "rating": 8.3,
  "synopsis": "...",
  "image": "/imagenes/citizen-kane.jpg",
  "videoUrl": "/videos/citizen-kane.mp4"
}
```

---

# Seguridad

- Firebase Authentication para validar usuarios.
- JWT firmado por el servidor.
- Middleware para proteger la API.
- Firestore accedido exclusivamente mediante Firebase Admin SDK.
- Credenciales almacenadas mediante variables de entorno.

---

# Estado actual

Actualmente la aplicación permite:

- Login de usuarios.
- Autenticación con Firebase.
- Generación de JWT.
- Catálogo dinámico.
- Consulta individual de películas.
- Reproducción integrada de video.
- Despliegue en Vercel.

---

# Próximas mejoras

- Panel de administración.
- Edición y eliminación de películas.
- Gestión de roles de usuario.
- Firebase Storage para videos.
- Mejoras visuales del reproductor.