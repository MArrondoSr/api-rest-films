import express from 'express';

import {
    getAllFilms,
    getFilmById,
    searchFilms,
    createFilm, 
    updateFilm,
    deleteFilm
} from '../controllers/films.controller.js';

import { requireAdmin } from '../middlewares/requireAdmin.js';

const router = express.Router();

router.get('/', getAllFilms);

router.get('/buscar', searchFilms);

router.get('/:id', getFilmById);

router.post('/', requireAdmin, createFilm);

router.post('/create', requireAdmin, createFilm);

router.put('/:id', requireAdmin, updateFilm);

router.delete('/:id', requireAdmin, deleteFilm);

export default router;

