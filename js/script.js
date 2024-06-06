document.addEventListener('DOMContentLoaded', () => {

    //PINTAR LISTAS
    //VARIABLES
    //const apiListas = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA'

    const apiBase = 'https://api.nytimes.com/svc/books/v3/lists/current/'
    const apiResto = '.json?api-key=k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA'
    const loader = document.querySelector("#loader")
    const filtroUpdated = document.querySelector('#updated')
    const optionWeekly = document.createElement('option')
    const optionMonthly = document.createElement('option')
    optionMonthly.value = 'monthly'
    optionWeekly.value = 'weekly'
    optionMonthly.innerText = 'MONTHLY'
    optionWeekly.innerText = 'WEEKLY'
    filtroUpdated.append(optionWeekly, optionMonthly)
    const orderOldestSelect = document.getElementById('orderOldestSelect');
    const orderNewestSelect = document.getElementById('orderNewestSelect');
    const botonSortAZ = document.getElementById('sortAZ');
    const botonSortZA = document.getElementById('sortZA');
    const contenedorListas = document.querySelector("#contenedorListas")
    const informacionPaginaDOM = document.querySelector("#informacion-pagina");
    const botonAtrasDOM = document.querySelector("#atras");
    const botonSiguienteDOM = document.querySelector("#siguiente")
    const elementosPorPagina = 9;
    let paginaActual = 1;
    let baseDeDatos = [];

    //EVENTOS

    document.getElementById('botonFinal').addEventListener('click', () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });

    loader.addEventListener('click', () => {
        loader.remove()
    })

     // Reset filters a default
     const resetFilters = (filtro1, filtro2) => {
        filtro1.value = "default"
        filtro2.value = "default";
    };
    // Eventos de ordenación
     orderOldestSelect.addEventListener('change', async () => {
            const listas = await getListas();
            let listasOrdenadas;
            switch (orderOldestSelect.value) {
                case 'oldestAsc':
                    listasOrdenadas = ordenarPorFechaMasAntiguaAsc(listas);
                    break;
                case 'oldestDesc':
                    listasOrdenadas = ordenarPorFechaMasAntiguaDesc(listas);
                    break;
                default:
                    listasOrdenadas = listas;
            }
            baseDeDatos = listasOrdenadas; // Ordenar y guardar en baseDeDatos
            paginaActual = 1; // Resetear la página actual
            renderizar();
            resetFilters(filtroUpdated, orderNewestSelect)
    });

    orderNewestSelect.addEventListener('change', async () => {
        const listas = await getListas();
        let listasOrdenadas;
        switch (orderNewestSelect.value) {
            case 'newestAsc':
                listasOrdenadas = ordenarPorFechaMasNuevaAsc(listas);
                break;
            case 'newestDesc':
                listasOrdenadas = ordenarPorFechaMasNuevaDesc(listas);
                break;
            default:
                listasOrdenadas = listas;
        }
        baseDeDatos = listasOrdenadas; // Ordenar y guardar en baseDeDatos
        paginaActual = 1; // Resetear la página actual
        renderizar();
        resetFilters(filtroUpdated, orderOldestSelect)
    });

    //FUNCIONES

    //Almacenar y pintar las listas en un array
    const getListas = async () => {
        try {
            const respuesta = await fetch("../js/text.json");

            if (respuesta.ok) {
                const data = await respuesta.json();
                return data.results;
            } else {
                throw console.log('Error al obtener las listas');
            }
        } catch (error) {
            console.log(error);
        }
    };
    const pintarListas = (listas) => {
        contenedorListas.innerHTML = '';
        listas.forEach(element => {
            const elementoContainer = crearElementoLista(element);
            contenedorListas.append(elementoContainer);
        });
    };

    const crearElementoLista = (element) => {
        const elementoContainer = document.createElement('article');
        const tituloLista = document.createElement('h3');
        const fechaAntiguo = document.createElement('p');
        const fechaNuevo = document.createElement('p');
        const actualizacion = document.createElement('p');
        const linkLista = document.createElement('button');
        const favorito = document.createElement('button')

        elementoContainer.id = element.list_name;
        tituloLista.innerText = element.list_name;
        fechaAntiguo.innerText = 'OLDEST: ' + element.oldest_published_date;
        fechaNuevo.innerText = 'NEWEST: ' + element.newest_published_date;
        actualizacion.innerText = 'UPDATED: ' + element.updated;
        linkLista.innerText = 'VER MÁS ->';
        favorito.innerHTML = '<img src="../imgs/corazonVacio.png" width="15px" heigh="15px">'
        favorito.id = 'btnFavorito'

        favorito.addEventListener('click', () => {
            if (favorito.innerHTML === '<img src="../imgs/corazonVacio.png" width="15px" heigh="15px">') {
                favorito.innerHTML = ''
                favorito.innerHTML = '<img src="../imgs/corazonLleno.png" width="15px" heigh="15px">'
            } else if (favorito.innerHTML === '<img src="../imgs/corazonLleno.png" width="15px" heigh="15px">') {
                favorito.innerHTML = ''
                favorito.innerHTML = '<img src="../imgs/corazonVacio.png" width="15px" heigh="15px">'
            }
        })

        linkLista.addEventListener('click', () => {
            const url = `lista.html?list=${element.list_name_encoded}`;
            window.location.href = url;
        });

        elementoContainer.append(tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista, favorito);
        return elementoContainer;
    };






    //FILTROS AZ Y UPDATED 

    // Función para ordenar listas A-Z
    const ordenarAZ = (listas) => {
        return listas.sort((a, b) => a.list_name.localeCompare(b.list_name));
    };

    // Función para ordenar listas Z-A
    const ordenarZA = (listas) => {
        return listas.sort((a, b) => b.list_name.localeCompare(a.list_name));
    };

    // Eventos de ordenación
    botonSortAZ.addEventListener('click', async () => {
        resetFilters();
        const listas = await getListas();
        baseDeDatos = ordenarAZ(listas); // Ordenar y guardar en baseDeDatos
        paginaActual = 1; // Resetear la página actual
        renderizar();
    });

    botonSortZA.addEventListener('click', async () => {
        resetFilters();
        const listas = await getListas();
        baseDeDatos = ordenarZA(listas); // Ordenar y guardar en baseDeDatos
        paginaActual = 1; // Resetear la página actual
        renderizar();
    });

    // Inicializar listas al cargar la página
    getListas()
        .then(listas => {
            baseDeDatos = listas; // Guardar listas en baseDeDatos
            renderizar();
        })
        .catch(console.error);

    filtroUpdated.addEventListener('change', async (ev) => {
        resetFilters(orderOldestSelect, orderNewestSelect);
        filtroUpdated.value = ev.target.value;
        const listas = await getListas();
        let listasFiltradas;

        if (ev.target.value === "default") {
            listasFiltradas = listas;
        } else if (ev.target.value === 'monthly') {
            listasFiltradas = listas.filter(element => element.updated === 'MONTHLY');
        } else if (ev.target.value === 'weekly') {
            listasFiltradas = listas.filter(element => element.updated === 'WEEKLY');
        }
        baseDeDatos = listasFiltradas; // Filtrar y guardar en baseDeDatos
        paginaActual = 1;
        pintarListas(listasFiltradas);
        renderizar()
    });

    // Funciones de ordenación por fecha
    const ordenarPorFechaMasAntiguaAsc = (listas) => {
        return listas.sort((a, b) => new Date(a.oldest_published_date) - new Date(b.oldest_published_date));
    };

    const ordenarPorFechaMasAntiguaDesc = (listas) => {
        return listas.sort((a, b) => new Date(b.oldest_published_date) - new Date(a.oldest_published_date));
    };

    const ordenarPorFechaMasNuevaAsc = (listas) => {
        return listas.sort((a, b) => new Date(a.newest_published_date) - new Date(b.newest_published_date));
    };

    const ordenarPorFechaMasNuevaDesc = (listas) => {
        return listas.sort((a, b) => new Date(b.newest_published_date) - new Date(a.newest_published_date));
    };




    //PAGINACION

    function avanzarPagina() {
        if (paginaActual < obtenerPaginasTotales()) {
            paginaActual = paginaActual + 1;
            renderizar();
        }
    }

    function retrocederPagina() {
        if (paginaActual > 1) {
            paginaActual = paginaActual - 1;
            renderizar();
        }
    }

    function obtenerRebanadaDeBaseDeDatos(pagina = 1) {
        const corteDeInicio = (paginaActual - 1) * elementosPorPagina;
        const corteDeFinal = corteDeInicio + elementosPorPagina;
        return baseDeDatos.slice(corteDeInicio, corteDeFinal);
    }

    function obtenerPaginasTotales() {
        return Math.ceil(baseDeDatos.length / elementosPorPagina);
    }

    function gestionarBotones() {
        // Comprobar que no se pueda retroceder
        if (paginaActual === 1) {
            botonAtrasDOM.setAttribute("disabled", true);
        } else {
            botonAtrasDOM.removeAttribute("disabled");
        }
        // Comprobar que no se pueda avanzar
        if (paginaActual === obtenerPaginasTotales()) {
            botonSiguienteDOM.setAttribute("disabled", true);
        } else {
            botonSiguienteDOM.removeAttribute("disabled");
        }

    }


    function renderizar() {
        const rebanadaDatos = obtenerRebanadaDeBaseDeDatos(paginaActual);
        pintarListas(rebanadaDatos);
        gestionarBotones();
        informacionPaginaDOM.textContent = `${paginaActual}/${obtenerPaginasTotales()}`;
    }

    // --
    // Eventos
    // --
    botonAtrasDOM.addEventListener("click", retrocederPagina);
    botonSiguienteDOM.addEventListener("click", avanzarPagina);

    // --
    // Inicio
    // --
    renderizar(); // Mostramos la primera página nada más que carge la página




    /*Vista categorías
    - Ordenar ascendente/descendente por oldest_published_date
    - Ordenar ascendente/descendente por newest_published_date
    Vista detalle libros
    - Búsqueda por título
    - Búqueda por autor
    - Ordenar autor, título A-Z, Z-A
    - Paginación: mostrar libros de 5 en 5
    Meter verificacion
    */
})