// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// //ruta al jason bd
// const dataPath = path.join(__dirname, '../data/films.json');

import { db } from '../data/data.js'; 
import { 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    deleteDoc, 
    doc 
} from 'firebase/firestore'; 

const filmsCollection = collection(db, 'films');

// Método para obtener todos los productos 
export async function getAllFilms() { 
    const querySnapshot = await getDocs(filmsCollection); 
    const films = []; 
    querySnapshot.forEach((doc) => { 
        films.push({ id: doc.id, ...doc.data() }); 
    }); 
    return films; 
};

// Buscar un film por ID
export async function getFilmById(id) {
    const filmRef = doc(filmsCollection, id);
    const filmDoc = await getDoc(filmRef);

    if (!filmDoc.exists()) {
        return null;
    }

    return {
        id: filmDoc.id,
        ...filmDoc.data()
    };
}

// Método para guardar un producto en Firestore
// Guardar un nuevo film
export async function saveFilm(filmData) {
    const docRef = await addDoc(filmsCollection, filmData);

    return {
        id: docRef.id,
        ...filmData
    };
}
// Método para eliminar un producto por su ID   
// Eliminar un film por ID
export async function deleteFilm(id) {
    const filmRef = doc(filmsCollection, id);

    await deleteDoc(filmRef);

    return true;
}