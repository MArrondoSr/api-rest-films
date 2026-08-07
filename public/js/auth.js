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

function decodeToken() {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const payload = token.split('.')[1];

        const normalizedPayload = payload
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const decodedPayload = decodeURIComponent(
            atob(normalizedPayload)
                .split('')
                .map(char =>
                    '%' +
                    ('00' + char.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );

        return JSON.parse(decodedPayload);

    } catch (error) {
        console.error('No se pudo decodificar el token:', error);
        return null;
    }
}

function getCurrentUser() {
    return decodeToken();
}

function requireAdmin() {
    const token = requireAuthentication();

    if (!token) {
        return null;
    }

    const user = getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.location.href = '/';
        return null;
    }

    return user;
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

    if (response.status === 401) {
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
    decodeToken,
    getCurrentUser,
    requireAdmin,
    fetchWithAuth
};