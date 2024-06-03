//PINTAR LISTAS
//VARIABLES
const apiListas = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA'
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

//EVENTOS

loader.addEventListener('click', () => {
    loader.remove()
})

filtroUpdated.addEventListener('change', (ev) => {
    if (ev.target.value === "default") {
        contenedorListas.innerHTML = ''
        getListas()
            .then((resp) => {
                resp.forEach(element => {
                    const elementoContainer = document.createElement('article')
                    const tituloLista = document.createElement('h3')
                    const fechaAntiguo = document.createElement('p')
                    const fechaNuevo = document.createElement('p')
                    const actualizacion = document.createElement('p')
                    const linkLista = document.createElement('button')

                    elementoContainer.id = element.list_name;
                    tituloLista.innerText = element.list_name;
                    fechaAntiguo.innerText = 'OLDEST: ' + element.oldest_published_date;
                    fechaNuevo.innerText = 'NEWEST: ' + element.newest_published_date;
                    actualizacion.innerText = 'UPDATED: ' + element.updated;
                    linkLista.innerText = 'VER MÁS ->'


                    linkLista.addEventListener('click', () => {
                        const url = `lista.html?list=${element.list_name_encoded}`;
                        window.location.href = url;
                    });

                    contenedorListas.append(elementoContainer)
                    elementoContainer.append(tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista)

                });
            })
    } else if (ev.target.value === 'monthly') {
        contenedorListas.innerHTML = ''
        getListas()
        .then((resp) => {
            console.log(resp)
            resp.forEach(element => {

                const elementoContainer = document.createElement('article')
                const tituloLista = document.createElement('h3')
                const fechaAntiguo = document.createElement('p')
                const fechaNuevo = document.createElement('p')
                const actualizacion = document.createElement('p')
                const linkLista = document.createElement('button')

                elementoContainer.id = element.list_name;
                tituloLista.innerText = element.list_name;
                fechaAntiguo.innerText = 'OLDEST: ' + element.oldest_published_date;
                fechaNuevo.innerText = 'NEWEST: ' + element.newest_published_date;
                actualizacion.innerText = 'UPDATED: ' + element.updated;
                linkLista.innerText = 'VER MÁS ->'


                linkLista.addEventListener('click', () => {
                    const url = `lista.html?list=${element.list_name_encoded}`;
                    window.location.href = url;
                });

                if(element.updated === 'MONTHLY'){ 
                contenedorListas.append(elementoContainer)
                elementoContainer.append(tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista)

        }});
        })
    } else if (ev.target.value === 'weekly') {
        contenedorListas.innerHTML = ''
        getListas()
        .then((resp) => {
            console.log(resp)
            resp.forEach(element => {

                const elementoContainer = document.createElement('article')
                const tituloLista = document.createElement('h3')
                const fechaAntiguo = document.createElement('p')
                const fechaNuevo = document.createElement('p')
                const actualizacion = document.createElement('p')
                const linkLista = document.createElement('button')

                elementoContainer.id = element.list_name;
                tituloLista.innerText = element.list_name;
                fechaAntiguo.innerText = 'OLDEST: ' + element.oldest_published_date;
                fechaNuevo.innerText = 'NEWEST: ' + element.newest_published_date;
                actualizacion.innerText = 'UPDATED: ' + element.updated;
                linkLista.innerText = 'VER MÁS ->'


                linkLista.addEventListener('click', () => {
                    const url = `lista.html?list=${element.list_name_encoded}`;
                    window.location.href = url;
                });

                if(element.updated === 'WEEKLY'){ 
                contenedorListas.append(elementoContainer)
                elementoContainer.append(tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista)

        }});
        })
}})


//FUNCIONES

//Almacenar y pintar las listas en un array
const getListas = async () => {
    try {
        const respuesta = await fetch(apiListas);

        if (respuesta.ok) {
            const data = await respuesta.json();
            const arrayListas = data.results;

            return arrayListas;
        } else {
            throw console.log('Error al obtener las listas');
        }
    } catch (error) {
        console.log(error);
    }
};

getListas()
    .then((resp) => {
        resp.forEach(element => {
            const elementoContainer = document.createElement('article')
            const tituloLista = document.createElement('h3')
            const fechaAntiguo = document.createElement('p')
            const fechaNuevo = document.createElement('p')
            const actualizacion = document.createElement('p')
            const linkLista = document.createElement('button')

            elementoContainer.id = element.list_name;
            tituloLista.innerText = element.list_name;
            fechaAntiguo.innerText = 'OLDEST: ' + element.oldest_published_date;
            fechaNuevo.innerText = 'NEWEST: ' + element.newest_published_date;
            actualizacion.innerText = 'UPDATED: ' + element.updated;
            linkLista.innerText = 'VER MÁS ->'


            linkLista.addEventListener('click', () => {
                const url = `lista.html?list=${element.list_name_encoded}`;
                window.location.href = url;
            });

            contenedorListas.append(elementoContainer)
            elementoContainer.append(tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista)

        });
    })
    .catch((error) => {
        console.log(error);
    });


/*Vista categorías
- Filtro por weekly/monthly
- Filtro por categoría. Puede haber selección múltiple
- Ordenar ascendente/descendente por oldest_published_date
- Ordenar ascendente/descendente por newest_published_date
- Ordenar categoria A-Z, Z-A
Vista detalle libros
- Búsqueda por título
- Búqueda por autor
- Ordenar autor, título A-Z, Z-A
- Paginación: mostrar libros de 5 en 5*/

