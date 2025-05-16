const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Ruta para iniciar sesión y obtener el QR
router.post('/start-session/:sessionId', sessionController.startSession);

// Ruta para enviar un mensaje
const upload = require('multer')({ dest: 'uploads/' });

router.post('/send-message/:sessionId', upload.single('media'), sessionController.sendMessage);

// Ruta para verificar el estado de la sesión
router.get('/status/:sessionId', sessionController.getSessionStatus);

module.exports = router;
