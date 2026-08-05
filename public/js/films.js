const gallery = document.getElementById('galeria');


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