# API REST Films

Aplicación web desarrollada con **Node.js**, **Express** y **Firebase**, que permite registrar usuarios, autenticarse mediante JWT y acceder a un catálogo de películas almacenado en Cloud Firestore.

La aplicación implementa una arquitectura por capas (**Routes → Controllers → Services → Models**), autenticación mediante **Firebase Authentication**, autorización por roles (`viewer` y `admin`) y un frontend que consume la API utilizando `fetch()`.

---

## Características principales

- Arquitectura por capas.
- Firebase Authentication + Cloud Firestore.
- Autenticación mediante JWT.
- Roles de usuario (`viewer` / `admin`).
- Registro y verificación obligatoria de correo electrónico.
- Recuperación de contraseña.
- Aprobación manual de nuevos usuarios.
- Activación y desactivación de cuentas.
- Administración de roles desde la interfaz web.
- Catálogo dinámico de películas.
- Reproductor integrado.
- Panel de administración.
- CRUD completo de películas desde la interfaz web.
- Gestión administrativa de usuarios.
- Despliegue en Vercel.

---

## Capturas de pantalla

### Inicio de sesión

![Login](assets/screenshots/01-login.png)

### Registro

![Registro](assets/screenshots/02-register.png)

### Cartelera

![Cartelera](assets/screenshots/03-gallery.png)

### Ficha de película

![Película](assets/screenshots/04-film.png)

### Panel de administración

![Panel de administración](assets/screenshots/05-admin.png)

---

## Tecnologías utilizadas

### Backend

- Node.js
- Express
- Firebase Authentication
- Firebase Admin SDK
- Cloud Firestore
- JSON Web Token (JWT)
- body-parser
- dotenv
- CORS

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Deploy

- Vercel

---

## Funcionalidades

### Usuarios

- Registro de nuevos usuarios.
- Verificación obligatoria del correo electrónico.
- Reenvío del correo de verificación.
- Recuperación de contraseña mediante email.
- Registro inicial con rol `viewer`.
- Nuevas cuentas creadas como pendientes de aprobación.
- Autorización manual por parte de un administrador.
- Activación y desactivación de usuarios.
- Cambio de rol `viewer ↔ admin`.
- Bloqueo de acceso de usuarios desactivados.
- Protección para impedir que un administrador se quite accidentalmente su propio rol o desactive su propia cuenta.

### Películas

- Catálogo dinámico obtenido desde Firestore.
- Consulta individual de películas.
- Búsqueda por título, director o año.
- Alta de películas.
- Modificación.
- Eliminación.
- Página individual para cada película.
- Reproducción integrada de video.
- Conservación de la posición de reproducción durante la navegación dentro de la ficha.

### Administración

- Panel exclusivo para usuarios con rol `admin`.
- Listado y búsqueda de películas.
- CRUD completo desde la interfaz web.
- Formulario reutilizable para alta y edición.
- Eliminación con confirmación.
- Actualización automática del catálogo.
- Listado de usuarios.
- Identificación de usuarios pendientes, activos e inactivos.
- Aprobación de nuevas cuentas.
- Activación y desactivación de usuarios.
- Cambio de roles desde el panel.
- Protección del panel según el rol del usuario.

---

## Flujo de registro y acceso

1. El usuario crea una cuenta.
2. Firebase Authentication registra sus credenciales.
3. Se crea automáticamente un perfil en Firestore con:

```text
role: viewer
approved: false
active: false
```

4. Firebase envía un correo de verificación.
5. El usuario verifica su dirección de correo electrónico.
6. La cuenta permanece pendiente hasta que un administrador la autoriza.
7. El administrador aprueba la cuenta desde el panel.
8. El perfil pasa a:

```text
approved: true
active: true
```

9. El usuario puede iniciar sesión.
10. El servidor genera un JWT.
11. El frontend utiliza ese JWT para consumir la API.

Un usuario previamente aprobado puede ser desactivado posteriormente:

```text
approved: true
active: false
```

En ese estado no puede iniciar sesión y, si ya tenía una sesión activa, pierde el acceso en la siguiente solicitud autenticada.

---

## Arquitectura

```text
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
    ├── Verificación de usuario activo
    │
    └── Control de rol
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

## Estructura del proyecto

```text
api-rest-films/
│
├── controllers/
│   ├── auth.controller.js
│   ├── films.controller.js
│   └── users.controller.js
│
├── data/
├── middlewares/
├── models/
│
├── public/
│   ├── css/
│   │   ├── admin.css
│   │   ├── estilos.css
│   │   └── login.css
│   │
│   ├── imagenes/
│   ├── js/
│   ├── videos/
│   │
│   ├── admin.html
│   ├── film.html
│   ├── forgot-password.html
│   ├── index.html
│   ├── login.html
│   └── register.html
│
├── routes/
│   ├── auth.routes.js
│   ├── films.routes.js
│   └── users.routes.js
│
├── services/
├── utils/
│
├── assets/
│   └── screenshots/
│
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

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` con las variables correspondientes.

Ejecutar:

```bash
npm run start
```

Servidor local:

```text
http://localhost:3000
```

---

## Variables de entorno

```text
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

