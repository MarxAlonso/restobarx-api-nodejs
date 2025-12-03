# RestoBarX API - Node.js Backend

API RESTful para el sistema de gestión de restaurantes y bares **RestoBarX**. Desarrollada con Node.js, Express y PostgreSQL, incluye autenticación JWT, notificaciones en tiempo real con Socket.IO e integración con Mercado Pago.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Socket.IO Events](#-socketio-events)
- [Despliegue](#-despliegue)
- [Scripts Disponibles](#-scripts-disponibles)

---

## ✨ Características

- **Autenticación y Autorización**: Sistema completo con JWT y roles (admin/cliente)
- **Gestión de Menú**: CRUD completo para productos del menú
- **Sistema de Pedidos**: Creación, seguimiento y actualización de órdenes
- **Notificaciones en Tiempo Real**: Implementado con Socket.IO para notificar nuevos pedidos a administradores
- **Integración de Pagos**: Procesamiento de pagos con Mercado Pago
- **Gestión de Usuarios**: Administración de clientes y perfiles
- **Almacenamiento de Imágenes**: Integración con Supabase Storage
- **Seguridad**: Encriptación de contraseñas con bcrypt, validación de tokens JWT

---

## 🛠 Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Node.js** | - | Runtime de JavaScript |
| **Express** | ^5.1.0 | Framework web |
| **PostgreSQL** | - | Base de datos relacional |
| **pg** | ^8.16.3 | Cliente PostgreSQL |
| **Socket.IO** | ^4.8.1 | Comunicación en tiempo real |
| **JWT** | ^9.0.2 | Autenticación basada en tokens |
| **bcrypt** | ^6.0.0 | Encriptación de contraseñas |
| **Mercado Pago SDK** | ^2.11.0 | Procesamiento de pagos |
| **Supabase** | ^2.58.0 | Storage y servicios backend |
| **dotenv** | ^17.2.3 | Gestión de variables de entorno |
| **CORS** | ^2.8.5 | Control de acceso entre orígenes |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v14 o superior)
- **npm** o **yarn**
- **PostgreSQL** (v12 o superior)
- Cuenta en **Supabase** (para almacenamiento de imágenes)
- Cuenta en **Mercado Pago** (para procesamiento de pagos)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd restobarx-api-nodejs
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

Ejecuta el script SQL para crear las tablas necesarias:

```bash
psql -U tu_usuario -d tu_base_de_datos -f payments_schema.sql
```

> **Nota**: Asegúrate de tener las tablas `users`, `menu_items`, `orders`, `order_items` y `payments` creadas en tu base de datos PostgreSQL.

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
# Servidor
PORT=8089

# Base de Datos PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_bd

# JWT Secret
JWT_SECRET=tu_clave_secreta_super_segura

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_supabase_anon_key

# Mercado Pago
MP_ACCESS_TOKEN=tu_mercado_pago_access_token

# Frontend URL (para CORS y Socket.IO)
FRONTEND_URL=http://localhost:5173
```

> [!IMPORTANT]
> **Nunca** subas el archivo `.env` al repositorio. Asegúrate de que esté incluido en `.gitignore`.

---

## 📁 Estructura del Proyecto

```
restobarx-api-nodejs/
├── config/
│   ├── db.js              # Configuración de PostgreSQL
│   └── supabase.js        # Cliente de Supabase
├── controllers/
│   ├── authController.js  # Lógica de autenticación
│   ├── menuController.js  # Gestión del menú
│   ├── orderController.js # Gestión de pedidos
│   ├── paymentController.js # Procesamiento de pagos
│   └── userController.js  # Gestión de usuarios
├── middleware/
│   ├── auth.js            # Middleware de autenticación y autorización
│   └── errorHandler.js    # Manejo centralizado de errores
├── models/
│   ├── menuModel.js       # Modelo de datos del menú
│   ├── orderModel.js      # Modelo de datos de pedidos
│   ├── paymentModel.js    # Modelo de datos de pagos
│   └── userModel.js       # Modelo de datos de usuarios
├── routes/
│   ├── authRoutes.js      # Rutas de autenticación
│   ├── menuRoutes.js      # Rutas del menú
│   ├── orderRoutes.js     # Rutas de pedidos
│   ├── paymentRoutes.js   # Rutas de pagos
│   └── userRoutes.js      # Rutas de usuarios
├── services/
│   └── notificationService.js # Servicio de notificaciones Socket.IO
├── .env.example           # Plantilla de variables de entorno
├── .gitignore
├── index.js               # Punto de entrada de la aplicación
├── package.json
├── payments_schema.sql    # Schema de la tabla de pagos
├── vercel.json            # Configuración para despliegue en Vercel
└── README.md
```

---

## 🔌 API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/login` | Iniciar sesión | ❌ |
| `POST` | `/register` | Registrar nuevo usuario | ❌ |
| `GET` | `/verify` | Verificar token JWT | ✅ |

#### Ejemplo: Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "contrasena": "miPassword123"
}
```

**Respuesta exitosa:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "usuario@ejemplo.com",
    "rol": "cliente"
  }
}
```

---

### Menú (`/api/menu`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| `GET` | `/` | Obtener todos los productos | ❌ | - |
| `GET` | `/featured` | Obtener productos destacados | ❌ | - |
| `POST` | `/` | Crear nuevo producto | ✅ | Admin |
| `PUT` | `/:id` | Actualizar producto | ✅ | Admin |
| `DELETE` | `/:id` | Eliminar producto | ✅ | Admin |

#### Ejemplo: Crear producto

```bash
POST /api/menu
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Pizza Margherita",
  "descripcion": "Pizza clásica con tomate y mozzarella",
  "precio": 12.99,
  "categoria": "Pizzas",
  "imagen_url": "https://...",
  "destacado": true
}
```

---

### Pedidos (`/api/orders`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| `POST` | `/` | Crear nuevo pedido | ✅ | Cliente |
| `GET` | `/user` | Obtener pedidos del usuario | ✅ | Cliente |
| `GET` | `/` | Obtener todos los pedidos | ✅ | Admin |
| `GET` | `/recent` | Obtener pedidos recientes | ✅ | Admin |
| `PUT` | `/:orderId/status` | Actualizar estado del pedido | ✅ | Admin |

#### Ejemplo: Crear pedido

```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menu_item_id": 1,
      "cantidad": 2,
      "precio_unitario": 12.99
    }
  ],
  "total": 25.98,
  "direccion_entrega": "Calle Falsa 123",
  "notas": "Sin cebolla, por favor"
}
```

---

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---------------|-----|
| `PUT` | `/:userId` | Actualizar perfil de usuario | ✅ | Cliente |
| `GET` | `/clients` | Obtener lista de clientes | ✅ | Admin |
| `POST` | `/` | Crear nuevo cliente | ✅ | Admin |
| `DELETE` | `/:id` | Eliminar cliente | ✅ | Admin |

---

### Pagos (`/api/payments`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/process_payment` | Procesar pago con Mercado Pago | ❌ |
| `GET` | `/` | Obtener historial de pagos | ✅ (Admin) |

#### Ejemplo: Procesar pago

```bash
POST /api/payments/process_payment
Content-Type: application/json

{
  "transaction_amount": 25.98,
  "description": "Pedido #123",
  "payment_method_id": "visa",
  "payer": {
    "email": "cliente@ejemplo.com"
  }
}
```

---

## 🔔 Socket.IO Events

### Conexión del Cliente

```javascript
const socket = io('http://localhost:8089');

socket.on('connect', () => {
  console.log('Conectado al servidor');
});
```

### Eventos Disponibles

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `join-admin` | Cliente → Servidor | Unirse al room de administradores |
| `new-order` | Servidor → Admins | Notificación de nuevo pedido |
| `order-status-updated` | Servidor → Cliente | Actualización del estado del pedido |

### Ejemplo: Unirse como Admin

```javascript
socket.emit('join-admin');
```

### Ejemplo: Escuchar nuevos pedidos (Admin)

```javascript
socket.on('new-order', (order) => {
  console.log('Nuevo pedido recibido:', order);
  // Mostrar notificación en la UI
});
```

---

## 🌐 Despliegue

### Despliegue en Vercel

Este proyecto está configurado para desplegarse en Vercel mediante el archivo `vercel.json`.

#### Pasos:

1. **Instalar Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Iniciar sesión**:
   ```bash
   vercel login
   ```

3. **Desplegar**:
   ```bash
   vercel --prod
   ```

4. **Configurar variables de entorno** en el dashboard de Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `MP_ACCESS_TOKEN`
   - `FRONTEND_URL`

> [!WARNING]
> Asegúrate de que tu base de datos PostgreSQL sea accesible desde Vercel. Se recomienda usar servicios como **Supabase**, **Neon**, o **Railway** para PostgreSQL en producción.

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Iniciar servidor** | `npm start` | Inicia el servidor en modo producción |
| **Modo desarrollo** | `npm run dev` | Inicia el servidor con nodemon (reinicio automático) |

### Desarrollo Local

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8089`

### Verificar Estado del Servidor

```bash
curl http://localhost:8089/api/health
```

**Respuesta esperada:**

```json
{
  "status": "ok",
  "message": "Servidor funcionando correctamente"
}
```

---

## 🔐 Seguridad

- **Contraseñas**: Encriptadas con bcrypt (10 rounds de salt)
- **JWT**: Tokens firmados con clave secreta, expiración configurable
- **CORS**: Configurado para permitir solo orígenes autorizados
- **SQL Injection**: Prevención mediante consultas parametrizadas con `pg`
- **Validación**: Validación de datos en controladores antes de procesamiento

> [!CAUTION]
> En producción, asegúrate de:
> - Usar HTTPS
> - Configurar `JWT_SECRET` con una clave fuerte y aleatoria
> - Limitar CORS solo a tu dominio frontend
> - Habilitar rate limiting para prevenir ataques de fuerza bruta

---

## 📝 Notas Adicionales

### Base de Datos

El proyecto utiliza PostgreSQL con el módulo `pg`. La configuración de conexión se encuentra en `config/db.js` y utiliza un pool de conexiones para mejor rendimiento.

### Almacenamiento de Imágenes

Las imágenes de productos se almacenan en Supabase Storage. Asegúrate de configurar correctamente los buckets y políticas de acceso en tu proyecto de Supabase.

### Notificaciones en Tiempo Real

Socket.IO está configurado para notificar a los administradores cuando se crea un nuevo pedido. Los administradores deben unirse al room `admins` mediante el evento `join-admin`.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso interno de RestoBarX.

---

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para RestoBarX**
