import * as filmsModel from '../models/films.model.js';

export const getAllFilmsService = async () => {
    return await filmsModel.getAllFilms();
};

export const getFilmByIdService = async (id) => {
    return await filmsModel.getFilmById(id);
};

export const createFilmService = async (filmData) => {
    return await filmsModel.saveFilm(filmData);
};

export const deleteFilmService = async (id) => {
    return await filmsModel.deleteFilm(id);
};

export const searchFilmsService = async ({ title, year, director }) => {
    let films = await filmsModel.getAllFilms();

    if (title) {
        films = films.filter(film =>
            film.title.toLowerCase().includes(title.toLowerCase())
        );
    }

    if (year) {
        films = films.filter(film =>
            film.year === parseInt(year)
        );
    }

    if (director) {
        films = films.filter(film =>
            film.director.toLowerCase().includes(director.toLowerCase())
        );
    }

    return films;
};