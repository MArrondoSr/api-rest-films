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
                style="width:100%;max-height:520px;object-fit:contain;background:#050505;border-radius:8px;"
            >

            <h1>${film.title}</h1>

            <p><strong>Director:</strong> ${film.director}</p>

            <p><strong>Año:</strong> ${film.year}</p>

            <p><strong>Género:</strong> ${film.genre || '-'}</p>

            <p>
                <strong>Duración:</strong>
                ${film.duration ? `${film.duration} min` : '-'}
            </p>

            <p><strong>País:</strong> ${film.country || '-'}</p>

            <p><strong>Puntuación:</strong> ${film.rating ?? '-'}</p>

            <h3>Sinopsis</h3>

            <p>${film.synopsis || 'Sin información.'}</p>

            <hr>

            <button id="playButton" type="button">
                ▶ Reproducir
            </button>

            <br><br>

            <a href="/">← Volver a la cartelera</a>
        `;

        document.title = `${film.title} | API REST Films`;

    } catch (error) {
        console.error('Error al cargar la película:', error);

        filmContainer.innerHTML = `
            <p>${error.message}</p>
            <a href="/">Volver a la cartelera</a>
        `;
    }
}

loadFilm();