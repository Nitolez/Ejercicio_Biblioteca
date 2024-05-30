//PINTAR LISTAS
//VARIABLES
const apiListas = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=k502PVGEDLfvNM0EWebLO6Lt9TUUfJAA'
const contenedorListas = document.querySelector("#contenedorListas")

//EVENTOS





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
        console.log(resp);
        resp.forEach(element => {
            const elementoContainer = document.createElement('div')
            const tituloLista =  document.createElement('h3')
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
            //falta el boton de link listas
            
            contenedorListas.append(elementoContainer, tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista)

        });
    })
    .catch((error) => {
        console.log(error);
    });





