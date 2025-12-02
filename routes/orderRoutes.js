const express = require('express');
const orderController = require('../controllers/orderController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas
router.post('/', auth, orderController.create);
router.get('/user', auth, orderController.getUserOrders);

// Rutas protegidas (solo admin)
router.get('/', auth, isAdmin, orderController.getAllOrders);
router.get('/recent', auth, isAdmin, orderController.getRecentOrders);
router.put('/:orderId/status', auth, isAdmin, orderController.updateOrderStatus);

module.exports = router;