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
  },

  // Obtener órdenes recientes para notificaciones (polling)
  async getRecentOrders(req, res) {
    try {
      const minutes = parseInt(req.query.minutes) || 5;
      const orders = await orderModel.getRecentOrders(minutes);

      // Formatear como notificaciones
      const notifications = orders.map(order => ({
        id: `order-${order.id}-${new Date(order.created_at).getTime()}`,
        type: 'NEW_ORDER',
        orderId: order.id,
        userName: order.user_name || 'Cliente',
        userEmail: order.user_email || '',
        totalPrice: parseFloat(order.total_price),
        itemCount: order.items?.length || 0,
        timestamp: order.created_at,
        read: false
      }));

      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Error al obtener órdenes recientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = orderController;