const form = document.getElementById('login-form');
const message = document.getElementById('login-message');
const submitButton = form.querySelector('button[type="submit"]');

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

        localStorage.setItem('token', data.token);

        window.location.href = '/';
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Ingresar';
    }
});