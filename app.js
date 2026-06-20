?let biblia = [];

let libroActual = "";
let capituloActual = 0;

/* =====================
CARGAR BIBLIA
===================== */

async function cargarBiblia(){

    try{

        const respuesta =
        await fetch("biblia.json");

        biblia =
        await respuesta.json();

        console.log(
        "Versículos cargados:",
        biblia.length
        );

        generarLibros();

    }catch(error){

        console.error(
        "Error cargando Biblia",
        error
        );

    }

}

/* =====================
GENERAR LIBROS
===================== */

function generarLibros(){

    mostrarTestamento("Antiguo");

}

    function mostrarTestamento(testamento){

    document
    .getElementById("btnAntiguo")
    .classList.remove("activo");

    document
    .getElementById("btnNuevo")
    .classList.remove("activo");

    if(testamento==="Antiguo"){

        document
        .getElementById("btnAntiguo")
        .classList.add("activo");

    }else{

        document
        .getElementById("btnNuevo")
        .classList.add("activo");

    }

    const libros = [...new Set(

        biblia
        .filter(v => v.Testament === testamento)
        .map(v => v.Book)

    )];

    const contenedor =
    document.getElementById("contenedorLibros");

    contenedor.innerHTML = "";

    libros.forEach(libro=>{

        const capitulos = Math.max(
            ...biblia
            .filter(v=>v.Book===libro)
            .map(v=>v.Chapter)
        );

        contenedor.innerHTML += `
        <button
        class="boton-libro"
        onclick="verCapitulos('${libro}',${capitulos})">
        ${libro}
        </button>
        `;
    });
}

/* =====================
VER CAPÍTULOS
===================== */

function verCapitulos(
libro,
totalCapitulos
){

    libroActual = libro;

    document.getElementById(
    "listaLibros"
    ).style.display = "none";

    document.getElementById(
    "capitulos"
    ).style.display = "block";

    document.getElementById(
    "tituloLibro"
    ).innerText = libro;

    const lista =
    document.getElementById(
    "listaCapitulos"
    );

    lista.innerHTML = "";

    for(
        let i=1;
        i<=totalCapitulos;
        i++
    ){

        lista.innerHTML += `

        <button
        class="boton-capitulo"
        onclick="abrirCapitulo(
        '${libro}',
        ${i}
        )">

        ${i}

        </button>

        `;

    }

}

/* =====================
ABRIR CAPÍTULO
===================== */

function abrirCapitulo(
libro,
capitulo
){

    libroActual = libro;
    capituloActual = capitulo;

     localStorage.setItem(
        "ultimaLectura",
        JSON.stringify({
            libro,
            capitulo
        })
    );

    document.getElementById(
    "capitulos"
    ).style.display = "none";

    document.getElementById(
    "textoCapitulo"
    ).style.display = "block";

    document.getElementById(
    "tituloCapitulo"
    ).innerText =
    libro + " " + capitulo;

    const versiculos =
    biblia.filter(v =>

        v.Book === libro

        &&

        v.Chapter === capitulo

    );

    let html = "";

    let tituloAnterior = "";

    versiculos.forEach(v=>{

        if(
            v.Title &&
            v.Title !== tituloAnterior
        ){

            tituloAnterior =
            v.Title;

            html += `

            <h3
            style="
            margin-top:20px;
            color:#60a5fa;
            ">

            ${v.Title}

            </h3>

            `;

        }

        html += `

        <p
        style="
        margin-bottom:12px;
        line-height:1.8;
        ">

        <strong>

        ${v.Verse}

        </strong>

        ${v.Text}

        </p>

        `;

    });

    document.getElementById(
    "contenidoCapitulo"
    ).innerHTML = html;

}

/* =====================
VOLVER
===================== */

function volverLibros(){

    document.getElementById(
    "listaLibros"
    ).style.display = "block";

    document.getElementById(
    "capitulos"
    ).style.display = "none";

}

function volverCapitulos(){

    document.getElementById(
    "textoCapitulo"
    ).style.display = "none";

    document.getElementById(
    "capitulos"
    ).style.display = "block";

}

/* =====================
BUSCADOR
===================== */

document
.getElementById("buscar")
.addEventListener(
"keyup",
function(){

    let texto =
    this.value
    .toLowerCase()
    .trim();

    if(
        texto.length < 3
    ){
        return;
    }

    const resultados =
    biblia.filter(v =>

        v.Text
        .toLowerCase()
        .includes(texto)

    );

    document.getElementById(
    "listaLibros"
    ).style.display = "none";

    document.getElementById(
    "capitulos"
    ).style.display = "none";

    document.getElementById(
    "textoCapitulo"
    ).style.display = "block";

    document.getElementById(
    "tituloCapitulo"
    ).innerText =
    "Resultados";

    let html = "";

    resultados
    .slice(0,100)
    .forEach(v=>{

        html += `

        <div
        style="
        margin-bottom:20px;
        border-bottom:1px solid #444;
        padding-bottom:10px;
        ">

        <b>

        ${v.Book}
        ${v.Chapter}:${v.Verse}

        </b>

        <br><br>

        ${v.Text}

        </div>

        `;

    });

    document.getElementById(
    "contenidoCapitulo"
    ).innerHTML =
    html ||
    "No se encontraron resultados";

});

function mostrarTestamento(testamento){

    document
    .getElementById("btnAntiguo")
    .classList.remove("activo");

    document
    .getElementById("btnNuevo")
    .classList.remove("activo");

    if(testamento==="Antiguo"){

        document
        .getElementById("btnAntiguo")
        .classList.add("activo");

    }else{

        document
        .getElementById("btnNuevo")
        .classList.add("activo");

    }

    const libros = [...new Set(

        biblia
        .filter(v => v.Testament === testamento)
        .map(v => v.Book)

    )];

    const contenedor =
    document.getElementById(
    "contenedorLibros"
    );

    contenedor.innerHTML = "";

    libros.forEach(libro=>{

        const capitulos =
        Math.max(
            ...biblia
            .filter(v=>v.Book===libro)
            .map(v=>v.Chapter)
        );

        contenedor.innerHTML += `
        <button
        class="boton-libro"
        onclick="verCapitulos('${libro}',${capitulos})">

        ${libro}

        </button>
        `;

    });

}
function capituloAnterior(){

    if(capituloActual > 1){

        abrirCapitulo(
            libroActual,
            capituloActual - 1
        );

    }

}

function capituloSiguiente(){

    const ultimoCapitulo =
    Math.max(
        ...biblia
        .filter(v => v.Book === libroActual)
        .map(v => v.Chapter)
    );

    if(capituloActual < ultimoCapitulo){

        abrirCapitulo(
            libroActual,
            capituloActual + 1
        );

    }

}
    tamañoFuente += valor;

    if(tamañoFuente < 12){
        tamañoFuente = 12;
    }

    if(tamañoFuente > 40){
        tamañoFuente = 40;
    }

    document.getElementById(
        "contenidoCapitulo"
    ).style.fontSize =
    tamañoFuente + "px";

}

/* =====================
INICIAR
===================== */

cargarBiblia();