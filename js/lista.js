// VARIABLES

// Obtener el nombre de la lista de la URL
const urlParams = new URLSearchParams(window.location.search);
const listNameEncoded = urlParams.get('list');
const apiBase = 'https://api.nytimes.com/svc/books/v3/lists/current/';
const apiKey = 'k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA';
const apiURL = `${apiBase}${listNameEncoded}.json?api-key=${apiKey}`;

// EVENTOS

document.getElementById('botonAtras').addEventListener('click', () => {
    history.back();
});

// FUNCIONES

const fetchBooks = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw console.log('Error al obtener los libros');
        const data = await response.json();
        return data.results.books;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const createBookElement = (book) => {
    const libroContainer = document.createElement('article');
    const imgLibro = document.createElement('img');
    const semanasEnLista = document.createElement('p');
    const descripcionLibro = document.createElement('p');
    const tituloLibro = document.createElement('h3');
    const posicionLista = document.createElement('p');
    const enlace = document.createElement('a');
    const linkAmazon = document.createElement('button');

    imgLibro.src = book.book_image;
    semanasEnLista.innerText = `WEEKS ON THE LIST: ${book.weeks_on_list}`;
    tituloLibro.innerText = book.title;
    descripcionLibro.innerText = book.description;
    posicionLista.innerHTML = `#${book.rank}`;
    linkAmazon.innerText = 'BUY IT FROM AMAZON';
    enlace.href = book.amazon_product_url;
    enlace.target = "_blank";
    descripcionLibro.classList.add('descripcion');

    enlace.appendChild(linkAmazon);
    libroContainer.append(posicionLista, tituloLibro, imgLibro, semanasEnLista, descripcionLibro, enlace);

    return libroContainer;
};

const renderBooks = (books) => {
    const contenedorLibros = document.querySelector("#contenedorLibros");
    contenedorLibros.innerHTML = ''; 
    books.forEach(book => {
        const bookElement = createBookElement(book);
        contenedorLibros.appendChild(bookElement);
    });
};

const init = async () => {
    const books = await fetchBooks(apiURL);
    renderBooks(books);
};

init();
