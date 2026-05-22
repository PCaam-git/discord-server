
```md
# Discord Server API

Backend de una plataforma de comunicación al estilo Discord. Está construido con **NestJS**, **TypeScript**, **TypeORM**, **PostgreSQL** y **Docker**.

Con esta API puedes gestionar una jerarquía básica compuesta por:

- Usuarios
- Servidores
- Canales
- Mensajes

También incluye autenticación con JWT, validación de datos usando DTOs y Pipes, documentación interactiva con Swagger, y un middleware que registra todas las peticiones.

---

## 1. Objetivo del proyecto

El objetivo es desarrollar una API REST sólida para una plataforma de comunicación inspirada en Discord.

La API se encarga de administrar la estructura principal de la aplicación:

```
Usuario → Servidor → Canal → Mensaje
```

El sistema permite:

- Registrar usuarios.
- Iniciar sesión y obtener un token JWT.
- Crear, consultar, actualizar y eliminar usuarios, servidores y canales.
- Crear y consultar mensajes dentro de canales.
- Proteger rutas privadas mediante Guards.
- Validar los datos de entrada antes de que lleguen a la lógica de negocio.
- Levantar la aplicación y la base de datos con Docker Compose.

---

## 2. Tecnologías utilizadas

- **NestJS**: framework principal de la API.
- **TypeScript**: lenguaje base.
- **TypeORM**: ORM para manejar la base de datos con entidades y repositorios.
- **PostgreSQL**: motor de base de datos.
- **JWT**: autenticación por tokens.
- **class-validator / class-transformer**: validación y transformación de DTOs.
- **Docker / Docker Compose**: para contenerizar la app y la base de datos.
- **Swagger**: documentación interactiva de la API.
- **pnpm**: gestor de paquetes usado en desarrollo.

---

## 3. Requisitos cubiertos

El proyecto cumple con los cinco requisitos obligatorios:

| Requisito                   | Estado                                                  |
| --------------------------- | ------------------------------------------------------- |
| Arquitectura REST completa  | Implementado                                            |
| Persistencia con ORM        | Implementado con TypeORM y PostgreSQL                   |
| Seguridad y autenticación   | Implementado con JWT y Guards                           |
| Validación y transformación | Implementado con DTOs, class-validator y ValidationPipe |
| Contenerización con Docker  | Implementado con Dockerfile y docker-compose.yml        |

Además, se incluyen dos funcionalidades opcionales:

| Extra                                 | Estado                                  |
| ------------------------------------- | --------------------------------------- |
| Documentación interactiva con Swagger | Implementado en `/api/docs`             |
| Logs y monitorización                 | Implementado mediante middleware global |

---

## 4. Arquitectura del proyecto

El proyecto sigue una arquitectura modular típica de NestJS.

Estructura principal:

```text
src/
├── auth/
│   ├── dto/
│   ├── guards/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── channels/
│   ├── dto/
│   ├── channel.entity.ts
│   ├── channels.controller.ts
│   ├── channels.module.ts
│   └── channels.service.ts
├── common/
│   └── middleware/
│       └── logger.middleware.ts
├── messages/
│   ├── dto/
│   ├── message.entity.ts
│   ├── messages.controller.ts
│   ├── messages.module.ts
│   └── messages.service.ts
├── servers/
│   ├── dto/
│   ├── server.entity.ts
│   ├── servers.controller.ts
│   ├── servers.module.ts
│   └── servers.service.ts
├── users/
│   ├── dto/
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

La responsabilidad está bien separada:

- Los **controladores** manejan las peticiones HTTP.
- Los **servicios** contienen la lógica de negocio.
- Las **entidades** representan las tablas de la base de datos.
- Los **DTOs** validan los datos de entrada.
- Los **módulos** agrupan cada dominio funcional.

---

## 5. Modelo de datos

Estas son las entidades principales:

### User

Representa a los usuarios de la plataforma.

Campos principales:

- `id`
- `username`
- `email`
- `password`
- `createdAt`
- `updatedAt`

La contraseña se guarda cifrada y no se devuelve en las respuestas normales de la API.

### Server

Representa un servidor creado por un usuario.

Campos principales:

- `id`
- `name`
- `description`
- `owner`
- `createdAt`
- `updatedAt`

Relación:

```text
User 1:N Server
```

Un usuario puede crear varios servidores, y cada servidor tiene un único propietario.

### Channel

Representa un canal dentro de un servidor.

Campos principales:

- `id`
- `name`
- `type`
- `server`
- `createdAt`
- `updatedAt`

Relación:

```text
Server 1:N Channel
```

Un servidor puede tener muchos canales, y cada canal pertenece a un solo servidor.

### Message

Representa un mensaje enviado en un canal.

Campos principales:

- `id`
- `content`
- `author`
- `channel`
- `createdAt`
- `updatedAt`

Relaciones:

```text
User 1:N Message
Channel 1:N Message
```

