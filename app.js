let biblia = [];

let libroActual = "";
let capituloActual = 0;
let favoritos =
JSON.parse(
localStorage.getItem("favoritos")
) || [];
let leyendo = false;
let vozActual = null;
let temporizadorPresionado;
let versiculoSeleccionado = null;
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

// Mostrar el versículo del día
mostrarVersiculoDelDia();

const ultima =
JSON.parse(
localStorage.getItem("ultimaLectura")
);

if(ultima){

    abrirCapitulo(
        ultima.libro,
        ultima.capitulo
    );

}
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
const clave =
`${v.Book}_${v.Chapter}_${v.Verse}`;

const tieneNota =
localStorage.getItem(clave);
        
   html += `

<p
onmousedown="iniciarPresionado(
'${v.Book}',
${v.Chapter},
${v.Verse},
\`${v.Text}\`
)"
ontouchstart="iniciarPresionado(
'${v.Book}',
${v.Chapter},
${v.Verse},
\`${v.Text}\`
)"
onmouseup="cancelarPresionado()"
ontouchend="cancelarPresionado()"
onclick="guardarFavorito(
'${v.Book}',
${v.Chapter},
${v.Verse},
\`${v.Text}\`
)"
style="
margin-bottom:12px;
line-height:1.8;
cursor:pointer;
">

<strong>
${v.Verse}
</strong>

${v.Text}
${tieneNota ? " 📝" : ""}
</p>

`;

    });

    document.getElementById(
    "contenidoCapitulo"
    ).innerHTML = html;
aplicarTamanoFuente();
}

/* =====================
VOLVER
===================== */

function volverLibros(){
speechSynthesis.cancel();
    document.getElementById(
    "listaLibros"
    ).style.display = "block";

    document.getElementById(
    "capitulos"
    ).style.display = "none";

}

