const filmContainer = document.getElementById('film');

const params = new URLSearchParams(window.location.search);
const filmId = params.get('id');

async function loadFilm() {
    if (!filmId) {
        filmContainer.innerHTML = `
            <p>No se indicó ninguna película.</p>
            <a href="/">Volver a la cartelera</a>
        `;
        return;
    }

    try {
        const response = await Auth.fetchWithAuth(`/api/films/${filmId}`);

        if (response.status === 404) {
            filmContainer.innerHTML = `
                <p>Película no encontrada.</p>
                <a href="/">Volver a la cartelera</a>
            `;
            return;
        }

        if (!response.ok) {
            throw new Error('No se pudo obtener la película');
        }

        const film = await response.json();

        filmContainer.innerHTML = `
            <img
                src="${film.image}"
                alt="${film.title}"
                style="width: 100%; max-height: 520px; object-fit: contain; background: #050505; border-radius: 8px;"
            >

            <h1>${film.title}</h1>

            <p><strong>Año:</strong> ${film.year}</p>

            <p><strong>Director:</strong> ${film.director}</p>

            <a href="/">Volver a la cartelera</a>
        `;

        document.title = `${film.title} | API REST Films`;
    } catch (error) {
        filmContainer.innerHTML = `
            <p>${error.message}</p>
            <a href="/">Volver a la cartelera</a>
        `;
    }
}

loadFilm();