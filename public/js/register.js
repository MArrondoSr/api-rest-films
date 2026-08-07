const form = document.getElementById('register-form');
const message = document.getElementById('register-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    message.textContent = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword =
        document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        message.textContent = 'Las contraseñas no coinciden.';
        return;
    }

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        message.style.color = '#7CFC98';
        message.textContent =
            'Cuenta creada correctamente. Redirigiendo...';

        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);

    } catch (error) {
        message.textContent = 'Error de conexión con el servidor.';
    }
});