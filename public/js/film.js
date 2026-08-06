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
    <article class="film-detail" id="filmDetail">
        <div
            class="film-detail__poster"
            id="posterContainer"
            >
            <img
                src="${film.image}"
                alt="Afiche de ${film.title}"
            >
        </div>

        <div class="film-detail__content">
            <p class="film-detail__eyebrow">Ficha de la película</p>

            <h1 class="film-detail__title">${film.title}</h1>

            <div class="film-detail__metadata">
                <span>${film.year ?? 'Año no informado'}</span>
                <span>${film.duration ? `${film.duration} min` : 'Duración no informada'}</span>
                <span>${film.genre || 'Género no informado'}</span>
            </div>

            <dl class="film-detail__data">
                <div>
                    <dt>Director</dt>
                    <dd>${film.director || '-'}</dd>
                </div>

                <div>
                    <dt>País</dt>
                    <dd>${film.country || '-'}</dd>
                </div>

                <div>
                    <dt>Puntuación</dt>
                    <dd>${film.rating ?? '-'}</dd>
                </div>
            </dl>

            <section class="film-detail__synopsis">
                <h2>Sinopsis</h2>
                <p>${film.synopsis || 'Sin información disponible.'}</p>
            </section>

            <div class="film-detail__actions">
                <button
                    id="playButton"
                    class="film-detail__play"
                    type="button"
                    ${film.videoUrl || film.video ? '' : 'disabled'}
                >
                    ▶ Reproducir
                </button>

                <a class="film-detail__back" href="/">
                    ← Volver a la cartelera
                </a>
            </div>
           
        </div>
    </article>
`;

const playButton = document.getElementById('playButton');
const posterContainer = document.getElementById('posterContainer');
const filmDetail = document.getElementById('filmDetail');


const videoUrl = film.videoUrl || film.video;

if (playButton && posterContainer && videoUrl) {

    playButton.addEventListener('click', () => {
        filmDetail.classList.add('film-detail--playing');
        posterContainer.innerHTML = `
            <video
                controls
                autoplay
                style="
                    width:100%;
                    height:auto;
                    border-radius:10px;
                    background:#000;
                "
            >
                <source src="${videoUrl}" type="video/mp4">
            </video>
        `;

        playButton.textContent = "▶ Reproduciendo";
        playButton.disabled = true;
    });

}

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