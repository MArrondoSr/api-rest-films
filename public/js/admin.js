const newFilmButton = document.getElementById('newFilmButton');
const filmModal = document.getElementById('filmModal');
const closeModalButton = document.getElementById('closeModalButton');
const cancelButton = document.getElementById('cancelButton');
const modalBackdrop = document.getElementById('modalBackdrop');
const filmForm = document.getElementById('filmForm');
const filmFormTitle = document.getElementById('filmFormTitle');
const filmsList = document.getElementById('filmsList');
let editingFilmId = null;
const logoutButton = document.getElementById('logoutButton');
const searchType = document.getElementById('searchType');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const clearSearchButton = document.getElementById('clearSearchButton');
const currentUser = Auth.requireAdmin();
const usersList = document.getElementById('usersList');

if (!currentUser) {
    throw new Error('Acceso restringido a administradores');
}



function openModal() {
    editingFilmId = null;
    filmForm.reset();
    filmFormTitle.textContent = 'Nueva película';
    filmModal.hidden = false;
}

function closeModal() {
    filmModal.hidden = true;
}

async function loadFilms() {
    try {
        const response = await Auth.fetchWithAuth('/api/films');

        if (!response.ok) {
            throw new Error('No se pudieron obtener las películas');
        }

        const films = await response.json();
        
        filmsList.innerHTML = '';

        films.forEach(film => {
            filmsList.innerHTML += `
                <article class="admin-film">

                    <div class="admin-film__title">
                        ${film.title}
                    </div>

                    <div>
                        ${film.year || '-'}
                    </div>

                    <div>
                        ${film.director || '-'}
                    </div>

                    <div class="admin-film__actions">

                        <button
                            class="button button--edit"
                            type="button"
                            data-id="${film.id}"
                        >
                            Editar
                        </button>

                        <button
                            class="button button--delete"
                            type="button"
                            data-id="${film.id}"
                        >
                            Eliminar
                        </button>

                    </div>

                </article>
            `;
        });

    } catch (error) {
        console.error(error);

        filmsList.innerHTML = `
            <p style="padding:1rem;">
                No se pudo cargar el catálogo.
            </p>
        `;
    }
}

async function editFilm(id) {
    try {
        const response = await Auth.fetchWithAuth(`/api/films/${id}`);

        if (!response.ok) {
            throw new Error('No se pudo cargar la película');
        }

        const film = await response.json();

        editingFilmId = id;

        filmFormTitle.textContent = 'Editar película';

        document.getElementById('title').value = film.title || '';
        document.getElementById('director').value = film.director || '';
        document.getElementById('year').value = film.year || '';
        document.getElementById('duration').value = film.duration || '';
        document.getElementById('rating').value = film.rating ?? '';
        document.getElementById('genre').value = film.genre || '';
        document.getElementById('country').value = film.country || '';
        document.getElementById('image').value = film.image || '';
        document.getElementById('videoUrl').value = film.videoUrl || '';
        document.getElementById('synopsis').value = film.synopsis || '';

        filmModal.hidden = false;

    } catch (error) {
        console.error(error);
        alert('No se pudo cargar la película para editar.');
    }
}

async function deleteFilm(id) {
    const confirmed = confirm(
        '¿Seguro que querés eliminar esta película?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await Auth.fetchWithAuth(
            `/api/films/${id}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message || 'No se pudo eliminar la película'
            );
        }

        await loadFilms();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function searchFilms() {
    const type = searchType.value;
    const value = searchInput.value.trim();

    if (!value) {
        await loadFilms();
        return;
    }

    try {
        const params = new URLSearchParams({
            [type]: value
        });

        const response = await Auth.fetchWithAuth(
            `/api/films/buscar?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error('No se pudo realizar la búsqueda');
        }

        const films = await response.json();

        filmsList.innerHTML = '';

        if (films.length === 0) {
            filmsList.innerHTML = `
                <p style="padding:1rem;">
                    No se encontraron películas.
                </p>
            `;
            return;
        }

        films.forEach(film => {
            filmsList.innerHTML += `
                <article class="admin-film">

                    <div class="admin-film__title">
                        ${film.title}
                    </div>

                    <div>
                        ${film.year || '-'}
                    </div>

                    <div>
                        ${film.director || '-'}
                    </div>

                    <div class="admin-film__actions">

                        <button
                            class="button button--edit"
                            type="button"
                            data-id="${film.id}"
                        >
                            Editar
                        </button>

                        <button
                            class="button button--delete"
                            type="button"
                            data-id="${film.id}"
                        >
                            Eliminar
                        </button>

                    </div>

                </article>
            `;
        });

    } catch (error) {
        console.error(error);

        filmsList.innerHTML = `
            <p style="padding:1rem;">
                Error al realizar la búsqueda.
            </p>
        `;
    }
}

