const express = require('express');
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas
router.put('/:userId', auth, userController.updateProfile);

// Rutas protegidas (solo admin)
router.get('/clients', auth, isAdmin, userController.getClients);
router.post('/', auth, isAdmin, userController.createClient);
router.delete('/:id', auth, isAdmin, userController.deleteClient);

module.exports = router;