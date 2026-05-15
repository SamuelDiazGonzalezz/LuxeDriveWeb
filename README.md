# LuxeDrive - Sprint 4

Proyecto desarrollado con Ionic y Angular para el Sprint 4. La aplicacion implementa autenticacion con Firebase, gestion de perfiles en Firestore, consulta de vehiculos desde Firebase y favoritos persistidos para cada usuario.

## Objetivo del sprint

El trabajo pide una app Ionic con al menos 4 pantallas y estas funcionalidades:

- Registro de usuarios en Firebase
- Inicio de sesion con Firebase Auth
- Pantalla de favoritos protegida
- Pantalla de detalle con alta y baja de favoritos usando almacenamiento local del dispositivo

Este proyecto cubre esos requisitos con una app de catalogo de vehiculos de lujo.

## Tecnologias

- Angular 20
- Ionic Angular
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Capacitor
- SQLite con `@capacitor-community/sqlite`

## Funcionalidades implementadas

### 1. Registro de usuarios

Ruta: `/register`

- Alta de usuarios con email y contrasena mediante Firebase Auth
- Formulario con nombre, apellidos, email, contrasena, confirmacion e imagen
- Guardado del perfil en Firestore, coleccion `usuarios`
- La imagen del perfil se persiste en Firestore dentro del documento del usuario

### 2. Inicio de sesion

Ruta: `/login`

- Acceso con email y contrasena usando Firebase Auth
- Actualizacion del campo `ultimoAcceso` en Firestore

### 3. Catalogo

Ruta: `/vehiculos`

- Lectura de la coleccion `vehiculos` desde Firestore
- Vista de listado con acceso al detalle
- Boton por vehiculo para guardar o quitar de favoritos

### 4. Favoritos

Ruta: `/favoritos`

- Ruta protegida con `authGuard`
- Muestra solo los vehiculos marcados como favoritos por el usuario autenticado
- Si no hay favoritos, aparece un mensaje y un boton para ir al catalogo
- Los favoritos se guardan por usuario
- En navegador web, si SQLite no responde, la app usa `localStorage` como respaldo para evitar bloqueos

### 5. Detalle del vehiculo

Ruta: `/vehiculos/:id`

- Muestra imagen, descripcion, especificaciones y caracteristicas
- Permite anadir o quitar el vehiculo de favoritos
- Incluye feedback visual en el boton de favoritos

## Rutas principales

| Ruta | Descripcion |
|------|-------------|
| `/` | Inicio |
| `/sobre` | Informacion de la marca |
| `/vehiculos` | Catalogo completo |
| `/vehiculos/:id` | Detalle de un vehiculo |
| `/contacto` | Pagina de contacto |
| `/login` | Inicio de sesion |
| `/register` | Registro |
| `/favoritos` | Favoritos del usuario autenticado |
| `/checkout/info` | Paso 1 del checkout |
| `/checkout/pago` | Paso 2 del checkout |

## Estructura relacionada con Sprint 4

```text
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── pages/
│   │   ├── register/
│   │   ├── login/
│   │   ├── favorites/
│   │   ├── vehicle-detail/
│   │   └── vehicles/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── vehicle.service.ts
│   │   ├── favorites-storage.service.ts
│   │   └── sqlite.service.ts
│   ├── app.routes.ts
│   └── firebase.config.ts
└── assets/
```

## Datos en Firebase

### Coleccion `usuarios`

Cada documento de usuario guarda:

- `nombre`
- `apellidos`
- `correo`
- `rol`
- `fotoUrl`
- `creadoEn`
- `ultimoAcceso`

### Coleccion `vehiculos`

Cada vehiculo puede incluir:

- `nombre`
- `precio`
- `tipo`
- `imagen`
- `descripcion`
- `specs`
- `caracteristicas`

## Como ejecutar el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en desarrollo:

```bash
npm start
```

3. Generar build:

```bash
npm run build
```

## Validacion del sprint

Checklist de cumplimiento:

- [x] Proyecto hecho con Ionic y Angular
- [x] Pantalla de registro
- [x] Pantalla de login
- [x] Pantalla de favoritos
- [x] Pantalla de detalle
- [x] Registro con Firebase Auth
- [x] Perfil adicional en Firestore
- [x] Listado de vehiculos desde Firebase
- [x] Favoritos por usuario
- [x] Acceso protegido a favoritos
- [x] Boton para anadir o quitar favoritos desde detalle

## Notas

- En dispositivo o entorno compatible, los favoritos usan SQLite.
- En navegador web, la app aplica un fallback a `localStorage` si SQLite no responde, para mantener la experiencia funcional durante la demo.
