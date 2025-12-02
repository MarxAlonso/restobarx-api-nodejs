const orderModel = require('../models/orderModel');
const notificationService = require('../services/notificationService');

const orderController = {
  // Crear una nueva orden
  async create(req, res) {
    try {
      const { items, totalPrice } = req.body;
      const userId = req.user.id;

      // Validar datos
      if (!items || !items.length || !totalPrice) {
        return res.status(400).json({
          success: false,
          message: 'Ítems y precio total son requeridos'
        });
      }

      const orderData = { userId, items, totalPrice };
      const result = await orderModel.create(orderData);

      // Enviar notificación en tiempo real a los administradores
      if (result && result.orderId) {
        notificationService.sendNewOrderNotification({
          id: result.orderId,
          userName: req.user.name,
          userEmail: req.user.email,
          totalPrice: totalPrice,
          items: items
        });
      }

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error al crear orden:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Obtener órdenes del usuario
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;

      const orders = await orderModel.getByUserId(userId);

      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Obtener todas las órdenes (admin)
  async getAllOrders(req, res) {
    try {
      const orders = await orderModel.getAll();

      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Error al obtener todas las órdenes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Actualizar estado de orden
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      // Validar datos
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Estado es requerido'
        });
      }

      // Validar estado
      const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido'
        });
      }

      const updatedOrder = await orderModel.updateStatus(orderId, status);

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = orderController;