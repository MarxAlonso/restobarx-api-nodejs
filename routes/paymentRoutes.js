const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
// const { protect, admin } = require('../middleware/authMiddleware'); // Descomentar si se requiere autenticación

router.post('/process_payment', paymentController.processPayment);
router.get('/', paymentController.getPayments); // Ruta para admin ver pagos

module.exports = router;
