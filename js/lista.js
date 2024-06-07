document.addEventListener('DOMContentLoaded', () => {

    // VARIABLES

    const urlParams = new URLSearchParams(window.location.search);
    const listNameEncoded = urlParams.get('list');
    const apiBase = 'https://api.nytimes.com/svc/books/v3/lists/current/';
    const apiKey = 'k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA';
    const apiURL = `${apiBase}${listNameEncoded}.json?api-key=${apiKey}`;
    const contenedorListas = document.querySelector("#contenedorLibros")
    const informacionPaginaDOM = document.querySelector("#informacion-pagina");
    const botonAtrasDOM = document.querySelector("#atras");
    const botonSiguienteDOM = document.querySelector("#siguiente")
    const botonSortAZ = document.getElementById('sortAZ');
    const botonSortZA = document.getElementById('sortZA');
    const elementosPorPagina = 5;
    let paginaActual = 1;
    let baseDeDatos = [];
    let listaCompleta = [];
    const textSearch = document.querySelector('#searchText')
    const searchButton = document.getElementById('searchButton');

    // EVENTOS

    document.getElementById('botonAtras').addEventListener('click', () => {
        history.back();
    });

    //para que al presionar intro se busque
    textSearch.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            const textoBusqueda = textSearch.value.trim(); // Obtener el texto de búsqueda
            const listasFiltradas = filtrarPorTitulo(listaCompleta, textoBusqueda); // Filtrar las listas por título
            baseDeDatos = listasFiltradas; // Actualizar la lista baseDeDatos con los resultados filtrados
            paginaActual = 1; // Reiniciar la página actual
            renderizar(); // Volver a renderizar la paginación
        }
    });

    // Búsqueda de texto
    searchButton.addEventListener('click', () => {
        const textoBusqueda = textSearch.value.trim();
        const librosFiltrados = filtrarPorTitulo(listaCompleta, textoBusqueda);
        baseDeDatos = librosFiltrados;
        paginaActual = 1;
        renderizar();
    });
    // Eventos de paginación
    botonAtrasDOM.addEventListener("click", retrocederPagina);
    botonSiguienteDOM.addEventListener("click", avanzarPagina);

    //Evento de filtro AZ ZA
    botonSortAZ.addEventListener('click', async () => {
        const listas = await fetchBooks(apiURL);
        baseDeDatos = ordenarAZ(listas); // Ordenar y guardar en baseDeDatos
        paginaActual = 1; // Resetear la página actual
        renderizar();
    });

    botonSortZA.addEventListener('click', async () => {
        const listas = await fetchBooks(apiURL);
        baseDeDatos = ordenarZA(listas); // Ordenar y guardar en baseDeDatos
        paginaActual = 1; // Resetear la página actual
        renderizar();
    });

    // FUNCIONES 

    const fetchBooks = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener los libros');
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
        try {
            const books = await fetchBooks(apiURL);
            baseDeDatos = books; // Guardamos los libros en la base de datos
            listaCompleta = books; // Guardamos los libros en la lista completa
            renderizar();
        } catch (error) {
            console.error(error);
        }
    };

    init();




    //FILTROS

    // Filtrar libros por título
    function filtrarPorTitulo(libros, textoBusqueda) {
        return libros.filter(libro => libro.title.toLowerCase().includes(textoBusqueda.toLowerCase()));
    }

    // Función para ordenar listas A-Z
    const ordenarAZ = (listas) => {
        return listas.sort((a, b) => a.title.localeCompare(b.title));
    };

    // Función para ordenar listas Z-A
    const ordenarZA = (listas) => {
        return listas.sort((a, b) => b.title.localeCompare(a.title));
    };





    // Funciones de paginación

    function avanzarPagina() {
        if (paginaActual < obtenerPaginasTotales()) {
            paginaActual++;
            renderizar();
        }
    }

    function retrocederPagina() {
        if (paginaActual > 1) {
            paginaActual--;
            renderizar();
        }
    }

    function obtenerRebanadaDeBaseDeDatos(pagina = 1) {
        const corteDeInicio = (pagina - 1) * elementosPorPagina;
        const corteDeFinal = corteDeInicio + elementosPorPagina;
        return baseDeDatos.slice(corteDeInicio, corteDeFinal);
    }

    function obtenerPaginasTotales() {
        return Math.ceil(baseDeDatos.length / elementosPorPagina);
    }

    function gestionarBotones() {
        botonAtrasDOM.disabled = paginaActual === 1;
        botonSiguienteDOM.disabled = paginaActual === obtenerPaginasTotales();
    }

    function renderizar() {
        const rebanadaDatos = obtenerRebanadaDeBaseDeDatos(paginaActual);
        renderBooks(rebanadaDatos);
        gestionarBotones();
        informacionPaginaDOM.textContent = `${paginaActual}/${obtenerPaginasTotales()}`;
    }


    // Iniciar con la página 1
    renderizar();



    /*
      Meter verificacion
      Meter favoritos
      */
});
