//PINTAR LISTAS
//VARIABLES
//const apiListas = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA'
const contenedorListas = document.querySelector("#contenedorListas")
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
const botonSortAZ = document.getElementById('sortAZ');
const botonSortZA = document.getElementById('sortZA');

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

    elementoContainer.id = element.list_name;
    tituloLista.innerText = element.list_name;
    fechaAntiguo.innerText = 'OLDEST: ' + element.oldest_published_date;
    fechaNuevo.innerText = 'NEWEST: ' + element.newest_published_date;
    actualizacion.innerText = 'UPDATED: ' + element.updated;
    linkLista.innerText = 'VER MÁS ->';

    linkLista.addEventListener('click', () => {
        const url = `lista.html?list=${element.list_name_encoded}`;
        window.location.href = url;
    });

    elementoContainer.append(tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista);
    return elementoContainer;
};

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
    const listas = await getListas();
    const listasOrdenadas = ordenarAZ(listas);
    pintarListas(listasOrdenadas);
});

botonSortZA.addEventListener('click', async () => {
    const listas = await getListas();
    const listasOrdenadas = ordenarZA(listas);
    pintarListas(listasOrdenadas);
});

// Inicializar listas al cargar la página
getListas()
    .then(pintarListas)
    .catch(console.error);

filtroUpdated.addEventListener('change', async (ev) => {
    const listas = await getListas();
    let listasFiltradas;

    if (ev.target.value === "default") {
        listasFiltradas = listas;
    } else if (ev.target.value === 'monthly') {
        listasFiltradas = listas.filter(element => element.updated === 'MONTHLY');
    } else if (ev.target.value === 'weekly') {
        listasFiltradas = listas.filter(element => element.updated === 'WEEKLY');
    }

    pintarListas(listasFiltradas);
});

/*Vista categorías
- Ordenar ascendente/descendente por oldest_published_date
- Ordenar ascendente/descendente por newest_published_date
- Ordenar categoria A-Z, Z-A
Vista detalle libros
- Búsqueda por título
- Búqueda por autor
- Ordenar autor, título A-Z, Z-A
- Paginación: mostrar libros de 5 en 5*/

