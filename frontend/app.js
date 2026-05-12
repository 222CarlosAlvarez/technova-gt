// ======================================
// URL BACKEND RENDER
// ======================================

const API =
"https://technova-backend-bdgq.onrender.com";



// ======================================
// GUARDAR USUARIO
// ======================================

function guardarUsuario(usuario){

    localStorage.setItem(

        "usuario",

        JSON.stringify(usuario)

    );

}



// ======================================
// OBTENER USUARIO
// ======================================

function obtenerUsuario(){

    return JSON.parse(

        localStorage.getItem(
            "usuario"
        )

    );

}



// ======================================
// CERRAR SESION
// ======================================

function cerrarSesion(){

    localStorage.removeItem(
        "usuario"
    );


    localStorage.removeItem(
        "carrito"
    );


    alert(
        "Sesión cerrada"
    );


    window.location.href =
    "login.html";

}



// ======================================
// VERIFICAR LOGIN
// ======================================

function verificarLogin(){

    const usuario =
    obtenerUsuario();


    if(!usuario){

        window.location.href =
        "login.html";

    }

}



// ======================================
// VERIFICAR ADMIN
// ======================================

function verificarAdmin(){

    const usuario =
    obtenerUsuario();


    if(
        !usuario ||
        usuario.rol !== "admin"
    ){

        alert(
            "Acceso denegado"
        );


        window.location.href =
        "index.html";

    }

}



// ======================================
// FORMATO MONEDA
// ======================================

function formatoMoneda(valor){

    return new Intl.NumberFormat(

        "es-GT",

        {

            style:"currency",

            currency:"GTQ"

        }

    ).format(valor);

}



// ======================================
// OBTENER CARRITO
// ======================================

function obtenerCarrito(){

    return JSON.parse(

        localStorage.getItem(
            "carrito"
        )

    ) || [];

}



// ======================================
// GUARDAR CARRITO
// ======================================

function guardarCarrito(carrito){

    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );

}



// ======================================
// AGREGAR AL CARRITO
// ======================================

function agregarAlCarrito(producto){

    let carrito =
    obtenerCarrito();


    // BUSCAR PRODUCTO
    const existe =
    carrito.find((item)=>{

        return item.id === producto.id;

    });


    // SI EXISTE
    if(existe){

        existe.cantidad += 1;

    }else{

        carrito.push({

            ...producto,

            cantidad:1

        });

    }


    guardarCarrito(carrito);


    alert(
        "Producto agregado al carrito"
    );

}



// ======================================
// ELIMINAR DEL CARRITO
// ======================================

function eliminarDelCarrito(index){

    let carrito =
    obtenerCarrito();


    carrito.splice(index,1);


    guardarCarrito(carrito);

}



// ======================================
// CONTAR PRODUCTOS CARRITO
// ======================================

function contarProductosCarrito(){

    const carrito =
    obtenerCarrito();


    return carrito.reduce((total,item)=>{

        return total + item.cantidad;

    },0);

}



// ======================================
// CALCULAR TOTAL CARRITO
// ======================================

function calcularTotalCarrito(){

    const carrito =
    obtenerCarrito();


    return carrito.reduce((total,item)=>{

        return total +

        (
            Number(item.precio) *
            Number(item.cantidad)
        );

    },0);

}



// ======================================
// MOSTRAR LINKS ADMIN
// ======================================

function mostrarLinksAdmin(idElemento){

    const usuario =
    obtenerUsuario();


    const contenedor =
    document.getElementById(
        idElemento
    );


    if(
        usuario &&
        usuario.rol === "admin"
    ){

        contenedor.innerHTML = `

            <a href="admin.html">
                Administrador
            </a>

            <a href="inventario.html">
                Inventario
            </a>

        `;

    }

}



// ======================================
// ACTUALIZAR NAVBAR LOGIN
// ======================================

function actualizarNavbar(authId){

    const usuario =
    obtenerUsuario();


    const authLinks =
    document.getElementById(
        authId
    );


    if(usuario){

        authLinks.innerHTML = `

            <button onclick="cerrarSesion()">
                Cerrar Sesión
            </button>

        `;

    }

}