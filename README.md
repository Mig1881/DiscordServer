# 🚀 Discord Clone API - Backend Project

Un backend robusto y escalable diseñado para emular las funcionalidades principales de Discord. Desarrollado con **NestJS**, este proyecto incluye autenticación segura, gestión de servidores y canales, control de roles (RBAC), y comunicación en tiempo real.

## ✨ Características Principales

- **Autenticación y Autorización:** Sistema de login/registro con JWT (JSON Web Tokens) y contraseñas encriptadas con Bcrypt.
- **Gestión de Entidades:** CRUD completo para Usuarios, Servidores (Discord Servers), Canales y Mensajes usando TypeORM.
- **Control de Acceso por Roles (RBAC):** Restricción de rutas críticas (ej. borrar un canal) para que solo el propietario (`OWNER`) del servidor pueda ejecutarlas.
- **Tiempo Real:** Integración de WebSockets (`Socket.io`) para emitir mensajes en tiempo real a los clientes conectados a un canal.
- **Testing Unitario:** Cobertura de pruebas con `Jest` para los servicios críticos y de negocio, simulando dependencias y repositorios.

## 🛠️ Tecnologías Utilizadas

- **Framework:** NestJS
- **Base de Datos:** TypeORM (Configurado para MySQL/PostgreSQL/SQLite)
- **Seguridad:** Passport, JWT, Bcrypt
- **Tiempo Real:** @nestjs/websockets, Socket.io
- **Testing:** Jest

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/Mig1881/DiscordServer
cd discord-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo \`.env\` en la raíz del proyecto basándote en el archivo de ejemplo y configura tus credenciales de base de datos y tu `JWT_SECRET`.

### 4. Arrancar el servidor
```bash
# Modo desarrollo
npm run start:dev
```

---

## 🧪 Cómo probar la API de forma básica

Recomiendo usar **Postman** o **Hoppscotch**.

### Paso 1: Autenticación
1. Haz un `POST` a `/auth/register` con un email y contraseña.
2. Haz un `POST` a `/auth/login` con esas credenciales.
3. Copia el `access_token` que devuelve el servidor.
4. En Postman, ve a la pestaña *Authorization*, selecciona *Bearer Token* y pega tu token. (Tendrás que hacer esto para las siguientes peticiones).

### Paso 2: Crear el entorno
1. **Crear Servidor:** Haz un `POST` a `/discord-servers` (Ej: `{ "name": "Mi Servidor Gaming" }`).
2. **Crear Canal:** Coge el ID del servidor recién creado y haz un `POST` a `/channels` (Ej: `{ "name": "general", "serverId": "ID_DEL_SERVIDOR" }`).

### Paso 3: WebSockets
1. En Postman, abre una nueva pestaña de tipo **Socket.io** (No WebSocket normal).
2. Conéctate a: `http://localhost:3000`
3. En la sección de *Events*, añade uno para escuchar llamado: `newMessage-AQUÍ_EL_ID_DEL_CANAL`.
4. Vuelve a tu pestaña HTTP normal y haz un `POST` a `/messages` enviando un mensaje a ese canal.
5. Vuelve a la pestaña de Socket.io y... ¡verás el mensaje aparecer al instante!

---

## 🚦 Ejecución de Tests

El proyecto cuenta con una suite de pruebas unitarias para asegurar la estabilidad de la lógica crítica.

```bash
npm run test
```
o si quieres ver con detalle que hace cada test  
```bash
npm test --  --verbose
```
Tambien existe un test de integracion e2e que verifica la integración de TypeORM, WebSockets, JWT y ConfigModule.  

Para ejecutarlo:  
```bash
npm run test:e2e
```