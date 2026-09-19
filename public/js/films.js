const gallery = document.getElementById('galeria');

const adminAccess = document.getElementById('adminAccess');
const currentUserContainer = document.getElementById('currentUser');
const logoutButton = document.getElementById('logoutButton');
const suggestionForm = document.getElementById('suggestionForm');
const suggestionMessage = document.getElementById('suggestionMessage');
const suggestionStatus = document.getElementById('suggestionStatus');
console.log("Formulario:", suggestionForm);

const currentUser = Auth.getCurrentUser();

if (currentUserContainer && currentUser) {
    currentUserContainer.textContent =
        `${currentUser.email} — ${currentUser.role}`;
}

if (adminAccess && currentUser?.role === 'admin') {
    adminAccess.innerHTML = `
        <a href="/admin.html" class="admin-link">
            Administración
        </a>
    `;
}

logoutButton?.addEventListener('click', () => {
    Auth.logout();
});

suggestionForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = suggestionMessage.value.trim();

    if (!message) {
        return;
    }

    try {
        const response = await Auth.fetchWithAuth('/api/messages', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));

            throw new Error(
                data.message || 'No se pudo enviar el mensaje'
            );
        }

        suggestionStatus.textContent =
            'Mensaje enviado correctamente';

        suggestionMessage.value = '';

    } catch (error) {
        console.error('Error al enviar el mensaje:', error);

        suggestionStatus.textContent = error.message;
    }
});

async function loadFilms() {
    try {
        const response = await Auth.fetchWithAuth('/api/films');

        
        if (!response.ok) {
            throw new Error('No se pudieron obtener las películas');
        }

        const films = await response.json();

        gallery.innerHTML = '';

        films.forEach((film) => {
            const card = document.createElement('a');

            card.className = 'galeria__item';
            card.href = `/film.html?id=${film.id}`;

            card.innerHTML = `
                <img
                    src="${film.image}"
                    alt="${film.title}"
                >

                <h3>${film.title}</h3>

                <p>${film.year}</p>

                <p>${film.director}</p>
            `;

            gallery.appendChild(card);
        });
    } catch (error) {
        gallery.innerHTML = `
            <p class="gallery-error">
                ${error.message}
            </p>
        `;
    }
}

loadFilms();