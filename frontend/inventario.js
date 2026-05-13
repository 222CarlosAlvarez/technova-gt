// =====================================
// VARIABLES
// =====================================

let productos = [];

let editando = false;

let productoEditando = null;



// =====================================
// INICIO
// =====================================

window.onload = ()=>{

    verificarAdmin();

    obtenerProductos();

};



// =====================================
// VERIFICAR ADMIN
// =====================================

function verificarAdmin(){

    const usuario =
    obtenerUsuario();


    if(

        !usuario ||

        usuario.rol !== "admin"

    ){

        window.location.href =
        "index.html";

    }

}



// =====================================
// OBTENER PRODUCTOS
// =====================================

async function obtenerProductos(){

    try{


        const respuesta =
        await fetch(

            `${API}/productos`

        );


        productos =
        await respuesta.json();


        mostrarProductos();


    }catch(error){

        console.log(error);

    }

}



// =====================================
// MOSTRAR PRODUCTOS
// =====================================

function mostrarProductos(){

    const contenedor =
    document.getElementById(
        "contenedorInventario"
    );


    contenedor.innerHTML =
    "";


    // SIN PRODUCTOS
    if(productos.length === 0){

        contenedor.innerHTML = `

            <h2>
                No hay productos
            </h2>

        `;

        return;

    }


    // RECORRER PRODUCTOS
    productos.forEach(producto=>{


        contenedor.innerHTML += `

            <div class="card-producto">


                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <h2>

                    ${producto.nombre}

                </h2>


                <p>

                    Categoría:
                    ${producto.categoria}

                </p>


                <p>

                    Precio:
                    Q${Number(producto.precio).toFixed(2)}

                </p>


                <p>

                    Stock:

                    ${
                        producto.cantidad <= 0

                        ?

                        `<span class="sin-stock">
                            Agotado
                        </span>`

                        :

                        producto.cantidad
                    }

                </p>


                <div class="acciones-producto">


                    <button
                        class="btn-editar"
                        onclick='editarProducto(${JSON.stringify(producto)})'
                    >

                        Editar

                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarProducto(${producto.id})"
                    >

                        Eliminar

                    </button>


                </div>


            </div>

        `;

    });

}



// =====================================
// AGREGAR PRODUCTO
// =====================================

async function agregarProducto(event){

    event.preventDefault();


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


        // =====================================
        // EDITAR
        // =====================================

        if(editando){


            const respuesta =
            await fetch(

                `${API}/productos/${productoEditando.id}`,

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


            if(!respuesta.ok){

                alert(
                    datos.mensaje
                );

                return;

            }


            alert(
                "Producto actualizado"
            );


            editando = false;

            productoEditando = null;


            document.getElementById(
                "btnGuardar"
            ).innerText =
            "Agregar Producto";


        }else{


            // =====================================
            // AGREGAR
            // =====================================

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


            if(!respuesta.ok){

                alert(
                    datos.mensaje
                );

                return;

            }


            alert(
                "Producto agregado"
            );

        }


        // LIMPIAR
        document.getElementById(
            "formProducto"
        ).reset();


        obtenerProductos();


    }catch(error){

        console.log(error);

        alert(
            "Error guardando producto"
        );

    }

}



// =====================================
// EDITAR PRODUCTO
// =====================================

function editarProducto(producto){

    editando = true;

    productoEditando = producto;


    document.getElementById(
        "nombre"
    ).value =
    producto.nombre;


    document.getElementById(
        "precio"
    ).value =
    producto.precio;


    document.getElementById(
        "cantidad"
    ).value =
    producto.cantidad;


    document.getElementById(
        "categoria"
    ).value =
    producto.categoria;


    document.getElementById(
        "imagen"
    ).value =
    producto.imagen;


    document.getElementById(
        "btnGuardar"
    ).innerText =
    "Actualizar Producto";


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



// =====================================
// ELIMINAR PRODUCTO
// =====================================

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


        if(!respuesta.ok){

            alert(
                datos.mensaje
            );

            return;

        }


        alert(
            "Producto eliminado"
        );


        obtenerProductos();


    }catch(error){

        console.log(error);

        alert(
            "Error eliminando producto"
        );

    }

}