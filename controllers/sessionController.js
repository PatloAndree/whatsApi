const openWaService = require('../services/openWaService');
const path = require('path');
const fs = require('fs');

const { MessageMedia } = require('whatsapp-web.js');

exports.startSession = async (req, res) => {
  try {
    const { sessionId } = req.params;  // El sessionId viene de la URL
    console.log(`Iniciando sesión: ${sessionId}`);
    const result = await openWaService.startSession(sessionId);  // Llamamos a Node.js para iniciar la sesión
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;  // El sessionId viene de la URL
    const { number, message, media } = req.body;

    console.log(`Enviando mensaje a ${number} en sesión ${sessionId}`);
    if (media) {
      const { MessageMedia } = require('whatsapp-web.js');
      const mediaFile = MessageMedia.fromFilePath(media);  // Convertimos el archivo en un objeto de tipo MessageMedia
      await openWaService.sendMessage(sessionId, number, message, mediaFile);  // Enviar el mensaje con el archivo
    } else {
      await openWaService.sendMessage(sessionId, number, message);  // Enviar solo texto
    }
    res.json({ status: 'sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSessionStatus = (req, res) => {
  try {
    const { sessionId } = req.params;  // El sessionId viene de la URL
    const status = openWaService.getSessionStatus(sessionId);  // Obtener el estado de la sesión
    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQr = (req, res) => {
  try {
    const { sessionId } = req.params;
    const qr = openWaService.getLastQr(sessionId);  // Obtener el último QR generado
    if (qr) {
      res.json({ qr });
    } else {
      res.status(404).json({ error: 'QR no disponible' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
