# API REST Films

API REST desarrollada con **Node.js** y **Express** para administrar un catálogo de películas. La aplicación utiliza **Firebase Firestore** como base de datos NoSQL y **JWT (JSON Web Token)** para proteger las rutas que requieren autenticación.

Este proyecto fue desarrollado como práctica de arquitectura por capas y servicios REST, aplicando una estructura escalable basada en rutas, controladores, servicios, modelos y middlewares.

---

## Tecnologías utilizadas

* Node.js
* Express
* Firebase Firestore
* JSON Web Token (JWT)
* body-parser
* dotenv
* CORS

---

## Arquitectura del proyecto

```
api-rest-films/
│
├── controllers/
├── data/
├── middlewares/
├── models/
├── public/
├── routes/
├── services/
├── utils/
├── index.js
├── package.json
└── .env
```

---

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` con las variables de entorno correspondientes.

Iniciar el servidor:

```bash
npm run start
```

---

## Variables de entorno

El proyecto requiere un archivo `.env` con, al menos, las siguientes variables:

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

JWT_SECRET_KEY=
```

---

## Endpoints principales

### Autenticación

**POST** `/auth/login`

Recibe un usuario y contraseña válidos y devuelve un token JWT.

Ejemplo:

```json
{
  "email": "user@email.com",
  "password": "strongPass123"
}
```

---

### Películas

**GET** `/api/films`

Obtiene el listado completo de películas.

---

**GET** `/api/films/:id`

Obtiene una película por su identificador.

---

**POST** `/api/films`

Crea una nueva película en Firestore.

Ejemplo:

```json
{
  "title": "Citizen Kane",
  "year": 1941,
  "director": "Orson Welles",
  "image": "/imagenes/citizen-kane.jpg",
  "video": "/videos/citizen-kane.mp4"
}
```

---

## Seguridad

Las rutas de la API están protegidas mediante **JWT**.

Para acceder a los recursos protegidos debe enviarse el encabezado:

```
Authorization: Bearer <TOKEN_JWT>
```

---

## Base de datos

Los datos se almacenan en **Firebase Firestore**, utilizando una colección denominada **films**.

Cada documento representa una película e incluye información como:

* Título
* Año
* Director
* Imagen
* Video

---

## Estado actual del proyecto

Actualmente la API permite:

* Autenticación mediante JWT.
* Consulta de películas almacenadas en Firestore.
* Alta de nuevas películas.
* Protección de rutas mediante middleware.
* Consumo y pruebas mediante Postman.

---

## Evolución prevista

Como continuación del proyecto se prevé incorporar:

* Frontend dinámico consumiendo la API mediante `fetch()`.
* Gestión de usuarios desde Firestore.
* Reproducción de películas desde una interfaz web.
* Administración completa (CRUD).
* Despliegue en Vercel.
