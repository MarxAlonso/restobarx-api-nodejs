const menuModel = require('../models/menuModel');

const menuController = {
  // Obtener todos los ítems del menú
  async getAll(req, res) {
    try {
      const menuItems = await menuModel.getAll();
      
      res.status(200).json({
        success: true,
        data: menuItems
      });
    } catch (error) {
      console.error('Error al obtener menú:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Obtener ítems destacados
  async getFeatured(req, res) {
    try {
      const featuredItems = await menuModel.getFeatured();
      /*res.status(200).json(menuItems); */
      res.status(200).json({
        success: true,
        data: featuredItems
      });
    } catch (error) {
      console.error('Error al obtener ítems destacados:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Crear un nuevo ítem de menú
  async create(req, res) {
    try {
      const { title, description, price, category, imageUrl, isAvailable } = req.body;
      
      // Validar datos
      if (!title || !description || !price || !category) {
        return res.status(400).json({ 
          success: false, 
          message: 'Título, descripción, precio y categoría son requeridos' 
        });
      }
      
      const menuData = { title, description, price, category, imageUrl, isAvailable };
      const newMenuItem = await menuModel.create(menuData);
      
      res.status(201).json({
        success: true,
        data: newMenuItem
      });
    } catch (error) {
      console.error('Error al crear ítem de menú:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Actualizar un ítem de menú
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, price, category, imageUrl, isAvailable } = req.body;
      
      const menuData = { title, description, price, category, imageUrl, isAvailable };
      const updatedMenuItem = await menuModel.update(id, menuData);
      
      if (!updatedMenuItem) {
        return res.status(404).json({ 
          success: false, 
          message: 'Ítem de menú no encontrado' 
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedMenuItem
      });
    } catch (error) {
      console.error('Error al actualizar ítem de menú:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  },
  
  // Eliminar un ítem de menú
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      await menuModel.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Ítem de menú eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar ítem de menú:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }
};

module.exports = menuController;