## Endpoints principales

### Autenticación y usuarios

**POST** `/auth/register`

Registra un nuevo usuario con rol `viewer`, estado pendiente y envía un correo de verificación.

**POST** `/auth/login`

Autentica al usuario y devuelve un JWT válido para acceder a la API.

**POST** `/auth/forgot-password`

Envía un correo para restablecer la contraseña.

**POST** `/auth/resend-verification`

Reenvía el correo de verificación.

---

### Películas

**GET** `/api/films`

Obtiene el catálogo completo.

**GET** `/api/films/:id`

Obtiene una película por su identificador.

**GET** `/api/films/buscar`

Busca películas utilizando parámetros de consulta (`title`, `director`, `year`).

**POST** `/api/films`

Crea una nueva película.

**PUT** `/api/films/:id`

Actualiza una película existente.

**DELETE** `/api/films/:id`

Elimina una película.

> Las operaciones **POST**, **PUT** y **DELETE** requieren autenticación y rol `admin`.

---

### Administración de usuarios

Todos los endpoints de esta sección requieren autenticación y rol `admin`.

**GET** `/api/users`

Obtiene los usuarios registrados y sus estados.

**PUT** `/api/users/:id/approve`

Autoriza una cuenta pendiente y la activa.

**PUT** `/api/users/:id/activate`

Reactiva un usuario previamente autorizado.

**PUT** `/api/users/:id/deactivate`

Desactiva un usuario.

**PUT** `/api/users/:id/role`

Modifica el rol del usuario.

Ejemplo:

```json
{
  "role": "admin"
}
```

Los roles permitidos son:

```text
viewer
admin
```

---

## Modelo de datos

La aplicación utiliza principalmente las colecciones `films` y `users`.

### Colección `films`

Cada documento representa una película y puede contener:

- `title`
- `director`
- `year`
- `genre`
- `duration`
- `country`
- `rating`
- `synopsis`
- `image`
- `videoUrl`

Ejemplo:

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

### Colección `users`

Cada documento contiene el perfil asociado a una cuenta:

- `email`
- `name`
- `role`
- `approved`
- `active`

Estados principales:

```text
approved: false
active: false
→ Cuenta pendiente de autorización
```

```text
approved: true
active: true
→ Cuenta autorizada y activa
```

```text
approved: true
active: false
→ Cuenta autorizada pero desactivada
```

---

## Seguridad

- Firebase Authentication para validar credenciales.
- Verificación obligatoria del correo electrónico.
- JWT firmado por el servidor.
- Middleware de autenticación.
- Middleware `requireAdmin`.
- Autorización basada en roles (`viewer` / `admin`).
- Verificación del estado `active` en solicitudes autenticadas.
- Aprobación administrativa previa al primer acceso.
- Bloqueo de inicio de sesión para cuentas pendientes o inactivas.
- Protección contra auto-desactivación del administrador.
- Protección contra la eliminación accidental del propio rol `admin`.
- Validación de roles admitidos desde el backend.
- Firestore accedido desde el backend mediante Firebase Admin SDK.
- Credenciales y secretos almacenados mediante variables de entorno.

---

## Estado actual

La aplicación se encuentra desplegada y funcional en Vercel, utilizando Cloud Firestore como base de datos.

El sistema permite completar el ciclo de registro, verificación de correo, aprobación administrativa, autenticación y recuperación de contraseña.

Los usuarios con rol `viewer` pueden acceder al catálogo, consultar fichas individuales y utilizar el reproductor integrado.

Los usuarios con rol `admin` disponen además de un panel desde el cual pueden administrar completamente el catálogo y gestionar las cuentas registradas.

La administración de usuarios permite actualmente:

- aprobar nuevas cuentas;
- distinguir usuarios pendientes, activos e inactivos;
- desactivar y reactivar cuentas;
- asignar o retirar el rol `admin`.

Las modificaciones realizadas desde el panel se reflejan directamente en Cloud Firestore.

---

## Próximas mejoras

- Mejoras generales de experiencia de usuario.
- Gestión de imágenes desde el panel.
- Integración con almacenamiento externo para videos.
- Mejoras del reproductor.
- Personalización de los correos enviados por Firebase.
- Validaciones adicionales del backend.
- Refactorización y limpieza general del proyecto.