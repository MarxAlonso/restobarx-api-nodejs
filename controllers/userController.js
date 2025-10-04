const userModel = require('../models/userModel');

const userController = {
  // Actualizar perfil de usuario
  async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      const { name, email, phone, isActive } = req.body;

      // Si no es el mismo usuario ni admin → denegar
      if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permisos para actualizar este perfil' 
        });
      }

      let userData = {};

      if (req.user.role === 'ADMIN') {
        // 🔑 Admin puede tocar todo
        userData = { name, email, phone, isActive };
      } else {
        // 🔑 Cliente solo puede tocar name y phone
        userData = { name, phone };
      }

      const updatedUser = await userModel.update(userId, userData);

      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }

      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Obtener todos los clientes (admin)
  async getClients(req, res) {
    try {
        const clients = await userModel.getClients();
        res.status(200).json(clients); 
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
        });
    }
    },

  
  // Crear un nuevo cliente (admin)
  async createClient(req, res) {
    try {
      const { name, email, password, phone } = req.body;
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
      const userData = { name, email, password, role: 'CLIENT', phone };
      const newUser = await userModel.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Eliminar un cliente (admin)
  async deleteClient(req, res) {
    try {
      const { id } = req.params;
      
      await userModel.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Cliente eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }
};

module.exports = userController;