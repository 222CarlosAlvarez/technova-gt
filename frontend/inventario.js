const usuario =
obtenerUsuario();


// =========================
// VALIDAR ADMIN
// =========================

verificarAdmin();


// =========================
// VARIABLES
// =========================

let productosGlobal = [];

let editandoId = null;


// =========================
// CARGAR INVENTARIO
// =========================

async function cargarInventario(){

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

        actualizarResumen(productos);

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
        "inventario"
    );

    contenedor.innerHTML = "";


    // SIN PRODUCTOS
    if(productos.length === 0){

        contenedor.innerHTML = `

        <p>

        No hay productos

        </p>

        `;

        return;

    }


    // RECORRER PRODUCTOS
    productos.forEach(producto=>{

        const agotado =
        producto.cantidad <= 0;

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
                ${formatoMoneda(
                    producto.precio
                )}

                </p>

                <p>

                Stock:
                ${producto.cantidad}

                </p>

                <p style="
                color:
                ${agotado ? 'red':'green'};
                font-weight:bold;
                ">

                ${agotado
                ? 'AGOTADO'
                : 'DISPONIBLE'}

                </p>

                <button
                onclick="editarProducto(
                    ${producto.id},
                    '${producto.nombre}',
                    ${producto.precio},
                    ${producto.cantidad},
                    '${producto.categoria}',
                    '${producto.imagen}'
                )">

                    Editar

                </button>

                <button
                onclick="eliminarProducto(${producto.id})">

                    Eliminar

                </button>

            </div>

        </div>

        `;

    });

}


// =========================
// ACTUALIZAR RESUMEN
// =========================

function actualizarResumen(productos){

    document.getElementById(
        "totalProductos"
    ).innerText =
    productos.length;


    let totalStock = 0;

    productos.forEach(producto=>{

        totalStock += Number(
            producto.cantidad
        );

    });


    document.getElementById(
        "totalStock"
    ).innerText =
    totalStock;

}


// =========================
// BUSCAR CATEGORIA
// =========================

function buscarCategoria(){

    const texto =
    document.getElementById(
        "buscarCategoria"
    ).value.toLowerCase();


    const filtrados =
    productosGlobal.filter(producto=>

        producto.categoria
        .toLowerCase()
        .includes(texto)

    );


    renderProductos(filtrados);

}


// =========================
// AGREGAR PRODUCTO
// =========================

async function agregarProducto(){

    const nombre =
    document.getElementById(
        "nombre"
    ).value;


    const precio =
    document.getElementById(
        "precio"
    ).value;


    const cantidad =
    document.getElementById(
        "cantidad"
    ).value;


    const categoria =
    document.getElementById(
        "categoria"
    ).value;


    const imagen =
    document.getElementById(
        "imagen"
    ).value;


    // VALIDAR
    if(
        !nombre ||
        !precio ||
        !cantidad ||
        !categoria
    ){

        alert(
            "Completa todos los campos"
        );

        return;

    }


    try{

        const respuesta =
        await fetch(

            `${API}/productos`,

            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    nombre,
                    precio,
                    cantidad,
                    categoria,
                    imagen

                })

            }

        );

        const datos =
        await respuesta.json();

        alert(
            datos.mensaje
        );


        limpiarFormulario();

        cargarInventario();

    }catch(error){

        console.log(error);

    }

}


// =========================
// EDITAR PRODUCTO
// =========================

function editarProducto(
    id,
    nombre,
    precio,
    cantidad,
    categoria,
    imagen
){

    editandoId = id;


    document.getElementById(
        "nombre"
    ).value = nombre;


    document.getElementById(
        "precio"
    ).value = precio;


    document.getElementById(
        "cantidad"
    ).value = cantidad;


    document.getElementById(
        "categoria"
    ).value = categoria;


    document.getElementById(
        "imagen"
    ).value = imagen;


    // CAMBIAR BOTON
    const boton =
    document.querySelector(
        ".formulario button"
    );

    boton.innerText =
    "Guardar Cambios";

    boton.onclick =
    actualizarProducto;

}


// =========================
// ACTUALIZAR PRODUCTO
// =========================

async function actualizarProducto(){

    const nombre =
    document.getElementById(
        "nombre"
    ).value;


    const precio =
    document.getElementById(
        "precio"
    ).value;


    const cantidad =
    document.getElementById(
        "cantidad"
    ).value;


    const categoria =
    document.getElementById(
        "categoria"
    ).value;


    const imagen =
    document.getElementById(
        "imagen"
    ).value;


    try{

        const respuesta =
        await fetch(

            `${API}/productos/${editandoId}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    nombre,
                    precio,
                    cantidad,
                    categoria,
                    imagen

                })

            }

        );

        const datos =
        await respuesta.json();

        alert(
            datos.mensaje
        );


        limpiarFormulario();


        // RESTAURAR BOTON
        const boton =
        document.querySelector(
            ".formulario button"
        );

        boton.innerText =
        "Agregar Producto";

        boton.onclick =
        agregarProducto;


        editandoId = null;

        cargarInventario();

    }catch(error){

        console.log(error);

    }

}


// =========================
// ELIMINAR PRODUCTO
// =========================

async function eliminarProducto(id){

    const confirmar =
    confirm(
        "¿Eliminar producto?"
    );

    if(!confirmar){

        return;

    }


    try{

        const respuesta =
        await fetch(

            `${API}/productos/${id}`,

            {

                method:"DELETE"

            }

        );

        const datos =
        await respuesta.json();

        alert(
            datos.mensaje
        );

        cargarInventario();

    }catch(error){

        console.log(error);

    }

}


// =========================
// LIMPIAR FORMULARIO
// =========================

function limpiarFormulario(){

    document.getElementById(
        "nombre"
    ).value = "";


    document.getElementById(
        "precio"
    ).value = "";


    document.getElementById(
        "cantidad"
    ).value = "";


    document.getElementById(
        "categoria"
    ).value = "";


    document.getElementById(
        "imagen"
    ).value = "";

}


// =========================
// INICIAR
// =========================

cargarInventario();