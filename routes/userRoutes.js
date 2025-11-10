/**
 * @file userRoutes.js
 * @description Rutas relacionadas con la gestión de usuarios y clientes en la API.
 * Incluye rutas protegidas y rutas exclusivas para administradores.
 */

const express = require('express');
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route PUT /:userId
 * @description Actualiza el perfil de un usuario autenticado.
 * @access Protegido (solo usuarios autenticados)
 * @middleware auth - Verifica que el usuario tenga un token válido.
 * @param {string} req.params.userId - ID del usuario a actualizar.
 * @returns {Object} 200 - Usuario actualizado correctamente.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 404 - Usuario no encontrado.
 */
router.put('/:userId', auth, userController.updateProfile);

/**
 * @route GET /clients
 * @description Obtiene la lista de clientes registrados.
 * @access Protegido (solo administradores)
 * @middleware auth - Verifica que el usuario esté autenticado.
 * @middleware isAdmin - Verifica que el usuario tenga rol de administrador.
 * @returns {Object[]} 200 - Lista de clientes.
 * @returns {Error} 401 - No autorizado.
 * @returns {Error} 403 - Acceso denegado.
 */
router.get('/clients', auth, isAdmin, userController.getClients);

/**
 * @route POST /
 * @description Crea un nuevo cliente en el sistema.
 * @access Protegido (solo administradores)
 * @middleware auth - Verifica autenticación.
 * @middleware isAdmin - Verifica permisos de administrador.
 * @body {string} nombre - Nombre del cliente.
 * @body {string} correo - Correo electrónico del cliente.
 * @body {string} contrasena - Contraseña del cliente.
 * @returns {Object} 201 - Cliente creado exitosamente.
 * @returns {Error} 400 - Datos inválidos.
 */
router.post('/', auth, isAdmin, userController.createClient);

/**
 * @route DELETE /:id
 * @description Elimina un cliente según su ID.
 * @access Protegido (solo administradores)
 * @middleware auth - Requiere autenticación.
 * @middleware isAdmin - Requiere permisos de administrador.
 * @param {string} req.params.id - ID del cliente a eliminar.
 * @returns {Object} 200 - Mensaje de éxito.
 * @returns {Error} 404 - Cliente no encontrado.
 */
router.delete('/:id', auth, isAdmin, userController.deleteClient);

module.exports = router;
