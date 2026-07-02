import express from 'express';

import {
    getAllFilms,
    getFilmById,
    searchFilms,
    createFilm, 
    deleteFilm
} from '../controllers/films.controller.js';

const router = express.Router();

router.get('/', getAllFilms);

router.get('/buscar', searchFilms);

router.get('/:id', getFilmById);

router.post('/', createFilm);

router.post('/create', createFilm);

router.delete('/:id', deleteFilm);

export default router;

