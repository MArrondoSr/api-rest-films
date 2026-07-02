import {
    getAllFilmsService,
    getFilmByIdService,
    createFilmService,
    searchFilmsService
} from '../services/films.service.js';

export const getAllFilms = async (req, res) => {
    try {
        const films = await getAllFilmsService();
        res.status(200).json(films);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las películas"
        });
    }
};

export const getFilmById = async (req, res) => {
    try {
        const id = req.params.id;

        const film = await getFilmByIdService(id);

        if (!film) {
            return res.status(404).json({
                message: "Película no encontrada"
            });
        }

        res.status(200).json(film);
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar la película"
        });
    }
};

export const createFilm = async (req, res) => {
    try {
        const newFilm = await createFilmService(req.body);

        res.status(201).json(newFilm);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear la película"
        });
    }
};

export const searchFilms = async (req, res) => {
    try {
        const result = await searchFilmsService(req.query);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar películas"
        });
    }
};