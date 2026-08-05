const TOKEN_KEY = 'token';

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token) {
    if (!token) {
        throw new Error('No se recibió un token válido');
    }

    localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function logout() {
    removeToken();
    window.location.href = '/login.html';
}

function requireAuthentication() {
    const token = getToken();

    if (!token) {
        window.location.href = '/login.html';
        return null;
    }

    return token;
}

async function fetchWithAuth(url, options = {}) {
    const token = requireAuthentication();

    if (!token) {
        throw new Error('Usuario no autenticado');
    }

    const headers = new Headers(options.headers || {});

    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        removeToken();
        window.location.href = '/login.html';

        throw new Error('La sesión venció o no es válida');
    }

    return response;
}

window.Auth = {
    getToken,
    saveToken,
    removeToken,
    logout,
    requireAuthentication,
    fetchWithAuth
};