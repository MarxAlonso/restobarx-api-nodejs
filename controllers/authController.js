const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  // Login de usuario
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validar datos
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email y contraseña son requeridos' 
        });
      }
      
      // Buscar usuario por email
      const user = await userModel.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales incorrectas' 
        });
      }
      
      // Verificar si el usuario está activo
      if (!user.is_active) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuario desactivado. Contacte al administrador' 
        });
      }
      
      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales incorrectas' 
        });
      }
      
      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Respuesta exitosa
      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Registro de usuario
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      
      // Validar datos
      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nombre, email y contraseña son requeridos' 
        });
      }
      
      // Verificar si el email ya está registrado
      const existingUser = await userModel.findByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'El email ya está registrado' 
        });
      }
      
      // Crear nuevo usuario
      const userData = { name, email, password, role: role || 'CLIENT' };
      const newUser = await userModel.create(userData);
      
      // Generar token JWT
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Respuesta exitosa
      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Verificar token
  async verifyToken(req, res) {
    try {
      // El middleware auth.js ya verificó el token
      // Solo necesitamos devolver los datos del usuario
      const user = await userModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Error en verificación de token:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }
};

module.exports = authController;