const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments.controller');
const { verifyJWT } = require('../middlewares/authJwt');

// Todas las rutas requieren autenticación

// Crear comentario en una receta
router.post('/:recetaId', verifyJWT, commentsController.create);

// Obtener comentarios de una receta (pública, pero autenticada)
router.get('/receta/:recetaId', verifyJWT, commentsController.getByRecipe);

// Obtener mis comentarios
router.get('/mis-comentarios', verifyJWT, commentsController.getMyComments);

// Actualizar comentario
router.put('/:id', verifyJWT, commentsController.update);

// Eliminar comentario
router.delete('/:id', verifyJWT, commentsController.deleteById);

module.exports = router;
