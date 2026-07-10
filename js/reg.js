// Objeto que asocia cada planta con su mapa en Google Maps
const maps = {
    '99': '<iframe src="https://google.com" width="100%" height="250" style="border:0; border-radius:8px;" allowfullscreen="" loading="lazy"></iframe><div style="font-size:0.8rem; margin-top:10px;"><strong>Horarios:</strong><br>Lun a Vie: 08-16:45 hs. | Sáb: 08-12:45 hs.</div>',
    '10': '<iframe src="https://google.com" width="100%" height="250" style="border:0; border-radius:8px;" allowfullscreen="" loading="lazy"></iframe><div style="font-size:0.8rem; margin-top:10px;"><strong>Horarios:</strong><br>Lun a Vie: 08-16:45 hs. | Sáb: 08-12:45 hs.</div>',
    '11': '<iframe src="https://google.com" width="100%" height="250" style="border:0; border-radius:8px;" allowfullscreen="" loading="lazy"></iframe><div style="font-size:0.8rem; margin-top:10px;"><strong>Horarios:</strong><br>Lun a Vie: 08-16:45 hs. | Sáb: 08-12:45 hs.</div>',
};

// Función que muestra el mapa de acuerdo con la planta seleccionada
function updateMap() {
    const plantaSelect = document.getElementById('planta');
    const selectedPlanta = plantaSelect.value;
    const mapDiv = document.getElementById('map');
    
    if (maps[selectedPlanta]) {
        mapDiv.innerHTML = maps[selectedPlanta];
        mapDiv.style.opacity = "1";
    } else {
        mapDiv.innerHTML = '<div style="height:250px; display:flex; align-items:center; justify-content:center; background:#f1f5f9; color:#94a3b8; border-radius:8px; font-size:0.8rem; text-align:center; padding: 20px;">Seleccione una planta para ver ubicación y horarios</div>';
    }
}

// Generar número de orden aleatorio
function generateConfirmationNumber() {
    const date = new Date();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${random}${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate()}`;
}

// Validación de campos obligatorios
function validateForm() {
    const form = document.getElementById('appointmentForm');
    const inputs = form.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.required && (!input.value || input.value === "0" || input.value === "None" || input.value === "")) {
            isValid = false;
            input.style.borderColor = "#ef4444";
        } else {
            input.style.borderColor = "#cbd5e1";
        }
    });
    return isValid;
}

// Muestra el modal inyectando los datos correctos
function showModal(formData) {
    const vehicleTypeSelect = document.getElementById('vehicleType');
    const plantaSelect = document.getElementById('planta');
    
    // Formatear Fecha
    const fechaVal = formData.get('fecha');
    let fechaFormateada = fechaVal;
    if(fechaVal) {
        const parts = fechaVal.split('-');
        fechaFormateada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    
    document.getElementById('confirmationNumber').textContent = generateConfirmationNumber();
    document.getElementById('modalName').textContent = formData.get('nombre');
    
    // Extraer texto del vehículo
    const vOption = vehicleTypeSelect.options[vehicleTypeSelect.selectedIndex];
    const vText = vOption.text.split('(')[0].trim(); 
    const patente = formData.get('patente').toUpperCase();
    document.getElementById('modalVehiclePlate').textContent = `${vText} / ${patente}`;
    
    document.getElementById('modalStation').textContent = plantaSelect.options[plantaSelect.selectedIndex].text;
    document.getElementById('modalDateTime').textContent = `${fechaFormateada} - ${formData.get('hora')} hs`;
    
    // El precio se toma del VALUE del select directamente
    const precioRaw = vehicleTypeSelect.value;
    document.getElementById('modalPrice').textContent = `$${parseInt(precioRaw).toLocaleString('es-AR')}`;

    document.getElementById('confirmationModal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    const fechaInput = document.getElementById('fecha');

    // REGLA DE CALENDARIO
    if (fechaInput) {
        fechaInput.setAttribute('min', '2026-02-06');
        
        fechaInput.addEventListener('input', function() {
            const dateSelected = new Date(this.value + 'T00:00:00');
            const dayOfWeek = dateSelected.getUTCDay();

            if (dayOfWeek === 0) {
                alert("Las plantas de ITV no operan los domingos. Por favor, seleccione de lunes a sábado.");
                this.value = '';
            }
        });
    }
    
    // Escuchar cambio de planta
    const plantaEl = document.getElementById('planta');
    if(plantaEl) {
        plantaEl.addEventListener('change', updateMap);
        updateMap();
    }

    // Evento de envío del formulario (Aquí guardamos el correo de forma limpia)
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                // GUARDADO AUTOMÁTICO DEL EMAIL AL ENVIAR EL FORMULARIO
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    sessionStorage.setItem('correoGuardado', emailInput.value);
                }

                const data = new FormData(form);
                showModal(data);
            } else {
                alert("Por favor, complete todos los campos obligatorios.");
            }
        });
    }

    // Botones del modal
    const modBtn = document.getElementById('modalModifyBtn');
    const confBtn = document.getElementById('modalConfirmBtn');

    if(modBtn) {
        modBtn.addEventListener('click', () => {
            document.getElementById('confirmationModal').style.display = 'none';
        });
    }

    if(confBtn) {
        confBtn.addEventListener('click', () => {
            confBtn.textContent = "Cargando...";
            window.location.href = 'pago.html';
        });
    }
});
