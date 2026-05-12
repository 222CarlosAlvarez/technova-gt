// =========================
// API
// =========================

const API =
"http://localhost:3000";


// =========================
// OBTENER USUARIO
// =========================

function obtenerUsuario(){

    return JSON.parse(

        localStorage.getItem(
            "usuario"
        )

    );

}


// =========================
// VERIFICAR LOGIN
// =========================

function verificarLogin(){

    const usuario =
    obtenerUsuario();

    if(!usuario){

        window.location.href =
        "login.html";

    }

}


// =========================
// VERIFICAR ADMIN
// =========================

function verificarAdmin(){

    const usuario =
    obtenerUsuario();

    if(
        !usuario ||
        usuario.rol !== "admin"
    ){

        window.location.href =
        "login.html";

    }

}


// =========================
// CERRAR SESION
// =========================

function cerrarSesion(){

    localStorage.removeItem(
        "usuario"
    );

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "carrito"
    );

    window.location.href =
    "login.html";

}


// =========================
// FORMATO MONEDA
// =========================

function formatoMoneda(valor){

    return `Q${Number(valor)
    .toFixed(2)}`;

}


// =========================
// GUARDAR CARRITO
// =========================

function guardarCarrito(carrito){

    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );

}


// =========================
// OBTENER CARRITO
// =========================

function obtenerCarrito(){

    return JSON.parse(

        localStorage.getItem(
            "carrito"

        )

    ) || [];

}