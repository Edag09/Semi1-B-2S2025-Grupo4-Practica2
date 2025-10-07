const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyJWT } = require('../middlewares/authJwt');

/**
 * @route   POST /auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', verifyJWT, authController.getProfile);

/**
 * @route   PUT /auth/profile
 * @desc    Actualizar perfil del usuario autenticado
 * @access  Private
 */
router.put('/profile', verifyJWT, authController.updateProfile);

/**
 * @route   PUT /auth/change-password
 * @desc    Cambiar contraseña
 * @access  Private
 */
router.put('/change-password', verifyJWT, authController.changePassword);

module.exports = router;
