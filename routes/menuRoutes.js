const express = require('express');
const menuController = require('../controllers/menuController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', menuController.getAll);
router.get('/featured', menuController.getFeatured);

// Rutas protegidas (solo admin)
router.post('/', auth, isAdmin, menuController.create);
router.put('/:id', auth, isAdmin, menuController.update);
router.delete('/:id', auth, isAdmin, menuController.delete);

module.exports = router;