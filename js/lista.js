//VARIABLES
// Obtener el nombre de la lista de la URL
const urlParams = new URLSearchParams(window.location.search);
const listNameEncoded = urlParams.get('list');

const apiBase = 'https://api.nytimes.com/svc/books/v3/lists/current/';
const apiResto = '.json?api-key=k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA';
const apiURL = `${apiBase}${listNameEncoded}${apiResto}`;


//EVENTOS

document.getElementById('botonAtras').addEventListener('click', () => {
    history.back();
});


//FUNCIONES
const getLibros = async () => {
    try {
        const respuesta = await fetch(apiURL);

        if (respuesta.ok) {
            const data = await respuesta.json();
            const libros = data.results.books;
            return libros
        } else {
            throw console.log('Error al obtener los libros');
        }
    } catch (error) {
        console.log("error");
    };
}

getLibros()
    .then((resp2) => {
        const contenedorLibros = document.querySelector("#contenedorLibros");
            resp2.forEach(libro => {
                const libroContainer = document.createElement('article');
                const imgLibro = document.createElement('img')
                const semanasEnLista = document.createElement('p')
                const descripcionLibro = document.createElement('p');
                const tituloLibro = document.createElement('h3');
                const posicionLista = document.createElement('p')
                const enlace = document.createElement('a')
                const linkAmazon = document.createElement('button')
                
                imgLibro.src = libro.book_image
                semanasEnLista.innerText = 'SEMANAS EN LISTA: ' + libro.weeks_on_list
                tituloLibro.innerText = libro.title;
                descripcionLibro.innerText = libro.description;
                posicionLista.innerHTML = '#' + libro.rank
                linkAmazon.innerText = 'CÓMPRALO EN AMAZON'
                enlace.href = libro.amazon_product_url
                enlace.target = "_blank"
                descripcionLibro.classList.add('descripcion');

                contenedorLibros.append(libroContainer);
                libroContainer.append(posicionLista, tituloLibro, imgLibro, semanasEnLista, descripcionLibro, enlace);
                enlace.append(linkAmazon)

            });

    })
    .catch((error) => {
        console.log(error);
    })