Un usuario puede escribir muchos mensajes, y un canal puede contener muchos mensajes.

---

## 6. Autenticación y seguridad

La API tiene un módulo de autenticación con dos endpoints principales:

```text
POST /api/auth/register
POST /api/auth/login
```

Si el login es correcto, la API devuelve un `accessToken`.

Ejemplo de respuesta:

```json
{
  "accessToken": "jwt_token",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@test.com"
  }
}
```

Las rutas protegidas esperan el header:

```text
Authorization: Bearer <token>
```

Si no se envía token o es inválido, la respuesta es:

```text
401 Unauthorized
```

Además, al crear servidores y mensajes, el usuario asociado no se toma del body, sino del token JWT:

- El usuario autenticado se asigna como propietario del servidor.
- El mismo usuario se asigna como autor del mensaje.

Esto evita que un cliente pueda enviar manualmente el ID de otro usuario.

---

## 7. Validación de datos

El proyecto usa `class-validator`, `class-transformer` y `ValidationPipe`.

Configuración global en `main.ts`:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Esto permite:

- Rechazar campos no permitidos.
- Validar campos obligatorios.
- Validar formatos como el email.
- Transformar los datos antes de llegar al servicio.

Ejemplo de error de validación:

```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 8. Endpoints principales

### Auth

| Método | Ruta                 | Descripción         | Acceso  |
|--------|----------------------|---------------------|---------|
| POST   | `/api/auth/register` | Registra un usuario | Público |
| POST   | `/api/auth/login`    | Inicia sesión       | Público |

### Users

| Método | Ruta                | Descripción          |
|--------|---------------------|----------------------|
| GET    | `/api/users`        | Lista usuarios       |
| GET    | `/api/users/:id`    | Obtiene un usuario   |
| POST   | `/api/users`        | Crea un usuario      |
| PATCH  | `/api/users/:id`    | Actualiza un usuario |
| DELETE | `/api/users/:id`    | Elimina un usuario   |
| GET    | `/api/users/search` | Busca usuarios       |

### Servers

| Método | Ruta                  | Descripción            | Acceso          |
|--------|-----------------------|------------------------|-----------------|
| GET    | `/api/servers`        | Lista servidores       | Público         |
| GET    | `/api/servers/search` | Busca servidores       | Público         |
| GET    | `/api/servers/:id`    | Obtiene un servidor    | Público         |
| POST   | `/api/servers`        | Crea un servidor       | Protegido (JWT) |
| PATCH  | `/api/servers/:id`    | Actualiza un servidor  | Protegido (JWT) |
| DELETE | `/api/servers/:id`    | Elimina un servidor    | Protegido (JWT) |

### Channels

| Método | Ruta                              | Descripción                         | Acceso          |
|--------|-----------------------------------|-------------------------------------|-----------------|
| GET    | `/api/servers/:serverId/channels` | Lista canales de un servidor        | Público         |
| GET    | `/api/channels/search`            | Busca canales                       | Público         |
| GET    | `/api/channels/:id`               | Obtiene un canal                    | Público         |
| POST   | `/api/servers/:serverId/channels` | Crea un canal dentro de un servidor | Protegido (JWT) |
| PATCH  | `/api/channels/:id`               | Actualiza un canal                  | Protegido (JWT) |
| DELETE | `/api/channels/:id`               | Elimina un canal                    | Protegido (JWT) |

### Messages

| Método | Ruta                                 | Descripción                 | Acceso          |
|--------|--------------------------------------|-----------------------------|-----------------|
| GET    | `/api/channels/:channelId/messages` | Lista mensajes de un canal  | Público         |
| GET    | `/api/messages/search`              | Busca mensajes              | Público         |
| GET    | `/api/messages/:id`                 | Obtiene un mensaje          | Público         |
| POST   | `/api/channels/:channelId/messages` | Crea un mensaje en un canal | Protegido (JWT) |
| PATCH  | `/api/messages/:id`                 | Actualiza un mensaje        | Protegido (JWT) |
| DELETE | `/api/messages/:id`                 | Elimina un mensaje          | Protegido (JWT) |

### Protección de rutas

Las rutas identificadas como **Protegido (JWT)** requieren que el cliente envíe un token válido en la cabecera de autorización:

```text
Authorization: Bearer <accessToken>
```

La protección se implementa mediante `JwtAuthGuard`, aplicado en los controladores con el decorador:

```ts
@UseGuards(JwtAuthGuard)
```

---

## 9. Variables de entorno

El proyecto usa un archivo `.env`.

Ejemplo:

```env
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=nombre_db
POSTGRES_USER=nombre_user
POSTGRES_PASSWORD=nombre_password

JWT_SECRET=nombre_secret
JWT_EXPIRES_IN=1h
```

En Docker, la app se conecta a PostgreSQL usando el nombre del servicio:

```env
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