function volverCapitulos(){
speechSynthesis.cancel();
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


function capituloAnterior(){
speechSynthesis.cancel();
    if(capituloActual > 1){

        abrirCapitulo(
            libroActual,
            capituloActual - 1
        );

    }

}

function capituloSiguiente(){
speechSynthesis.cancel();
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
let tamañoFuente =
parseInt(
localStorage.getItem("tamanoFuente")
) || 17;

function cambiarFuente(valor){

    tamañoFuente += valor;

    if(tamañoFuente < 12){
        tamañoFuente = 12;
    }

    if(tamañoFuente > 40){
        tamañoFuente = 40;
    }

    localStorage.setItem(
        "tamanoFuente",
        tamañoFuente
    );

    aplicarTamanoFuente();

}
function toggleDarkMode(){

    document.body.classList.toggle("modo-oscuro");

    const btn =
    document.getElementById("btnTema");

    if(document.body.classList.contains("modo-oscuro")){

        btn.innerHTML="☀️";

        localStorage.setItem("tema","oscuro");

    }else{

        btn.innerHTML="🌙";

        localStorage.setItem("tema","claro");

    }

}

function aplicarTamanoFuente(){

    document
    .querySelectorAll(
        "#contenidoCapitulo p"
    )
    .forEach(p=>{

        p.style.fontSize =
        tamañoFuente + "px";

    });

}
function toggleMenu(){

    const panel =
    document.getElementById(
    "panelConfig"
    );

    if(
        panel.style.display ===
        "block"
    ){

        panel.style.display =
        "none";

    }else{

        panel.style.display =
        "block";

    }

}
document.addEventListener(
"click",
function(e){

    const menu =
    document.querySelector(
    ".menu-config"
    );

    const panel =
    document.getElementById(
    "panelConfig"
    );

    if(
        menu &&
        !menu.contains(e.target)
    ){

        panel.style.display =
        "none";

    }

});
function guardarFavorito(libro, capitulo, versiculo, texto){

    const existe = favoritos.some(f =>
        f.libro === libro &&
        f.capitulo === capitulo &&
        f.versiculo === versiculo
    );

    if(existe){
        alert("Ya está en favoritos ⭐");
        return;
    }

    favoritos.push({
        libro,
        capitulo,
        versiculo,
        texto
    });

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    alert("Versículo guardado ⭐");
}
function mostrarFavoritos(){

    document.getElementById(
    "listaLibros"
    ).style.display="none";

    document.getElementById(
    "capitulos"
    ).style.display="none";

    document.getElementById(
    "textoCapitulo"
    ).style.display="block";

    document.getElementById(
    "tituloCapitulo"
    ).innerText =
    "⭐ Favoritos";

    let html = "";

favoritos.forEach((f, i)=>{

    html += `

    <div
onclick="seleccionarFavorito('${f.libro}', ${f.capitulo}, ${f.versiculo}, \`${f.texto}\`)"
style="
margin-bottom:20px;
border-bottom:1px solid #ccc;
padding-bottom:10px;
cursor:pointer;
">

    <b>
    ${f.libro} ${f.capitulo}:${f.versiculo}
    </b>

    <button
    onclick="eliminarFavorito(${i})"
    style="
    float:right;
    background:none;
    border:none;
    font-size:18px;
    cursor:pointer;
    color:red;
    ">
    ❌
    </button>

    <br><br>

    ${f.texto}

    </div>

    `;

});

    document.getElementById(
    "contenidoCapitulo"
    ).innerHTML =
    html ||
    "No hay favoritos";

}
function eliminarFavorito(indice){

    favoritos.splice(indice, 1);

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    mostrarFavoritos();

}
window.addEventListener("load", () => {

    // Tema
    let tema = localStorage.getItem("tema");

    const btn = document.getElementById("btnTema");

    if (tema === "oscuro") {

        document.body.classList.add("modo-oscuro");

        if (btn) {
            btn.innerHTML = "☀️";
        }

    }

    // Service Worker
    if ("serviceWorker" in navigator) {

        navigator.serviceWorker.register("./service-worker.js")
        .then(() => console.log("PWA activa"))
        .catch(err => console.log("Error SW", err));
 
    
    }

/* =====================
INICIAR
===================== */
    
    // Cargar Biblia
    cargarBiblia();

});
function seleccionarFavorito(libro, capitulo, versiculo, texto){

    versiculoSeleccionado = {
        libro,
        capitulo,
        versiculo,
        texto
    };

    abrirCapitulo(libro, capitulo);

    // abrir nota automáticamente (opcional)
    setTimeout(() => {
        abrirNota();
    }, 300);
}
 function mostrarVersiculoDelDia(){

    if(biblia.length === 0){

        setTimeout(
            mostrarVersiculoDelDia,
            500
        );

        return;
    }

    const hoy = new Date();

    const clave =
        hoy.getFullYear() +
        "-" +
        (hoy.getMonth()+1) +
        "-" +
        hoy.getDate();

    let guardado =
    JSON.parse(
        localStorage.getItem("versiculoDia")
    );

    if(guardado && guardado.fecha === clave){

        document.getElementById(
            "textoVersiculoDia"
        ).innerText = guardado.texto;

        document.getElementById(
            "referenciaVersiculoDia"
        ).innerText = guardado.referencia;

        return;

    }

   const indice =
Math.floor(
    Math.random() * biblia.length
);

const v = biblia[indice];

const texto = v.Text;

const referencia =
v.Book +
" " +
v.Chapter +
":" +
v.Verse;

    document.getElementById(
        "textoVersiculoDia"
    ).innerText = texto;

    document.getElementById(
        "referenciaVersiculoDia"
    ).innerText = referencia;

    localStorage.setItem(
        "versiculoDia",
        JSON.stringify({

            fecha: clave,
            texto: texto,
            referencia: referencia

        })
    );

}
function copiarVersiculoDia(){

    const texto =
    document.getElementById(
        "textoVersiculoDia"
    ).innerText;

    const referencia =
    document.getElementById(
        "referenciaVersiculoDia"
    ).innerText;

    navigator.clipboard.writeText(
        texto + "\n\n" + referencia
    );

    alert("Versículo copiado.");
}
function leerVersiculoDia(){

    speechSynthesis.cancel();

    let lectura =
    new SpeechSynthesisUtterance(

        document.getElementById(
        "textoVersiculoDia"
        ).innerText

    );

    lectura.lang = "es-ES";

    speechSynthesis.speak(
        lectura
    );

}
function leerCapitulo() {

    if (!("speechSynthesis" in window)) {
        alert("Tu navegador no soporta lectura por voz.");
        return;
    }

    speechSynthesis.cancel();

    let titulo = document.getElementById("tituloCapitulo").innerText;
    let texto = document.getElementById("contenidoCapitulo").innerText;

    let lectura = new SpeechSynthesisUtterance(
        titulo + ". " + texto
    );

    // Buscar una voz en español
    const voces = speechSynthesis.getVoices();
    const vozEspanol = voces.find(v =>
        v.lang.startsWith("es")
    );

    if (vozEspanol) {
        lectura.voice = vozEspanol;
    }

    lectura.lang = "es-ES";
    lectura.rate = 1;
    lectura.pitch = 1;
    lectura.volume = 1;

    vozActual = lectura;
    leyendo = true;
document.getElementById("btnLeer").innerHTML = "🔊 Leyendo...";
document.getElementById("btnLeer").disabled = true;
    
  lectura.onend = function () {

    leyendo = false;

    document.getElementById("btnLeer").innerHTML = "🔊 Leer";
    document.getElementById("btnLeer").disabled = false;

};

    speechSynthesis.speak(lectura);
}

function detenerLectura() {

    speechSynthesis.cancel();

    leyendo = false;
    vozActual = null;

    document.getElementById("btnLeer").innerHTML = "🔊 Leer";
    document.getElementById("btnLeer").disabled = false;

}

function pausarLectura() {

    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
    }

}

function continuarLectura() {

    if (speechSynthesis.paused) {
        speechSynthesis.resume();
    }

}
function iniciarPresionado(libro,capitulo,versiculo,texto){

    versiculoSeleccionado={
        libro,
        capitulo,
        versiculo,
        texto
    };

    temporizadorPresionado=setTimeout(()=>{

        document.getElementById(
            "menuVersiculo"
        ).style.display="block";

    },1000);

}

function cancelarPresionado(){

    clearTimeout(
        temporizadorPresionado
    );

}

function cerrarMenuVersiculo(){

    document.getElementById(
        "menuVersiculo"
    ).style.display="none";

}
async function compartirVersiculoSeleccionado(){

    cerrarMenuVersiculo();

    const v=versiculoSeleccionado;

    const mensaje=
`${v.libro} ${v.capitulo}:${v.versiculo}

${v.texto}

📖 Biblia RV1960

https://cultivahoyhuertaencasa-rgb.github.io/biblia-rv1960/`;

    if(navigator.share){

        try{

            await navigator.share({

                title:`${v.libro} ${v.capitulo}:${v.versiculo}`,
                text:mensaje

            });

        }catch(e){}

    }else{

        navigator.clipboard.writeText(mensaje);

        alert("Versículo copiado.");

    }

}
function copiarVersiculoSeleccionado(){

    cerrarMenuVersiculo();

    const v=versiculoSeleccionado;

    navigator.clipboard.writeText(

`${v.libro} ${v.capitulo}:${v.versiculo}

${v.texto}`

    );

    alert("Versículo copiado.");

}
function agregarNota(){

    cerrarMenuVersiculo();

    const v = versiculoSeleccionado;

    const clave =
    `${v.libro}_${v.capitulo}_${v.versiculo}`;

    const notaAnterior =
    localStorage.getItem(clave) || "";

    const nota = prompt(
        "Escribe tu nota:",
        notaAnterior
    );

    if(nota === null){
        return;
    }

    localStorage.setItem(
        clave,
        nota
    );

    alert("Nota guardada.");

    abrirCapitulo(
        libroActual,
        capituloActual
    );

}
function abrirNota(){
    if(!versiculoSeleccionado) return;

    const v = versiculoSeleccionado;
    const clave = `${v.libro}_${v.capitulo}_${v.versiculo}`;

    const nota = localStorage.getItem(clave) || "";

    document.getElementById("textoNota").value = nota;

    const ventana = document.getElementById("ventanaNota");
    ventana.style.display = "flex";
}
function guardarNota(libro, capitulo, versiculo){
    const clave = `${libro}_${capitulo}_${versiculo}`;
    const nota = document.getElementById("textoNota").value;

    localStorage.setItem(clave, nota);
    alert("Nota guardada ✔️");
}
function eliminarNota(libro, capitulo, versiculo){
    const clave = `${libro}_${capitulo}_${versiculo}`;
    localStorage.removeItem(clave);

    document.getElementById("textoNota").value = "";
    alert("Nota eliminada 🗑️");
}

function cerrarNota(){
    document.getElementById("ventanaNota").style.display = "none";
}
window.addEventListener("load", () => {

    const ventana = document.getElementById("ventanaNota");

    ventana.addEventListener("click", (e) => {

        if (e.target.classList.contains("ventana-nota")) {
            cerrarNota();
        }

    });

});
