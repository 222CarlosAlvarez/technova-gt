const usuario =
obtenerUsuario();


// =========================
// VALIDAR LOGIN
// =========================

verificarLogin();


// =========================
// VARIABLES
// =========================

let productosGlobal = [];

let carrito =
obtenerCarrito();


// =========================
// NAVBAR
// =========================

function cargarNavbar(){

    const nav =
    document.getElementById(
        "navButtons"
    );


    // ADMIN
    if(
        usuario &&
        usuario.rol === "admin"
    ){

        nav.innerHTML = `

        <a href="index.html">

            <button>

                Inicio

            </button>

        </a>

        <a href="admin.html">

            <button>

                Administrador

            </button>

        </a>

        <a href="inventario.html">

            <button>

                Inventario

            </button>

        </a>

        <a href="perfil.html">

            <button>

                Perfil

            </button>

        </a>

        <a href="historial.html">

            <button>

                Historial

            </button>

        </a>

        <a href="carrito.html">

            <button>

                Carrito (${carrito.length})

            </button>

        </a>

        <button onclick="cerrarSesion()">

            Cerrar Sesión

        </button>

        `;

    }


    // USER
    else{

        nav.innerHTML = `

        <a href="index.html">

            <button>

                Inicio

            </button>

        </a>

        <a href="perfil.html">

            <button>

                Perfil

            </button>

        </a>

        <a href="historial.html">

            <button>

                Historial

            </button>

        </a>

        <a href="carrito.html">

            <button>

                Carrito (${carrito.length})

            </button>

        </a>

        <button onclick="cerrarSesion()">

            Cerrar Sesión

        </button>

        `;

    }

}


// =========================
// CARGAR PRODUCTOS
// =========================

async function cargarProductos(){

    try{

        const respuesta =
        await fetch(
            `${API}/productos`
        );

        const productos =
        await respuesta.json();

        productosGlobal =
        productos;

        renderProductos(productos);

    }catch(error){

        console.log(error);

    }

}


// =========================
// RENDER PRODUCTOS
// =========================

function renderProductos(productos){

    const contenedor =
    document.getElementById(
        "productos"
    );

    contenedor.innerHTML = "";


    // VACIO
    if(productos.length === 0){

        contenedor.innerHTML = `

        <p>

        No hay productos

        </p>

        `;

        return;

    }


    productos.forEach(producto=>{

        const precio =
        Number(producto.precio);

        contenedor.innerHTML += `

        <div class="card">

            <img
            src="${producto.imagen}"
            alt="${producto.nombre}">

            <div class="card-content">

                <h3>

                ${producto.nombre}

                </h3>

                <p>

                Categoría:
                ${producto.categoria}

                </p>

                <p>

                Precio:
                ${formatoMoneda(precio)}

                </p>

                <p>

                Disponibles:
                ${producto.cantidad}

                </p>

                <button
                onclick="agregarCarrito(
                    ${producto.id},
                    '${producto.nombre}',
                    ${precio}
                )">

                    Agregar al carrito

                </button>

            </div>

        </div>

        `;

    });

}


// =========================
// BUSCAR PRODUCTOS
// =========================

function buscarProductos(){

    const texto =
    document.getElementById(
        "busqueda"
    ).value.toLowerCase();


    const filtrados =
    productosGlobal.filter(producto=>

        producto.nombre
        .toLowerCase()
        .includes(texto)

        ||

        producto.categoria
        .toLowerCase()
        .includes(texto)

    );


    renderProductos(filtrados);

}


// =========================
// AGREGAR CARRITO
// =========================

function agregarCarrito(
    id,
    nombre,
    precio
){

    carrito.push({

        id,
        nombre,
        precio:Number(precio)

    });


    guardarCarrito(carrito);

    cargarNavbar();

    alert(
        "Producto agregado"
    );

}


// =========================
// INICIAR
// =========================

cargarNavbar();

cargarProductos();