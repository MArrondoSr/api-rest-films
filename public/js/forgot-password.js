const form =
    document.getElementById('forgot-password-form');

const message =
    document.getElementById('forgot-password-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    message.textContent = '';

    const email =
        document.getElementById('email').value.trim();

    try {
        const response = await fetch('/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        });

        const data = await response.json();

        message.style.color = '#7CFC98';
        message.innerHTML = `
            ${data.message}.<br><br>
            <small>
                Si no encontrás el correo en tu bandeja de entrada,
                revisá también la carpeta de spam o correo no deseado.
            </small>
`;

    } catch (error) {
        console.error(error);

        message.style.color = '#ff9d9d';
        message.textContent =
            'No se pudo procesar la solicitud.';
    }
});