document.addEventListener('DOMContentLoaded', () => {

    // FIREBASE
    const firebaseConfig = {
        apiKey: "AIzaSyC3aIRWvrB-lOrrfIKSNY_MORTWPcweN5o",
        authDomain: "demofirebase-a0725.firebaseapp.com",
        projectId: "demofirebase-a0725",
        storageBucket: "demofirebase-a0725.appspot.com",
        messagingSenderId: "902020080501",
        appId: "1:902020080501:web:8ffeead08d2e544e26693c"
    };

    firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

    const db = firebase.firestore();// db representa mi BBDD //inicia Firestore


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
    let listaCompleta = [];
    const textSearch = document.querySelector('#searchText')
    const searchButton = document.getElementById('searchButton');

    //EVENTOS

    //Boton que te lleva al final de la pagina
    document.getElementById('botonFinal').addEventListener('click', () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });

    // Ocultar el botón cuando se alcanza el final del documento

    window.addEventListener('scroll', function () {
        let button = document.getElementById('botonFinal'); 
        let rainbowBorder = this.document.querySelector('.rainbow');
        let scrollPosition = window.scrollY

        if (scrollPosition >= (document.documentElement.scrollHeight - window.innerHeight)) {
            button.style.display = 'none'; 
            rainbowBorder.style.display = 'none';
        } else {
            button.style.display = 'block'; // Muestra el botón en cualquier otra posición
            rainbowBorder.style.display = 'block';
        }
    });

    //Para el loader de la pagina
    loader.addEventListener('click', () => {
        loader.remove()
    })

    // Funcion para resetear filters, para ponerla cuando clickemos en cada filtro
    const resetFilters = (filtro1) => {
        filtro1.value = "default"
    };

    // Eventos de ordenar listas
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
        baseDeDatos = listasOrdenadas; 
        paginaActual = 1; 
        renderizar();
        resetFilters(filtroUpdated);
        resetFilters(orderNewestSelect);
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
        baseDeDatos = listasOrdenadas; 
        paginaActual = 1; 
        renderizar();
        resetFilters(filtroUpdated);
        resetFilters(orderOldestSelect);
    });

    filtroUpdated.addEventListener('change', async (ev) => {
        resetFilters(orderNewestSelect);
        resetFilters(orderOldestSelect);
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
        baseDeDatos = listasFiltradas;
        paginaActual = 1;
        pintarListas(listasFiltradas);
        renderizar()
    });

    searchButton.addEventListener('click', () => {
        const textoBusqueda = textSearch.value.trim(); // el trim  elimina los espacios en blanco en ambos extremos del string
        const listasFiltradas = filtrarPorTitulo(listaCompleta, textoBusqueda); 
        baseDeDatos = listasFiltradas;
        paginaActual = 1; 
        renderizar(); 
    });

    //para que al presionar intro se busque
    textSearch.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            const textoBusqueda = textSearch.value.trim();
            const listasFiltradas = filtrarPorTitulo(listaCompleta, textoBusqueda);
            baseDeDatos = listasFiltradas; 
            paginaActual = 1;
            renderizar(); 
        }
    });

    botonSortAZ.addEventListener('click', async () => {
        resetFilters(orderNewestSelect);
        resetFilters(orderOldestSelect);
        resetFilters(filtroUpdated);
        const listas = await getListas();
        baseDeDatos = ordenarAZ(listas); 
        paginaActual = 1; 
        renderizar();
    });

    botonSortZA.addEventListener('click', async () => {
        resetFilters(orderNewestSelect);
        resetFilters(orderOldestSelect);
        resetFilters(filtroUpdated);
        const listas = await getListas();
        baseDeDatos = ordenarZA(listas); 
        paginaActual = 1; 
        renderizar();
    });



    //FUNCIONES

    //Almacenar, pintar y generar los elementos de las listas
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
        linkLista.innerText = 'SEE MORE ->';
        favorito.innerHTML = '<img src="../imgs/corazonVacio.png" width="15px" heigh="15px">'
        favorito.id = 'btnFavorito'

        //Para añadir un evento que cambie el corazon de los favoritos si le damos click
        favorito.addEventListener('click', () => {
            if (favorito.innerHTML === '<img src="../imgs/corazonVacio.png" width="15px" heigh="15px">') {
                favorito.innerHTML = ''
                favorito.innerHTML = '<img src="../imgs/corazonLleno.png" width="15px" heigh="15px">'
            } else if (favorito.innerHTML === '<img src="../imgs/corazonLleno.png" width="15px" heigh="15px">') {
                favorito.innerHTML = ''
                favorito.innerHTML = '<img src="../imgs/corazonVacio.png" width="15px" heigh="15px">'
            }
        })

        //Para que cada link de cada lista nos lleve a otra página de esa lista
        linkLista.addEventListener('click', () => {
            const url = `lista.html?list=${element.list_name_encoded}`;
            window.location.href = url;
        });

        elementoContainer.append(tituloLista, fechaAntiguo, fechaNuevo, actualizacion, linkLista, favorito);
        return elementoContainer;
    };

    //FILTROS DE TITULO, AZ Y UPDATED 

    // Filtrar listas por título
    const filtrarPorTitulo = (listas, textoBusqueda) => {
        return listas.filter(element => element.list_name.toLowerCase().includes(textoBusqueda.toLowerCase()));
    };

    // Ordenar listas A-Z
    const ordenarAZ = (listas) => {
        return listas.sort((a, b) => a.list_name.localeCompare(b.list_name));
    };

    // Ordenar listas Z-A
    const ordenarZA = (listas) => {
        return listas.sort((a, b) => b.list_name.localeCompare(a.list_name));
    };

    // PAra inicializar listas al cargar la página
    getListas()
        .then(listas => {
            baseDeDatos = listas; 
            listaCompleta = listas;
            renderizar();
        })
        .catch(console.error);


    // Ordenar por fecha
    //sort ordena los elementos de un array
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
        //slice devuelve una copia de una parte del array dentro de un nuevo array empezando por inicio hasta fin
    }

    function obtenerPaginasTotales() {
        return Math.ceil(baseDeDatos.length / elementosPorPagina);
        //math.ceil redondea y devuelve el número entero más pequeño mayor o igual a un número determinado.
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
        informacionPaginaDOM.textContent = `Page ${paginaActual} of ${obtenerPaginasTotales()}`;
    }

    botonAtrasDOM.addEventListener("click", retrocederPagina);
    botonSiguienteDOM.addEventListener("click", avanzarPagina);

    //Invocamos renderizar que activa todo el proceso
    renderizar();





    //LOG IN

    const signInUser = (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                let user = userCredential.user;
                console.log(`se ha logado ${user.email} ID:${user.uid}`)
                alert(`se ha logado ${user.email} ID:${user.uid}`)
                console.log("USER", user);
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            });
    }

    const signOut = () => {
        let user = firebase.auth().currentUser;

        firebase.auth().signOut().then(() => {
            console.log("Sale del sistema: " + user.email)
        }).catch((error) => {
            console.log("hubo un error: " + error);
        });
    }


    document.getElementById("form2").addEventListener("submit", function (event) {
        event.preventDefault();
        let email = event.target.elements.email2.value;
        let pass = event.target.elements.pass3.value;
        signInUser(email, pass)
    })
    document.getElementById("salir").addEventListener("click", signOut);


    // Listener de usuario en el sistema
    // Controlar usuario logado
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(`Está en el sistema:${user.email} ${user.uid}`);
            document.getElementById("message").innerText = `You are logged as: ${user.email}`;
        } else {
            console.log("no hay usuarios en el sistema");
            document.getElementById("message").innerText = `Log in or sign up`;
        }
    });




    //SIGN UP

    const signUpUser = (email, password) => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            // ...
            // Saves user in firestore
            createUser({
              id: user.uid,
              email: user.email,
              message: "hola!"
            });
      
          })
          .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
          });
      };
      
      
      document.getElementById("form1").addEventListener("submit", function (event) {
        event.preventDefault();
        let email = event.target.elements.email.value;
        let pass = event.target.elements.pass.value;
        let pass2 = event.target.elements.pass2.value;
      
        pass === pass2 ? signUpUser(email, pass) : alert("error password");
      })



      //FAVOTITOS (DEMO) Nocompletado
      
})