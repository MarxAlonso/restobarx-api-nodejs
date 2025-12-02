const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { errorHandler } = require('./middleware/errorHandler');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 8089;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Exportar io para usar en otros módulos
global.io = io;

// Socket.IO - Manejo de conexiones
io.on('connection', (socket) => {
  console.log('✅ Cliente conectado:', socket.id);

  // Unir al room de administradores si es admin
  socket.on('join-admin', () => {
    socket.join('admins');
    console.log('👨‍💼 Admin conectado:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Ruta de salud para verificar si el servidor está funcionando
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO listo para conexiones`);
});
//Comentario: Todo esto es el api, el backend con nodejs y express :D