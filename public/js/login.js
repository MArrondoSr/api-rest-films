const form = document.getElementById('login-form');
const message = document.getElementById('login-message');
const submitButton = form.querySelector('button[type="submit"]');
const resendVerificationLink =
    document.getElementById('resendVerificationLink');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    message.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Ingresando...';

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const responseText = await response.text();

let data = {};

if (responseText) {
    try {
        data = JSON.parse(responseText);
    } catch {
        throw new Error(
            `El servidor respondió ${response.status}, pero no devolvió JSON válido`
        );
    }
}

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo iniciar sesión');
        }

        Auth.saveToken(data.token);

        window.location.href = '/';
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Ingresar';
    }
});

resendVerificationLink?.addEventListener('click', async (event) => {
    event.preventDefault();

    const email =
        document.getElementById('email').value.trim();

    const password =
        document.getElementById('password').value;

    const message =
        document.getElementById('login-message');

    if (!email || !password) {
        message.style.color = '#ff9d9d';
        message.textContent =
            'Ingresá email y contraseña para reenviar la verificación.';
        return;
    }

    try {
        const response = await fetch('/auth/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.style.color = '#ff9d9d';
            message.textContent = data.message;
            return;
        }

        message.style.color = '#7CFC98';
        message.innerHTML = `
            ${data.message}.<br><br>
            <small>
                Si no aparece en la bandeja de entrada,
                revisá también spam o correo no deseado.
            </small>
        `;

    } catch (error) {
        console.error(error);

        message.style.color = '#ff9d9d';
        message.textContent =
            'No se pudo reenviar el correo de verificación.';
    }
});