El archivo `.env` no debe subirse al repositorio. Para documentar las variables necesarias se incluye un `.env.example`.

---

## 10. Ejecución en local

Instalar dependencias:

```powershell
pnpm install
```

Levantar solo PostgreSQL con Docker:

```powershell
docker compose up -d postgres
```

Arrancar la app en modo desarrollo:

```powershell
pnpm run start:dev
```

La API estará disponible en:

```text
http://localhost:3000/api
```

---

## 11. Ejecución con Docker

El proyecto incluye:

```text
Dockerfile
docker-compose.yml
```

Para levantar la app y PostgreSQL con un solo comando:

```powershell
docker compose up --build
```

Servicios levantados:

```text
discord_app
discord_postgres
```

Para ver los contenedores activos:

```powershell
docker ps
```

La API estará en:

```text
http://localhost:3000/api
```

---

## 12. Acceso a PostgreSQL desde la terminal

La base de datos PostgreSQL se ejecuta dentro del contenedor Docker `discord_postgres`.

Con los contenedores levantados, se puede acceder a la terminal de PostgreSQL mediante PowerShell:

```powershell
docker exec -it discord_postgres psql -U discord_user -d discord_server_db
```

Una vez dentro de PostgreSQL, se pueden utilizar los siguientes comandos:

### Listar las tablas creadas

```sql
\dt
```

Resultado esperado:

```text
users
servers
channels
messages
```

### Consultar los datos almacenados

```sql
SELECT * FROM users;
SELECT * FROM servers;
SELECT * FROM channels;
SELECT * FROM messages;
```

### Consultar la estructura y las relaciones de cada tabla

```sql
\d users
\d servers
\d channels
\d messages
```

Estos comandos permiten comprobar las columnas, claves primarias y claves foráneas generadas por TypeORM.

Las relaciones principales que se pueden verificar son:

```text
User    1:N Server     → propietario del servidor
Server  1:N Channel    → canal perteneciente a un servidor
User    1:N Message    → autor del mensaje
Channel 1:N Message    → mensaje perteneciente a un canal
```

### Salir de PostgreSQL

```sql
\q
```

## 13. Swagger

La documentación interactiva está disponible en:

```text
http://localhost:3000/api/docs
```

Swagger permite ver todos los endpoints y probar peticiones directamente desde el navegador.

También incluye autenticación Bearer Token mediante el botón:

```text
Authorize
```

Formato del token:

```text
Bearer <accessToken>
```

---

## 14. Logs de peticiones

El proyecto incluye un middleware global que registra cada petición.

En la consola se ve algo como:

```text
[MÉTODO] /ruta - códigoEstado - tiempoMs
```

Ejemplo:

```text
[GET] /api/users - 200 - 23ms
[POST] /api/auth/login - 200 - 90ms
```

Esto permite saber qué peticiones llegan, qué código devuelven y cuánto tardan en responder.

---

## 15. Pruebas realizadas

Las pruebas principales se hicieron con Postman y Swagger.

Flujos comprobados:

- Registro de usuario.
- Login de usuario.
- Obtención del token JWT.
- Creación de servidor usando el Bearer Token.
- Bloqueo de rutas protegidas sin token.
- Creación de canal dentro de un servidor.
- Creación de mensaje dentro de un canal.
- Asignación automática del propietario del servidor desde el token.
- Asignación automática del autor del mensaje desde el token.
- Validaciones con DTOs.
- Swagger funcionando en `/api/docs`.
- Docker levantando app y base de datos.
- Middleware de logs registrando peticiones.

---

## 16. Scripts disponibles

```powershell
pnpm run start
```

Arranca la aplicación.

```powershell
pnpm run start:dev
```

Modo desarrollo con recarga automática.

```powershell
pnpm run build
```

Compila el proyecto.

```powershell
pnpm run start:prod
```

Ejecuta la versión compilada.

```powershell
pnpm run format
```

Formatea los archivos TypeScript.

```powershell
pnpm run lint
```

Ejecuta ESLint.

---

## 17. Decisiones técnicas

### TypeORM en lugar de Prisma

Se eligió TypeORM por disponer de información facilitada por el tutor y permite trabajar con entidades, decoradores, repositorios y relaciones de forma natural dentro de NestJS.

### pnpm como gestor de paquetes

El proyecto se desarrolló con `pnpm` por decisión del entorno de trabajo. Para mantener consistencia, el Dockerfile también usa `pnpm`.

### Sin sistema avanzado de roles

El sistema solo diferencia entre usuarios autenticados y no autenticados.

---

## 18. Estado final

El proyecto cumple con todos los requisitos obligatorios:

- Arquitectura REST completa.
- Persistencia con ORM.
- Seguridad y autenticación con JWT y Guards.
- Validación con DTOs y Pipes.
- Contenerización con Docker.

También incluye funcionalidades opcionales:

- Documentación Swagger.
- Middleware de logs.
```