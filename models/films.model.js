import { adminDb } from '../data/admin.js';

const filmsCollection = adminDb.collection('films');

// Obtener todos los films
export async function getAllFilms() {
    const querySnapshot = await filmsCollection.get();

    const films = [];

    querySnapshot.forEach((doc) => {
        films.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return films;
}

// Obtener un film por ID
export async function getFilmById(id) {
    const filmDoc = await filmsCollection.doc(id).get();

    if (!filmDoc.exists) {
        return null;
    }

    return {
        id: filmDoc.id,
        ...filmDoc.data()
    };
}

// Guardar un nuevo film
export async function saveFilm(filmData) {
    const docRef = await filmsCollection.add(filmData);

    return {
        id: docRef.id,
        ...filmData
    };
}

// Eliminar un film por ID
export async function deleteFilm(id) {
    const filmRef = filmsCollection.doc(id);

    const filmDoc = await filmRef.get();

    if (!filmDoc.exists) {
        return false;
    }

    await filmRef.delete();

    return true;
}

export async function updateFilm(id, filmData) {
    const filmRef = filmsCollection.doc(id);
    const filmDoc = await filmRef.get();

    if (!filmDoc.exists) {
        return null;
    }

    await filmRef.update(filmData);

    const updatedDoc = await filmRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data()
    };
}