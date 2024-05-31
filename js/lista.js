// Obtener el nombre de la lista de la URL
const urlParams = new URLSearchParams(window.location.search);
const listNameEncoded = urlParams.get('list');

const apiBase = 'https://api.nytimes.com/svc/books/v3/lists/current/';
const apiResto = '.json?api-key=k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA';
const apiURL = `${apiBase}${listNameEncoded}${apiResto}`;

const contenedorLibros = document.querySelector("#contenedorLibros");


//EVENTOS

document.getElementById('botonAtras').addEventListener('click', () => {
    history.back();
});

// Función para obtener y mostrar los libros de la lista
const getLibros = async () => {
    try {
        const respuesta = await fetch(apiURL);

        if (respuesta.ok) {
            const data = await respuesta.json();
            const libros = data.results.books;

            libros.forEach(libro => {
                const libroContainer = document.createElement('div');
                const tituloLibro = document.createElement('h3');
                const descripcionLibro = document.createElement('p');
                
                tituloLibro.innerText = libro.title;
                descripcionLibro.innerText = libro.description;

                libroContainer.append(tituloLibro, descripcionLibro);
                contenedorLibros.append(libroContainer);
            });
        } else {
            throw new Error('Error al obtener los libros');
        }
    } catch (error) {
        console.log(error);
    }
};

getLibros();
