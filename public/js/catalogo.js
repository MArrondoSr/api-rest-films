const catalogGallery =
    document.getElementById('catalogGallery');

const catalogSearch =
    document.getElementById('catalogSearch');

const catalogCount =
    document.getElementById('catalogCount');

const currentUserContainer =
    document.getElementById('currentUser');

const logoutButton =
    document.getElementById('logoutButton');


// Exigimos usuario autenticado
Auth.requireAuthentication();

const currentUser = Auth.getCurrentUser();

if (currentUserContainer && currentUser) {
    currentUserContainer.textContent =
        `${currentUser.email} — ${currentUser.role}`;
}

logoutButton?.addEventListener('click', () => {
    Auth.logout();
});


let catalog = [];


function renderCatalog(films) {

    catalogGallery.innerHTML = '';

    catalogCount.textContent =
        `${films.length} películas`;

    if (films.length === 0) {

        catalogGallery.innerHTML = `
            <p class="catalogo__sin-resultados">
                No se encontraron películas.
            </p>
        `;

        return;
    }

    films.forEach(film => {

        const card = document.createElement('article');

        card.className = 'catalogo-card';

        card.innerHTML = `
    <img
        src="${film.image}"
        alt="Afiche de ${film.title}"
        loading="lazy"
    >

    <div class="catalogo-card__info">

        <h3>${film.title}</h3>

        <p>${film.year}</p>

        <button
            class="catalogo-card__request"
            type="button"
            data-title="${film.title}"
            data-year="${film.year}"
        >
            Solicitar
        </button>

    </div>
`;

        catalogGallery.appendChild(card);
    });
}


async function loadCatalog() {

    try {

        const response = await fetch(
            '/data/catalogo.json'
        );

        if (!response.ok) {
            throw new Error(
                'No se pudo cargar el catálogo'
            );
        }

        catalog = await response.json();

        renderCatalog(catalog);

    } catch (error) {

        console.error(
            'Error al cargar el catálogo:',
            error
        );

        catalogGallery.innerHTML = `
            <p class="catalogo__sin-resultados">
                ${error.message}
            </p>
        `;
    }
}


catalogSearch.addEventListener('input', () => {

    const search =
        catalogSearch.value
            .trim()
            .toLowerCase();

    const filteredFilms = catalog.filter(
        film =>
            film.title
                .toLowerCase()
                .includes(search)
    );

    renderCatalog(filteredFilms);
});

catalogGallery.addEventListener('click', async (event) => {

    const button = event.target.closest(
        '.catalogo-card__request'
    );

    if (!button) {
        return;
    }

    const title = button.dataset.title;
    const year = button.dataset.year;

    const message =
        `Solicitud de película: ${title} (${year})`;

    try {

        button.disabled = true;
        button.textContent = 'Enviando...';

        const response = await Auth.fetchWithAuth(
            '/api/messages',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        if (!response.ok) {

            const data = await response
                .json()
                .catch(() => ({}));

            throw new Error(
                data.message ||
                'No se pudo enviar la solicitud'
            );
        }

        button.textContent = '✓ Solicitud enviada';

    } catch (error) {

        console.error(
            'Error al solicitar la película:',
            error
        );

        button.disabled = false;
        button.textContent = 'Solicitar';

        alert(error.message);
    }
});

loadCatalog();