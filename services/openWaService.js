const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { LocalAuth } = require('whatsapp-web.js'); // Para manejar las sesiones de forma persistente

class OpenWaService {
  constructor() {
    // Aquí almacenaremos las sesiones activas, usando el sessionId como clave
    this.clients = new Map();
  }

  // Inicia una sesión con WhatsApp usando LocalAuth
  async startSession(sessionId) {
    if (!this.clients.has(sessionId)) {
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: sessionId }),
        puppeteer: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      });

      // Evento para mostrar el QR cuando se genere
      client.on('qr', (qr) => {
        console.log(`QR generado para la sesión ${sessionId}`);
        qrcode.generate(qr, { small: true }); // Muestra el QR en la consola
      });

      // Evento cuando el cliente esté listo (sesión autenticada)
      client.on('ready', () => {
        console.log(`Cliente ${sessionId} listo`);
      });

      // Almacenamos la sesión activa
      this.clients.set(sessionId, client);

      // Inicializamos la sesión
      await client.initialize();
    }

    return { status: 'started', sessionId };
  }

  // Obtener el cliente basado en el sessionId
  getClient(sessionId) {
    return this.clients.get(sessionId);
  }

  // Enviar un mensaje usando la sesión activa
  async sendMessage(sessionId, number, message, media = null) {
    const client = this.getClient(sessionId);
    if (!client) throw new Error('Sesión no iniciada');

    if (media) {
      await client.sendMessage(`${number}@c.us`, media, { caption: message || null });
    } else {
      await client.sendMessage(`${number}@c.us`, message);
    }

    console.log(`Mensaje enviado a ${number} en sesión ${sessionId}`);
  }

  // Obtener el estado de la sesión (si está lista o no)
  getSessionStatus(sessionId) {
    const client = this.getClient(sessionId);
    if (client) {
      return client.info;
    }
    return null;
  }

  // Obtener el último QR almacenado para la sesión (si es necesario)
  getLastQr(sessionId) {
    const client = this.getClient(sessionId);
    if (client && client.qr) {
      return client.qr;
    }
    return null;
  }
}

module.exports = new OpenWaService();
