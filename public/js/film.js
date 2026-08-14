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
                    ${film.videoKey || film.videoUrl || film.video ? '' : 'disabled'}
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


const fallbackVideoUrl = film.videoUrl || film.video;
async function getVideoUrl() {
    if (film.videoKey) {
        const response = await Auth.fetchWithAuth(
            `/api/films/${filmId}/video-url`
        );

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));

            throw new Error(
                data.message || 'No se pudo obtener el video'
            );
        }

        const data = await response.json();

        return data.videoUrl;
    }

    return fallbackVideoUrl;
}
const originalPosterHtml = posterContainer?.innerHTML || '';
let savedVideoTime = 0;

if (
    playButton &&
    posterContainer &&
    filmDetail &&
    (film.videoKey || fallbackVideoUrl)
) {
    playButton.addEventListener('click', async () => {

    playButton.disabled = true;
    playButton.textContent = 'Cargando...';

    try {
        const videoUrl = await getVideoUrl();

        filmDetail.classList.add('film-detail--playing');

        posterContainer.innerHTML = `
            <div class="film-player">
                <video
                    id="filmPlayer"
                    class="film-detail__player"
                    controls
                    autoplay
                >
                    <source src="${videoUrl}" type="video/mp4">
                    Tu navegador no puede reproducir este video.
                </video>

                <button
                    id="closePlayerButton"
                    class="film-player__close"
                    type="button"
                >
                    ← Volver
                </button>
            </div>
        `;

        const video = document.getElementById('filmPlayer');
        const closePlayerButton =
            document.getElementById('closePlayerButton');

        if (video && savedVideoTime > 0) {
            video.addEventListener(
                'loadedmetadata',
                () => {
                    video.currentTime = savedVideoTime;
                },
                { once: true }
            );
        }

        closePlayerButton?.addEventListener('click', () => {
            if (video) {
                savedVideoTime = video.currentTime;
                video.pause();
            }

            posterContainer.innerHTML = originalPosterHtml;
            filmDetail.classList.remove('film-detail--playing');

            playButton.textContent =
                savedVideoTime > 0
                    ? '▶ Continuar'
                    : '▶ Reproducir';

            playButton.disabled = false;
        });

        playButton.disabled = true;
        playButton.textContent = 'Reproduciendo';
            } catch (error) {
        console.error('Error al cargar el video:', error);

        alert(error.message);

        playButton.disabled = false;

        playButton.textContent =
            savedVideoTime > 0
                ? '▶ Continuar'
                : '▶ Reproducir';
    }
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