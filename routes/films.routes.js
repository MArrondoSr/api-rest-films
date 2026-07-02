import express from 'express';

import {
    getAllFilms,
    getFilmById,
    searchFilms,
    createFilm
} from '../controllers/films.controller.js';

const router = express.Router();

router.get('/', getAllFilms);

router.get('/buscar', searchFilms);

router.get('/:id', getFilmById);

router.post('/', createFilm);

export default router;