async function loadUsers() {
    try {
        const response = await Auth.fetchWithAuth('/api/users');

        if (!response.ok) {
            throw new Error('No se pudieron obtener los usuarios');
        }

        const users = await response.json();

        const pendingUsers = users.filter(user =>
            user.approved === false
        );

        usersList.innerHTML = '';

if (users.length === 0) {
    usersList.innerHTML = `
        <p style="padding:1rem;">
            No hay usuarios registrados.
        </p>
    `;
    return;
}

users.forEach(user => {
    let statusText = '';
    let statusClass = '';

    if (user.approved === false) {
        statusText = 'Pendiente';
        statusClass = 'status-pending';
    } else if (user.active === true) {
        statusText = 'Activo';
        statusClass = 'status-active';
    } else {
        statusText = 'Inactivo';
        statusClass = 'status-inactive';
    }

    //---
    let actions = '';

if (user.approved === false) {

    actions = `
        <button
            class="button button--primary approve-user-button"
            type="button"
            data-id="${user.id}"
        >
            Autorizar
        </button>
    `;

} else {

    if (user.active === true) {
        actions += `
            <button
                class="button button--secondary deactivate-user-button"
                type="button"
                data-id="${user.id}"
            >
                Desactivar
            </button>
        `;
    } else {
        actions += `
            <button
                class="button button--primary activate-user-button"
                type="button"
                data-id="${user.id}"
            >
                Reactivar
            </button>
        `;
    }

    if (user.role === 'viewer') {
        actions += `
            <button
                class="button button--secondary change-role-button"
                type="button"
                data-id="${user.id}"
                data-role="admin"
            >
                Hacer admin
            </button>
        `;
    } else {
        actions += `
            <button
                class="button button--secondary change-role-button"
                type="button"
                data-id="${user.id}"
                data-role="viewer"
            >
                Hacer viewer
            </button>
        `;
    }
        actions += `
        <button
            class="button button--delete delete-user-button"
            type="button"
            data-id="${user.id}"
        >
            Eliminar
        </button>
    `;
}

    //---
    usersList.innerHTML += `
        <article class="admin-user">

            <div>
                ${user.name || '-'}
            </div>

            <div>
                ${user.email || '-'}
            </div>

            <div>
                ${user.role || 'viewer'}
            </div>

            <div class="${statusClass}">
                ${statusText}
            </div>

            <div class="admin-user__actions">
                ${actions}
            </div>

        </article>
    `;
});

    } catch (error) {
        console.error(error);

        usersList.innerHTML = `
            <p style="padding:1rem;">
                No se pudieron cargar los usuarios.
            </p>
        `;
    }
}

newFilmButton.addEventListener('click', openModal);

closeModalButton.addEventListener('click', closeModal);

cancelButton.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', closeModal);

logoutButton.addEventListener('click', () => {
    Auth.logout();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !filmModal.hidden) {
        closeModal();
    }
});

searchButton.addEventListener('click', searchFilms);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchFilms();
    }
});

clearSearchButton.addEventListener('click', async () => {
    searchInput.value = '';
    searchType.value = 'title';

    await loadFilms();

    searchInput.focus();
});

usersList.addEventListener('click', async (event) => {
    const approveButton =
        event.target.closest('.approve-user-button');

    const deactivateButton =
        event.target.closest('.deactivate-user-button');

    const activateButton =
        event.target.closest('.activate-user-button');

    const roleButton =
        event.target.closest('.change-role-button');

    const deleteUserButton =
    event.target.closest('.delete-user-button');

    try {
        let response;

        if (approveButton) {
            response = await Auth.fetchWithAuth(
                `/api/users/${approveButton.dataset.id}/approve`,
                {
                    method: 'PUT'
                }
            );
        }

        else if (deactivateButton) {
            const confirmed = confirm(
                '¿Seguro que querés desactivar este usuario?'
            );

            if (!confirmed) {
                return;
            }

            response = await Auth.fetchWithAuth(
                `/api/users/${deactivateButton.dataset.id}/deactivate`,
                {
                    method: 'PUT'
                }
            );
        }

        else if (activateButton) {
            response = await Auth.fetchWithAuth(
                `/api/users/${activateButton.dataset.id}/activate`,
                {
                    method: 'PUT'
                }
            );
        }

        else if (roleButton) {
            const newRole = roleButton.dataset.role;

            const confirmed = confirm(
                `¿Seguro que querés cambiar este usuario a ${newRole}?`
            );

            if (!confirmed) {
                return;
            }

            response = await Auth.fetchWithAuth(
                `/api/users/${roleButton.dataset.id}/role`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: newRole
                    })
                }
            );
        }

        else if (deleteUserButton) {
            const confirmed = confirm(
                '¿Seguro que querés eliminar definitivamente este usuario?'
            );

            if (!confirmed) {
                return;
            }

            response = await Auth.fetchWithAuth(
                `/api/users/${deleteUserButton.dataset.id}`,
                {
                    method: 'DELETE'
                }
            );
        }

        else {
            return;
        }

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message ||
                'No se pudo modificar el usuario'
            );
        }

        await loadUsers();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

loadFilms();
loadUsers();

filmsList.addEventListener('click', (event) => {
    const editButton = event.target.closest('.button--edit');
    const deleteButton = event.target.closest('.button--delete');

    if (editButton) {
        editFilm(editButton.dataset.id);
        return;
    }

    if (deleteButton) {
        deleteFilm(deleteButton.dataset.id);
    }
});

filmForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const filmData = {
        title: document.getElementById('title').value.trim(),
        director: document.getElementById('director').value.trim(),
        year: Number(document.getElementById('year').value) || null,
        duration: Number(document.getElementById('duration').value) || null,
        rating: Number(document.getElementById('rating').value) || null,
        genre: document.getElementById('genre').value.trim(),
        country: document.getElementById('country').value.trim(),
        image: document.getElementById('image').value.trim(),
        videoUrl: document.getElementById('videoUrl').value.trim(),
        synopsis: document.getElementById('synopsis').value.trim()
    };

    try {
        let response;

        if (editingFilmId) {
            response = await Auth.fetchWithAuth(
                `/api/films/${editingFilmId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(filmData)
                }
            );
        } else {
            response = await Auth.fetchWithAuth(
                '/api/films',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(filmData)
                }
            );
        }

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message || 'No se pudo guardar la película'
            );
        }

        closeModal();

        await loadFilms();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});