// ======================================
// VERIFICAR ADMIN
// ======================================

window.onload = ()=>{

    verificarAdmin();

    cargarProductos();

};



// ======================================
// CARGAR PRODUCTOS
// ======================================

async function cargarProductos(){

    try{

        const respuesta =
        await fetch(

            `${API}/productos`

        );


        const productos =
        await respuesta.json();


        const contenedor =
        document.getElementById(
            "productosAdmin"
        );


        contenedor.innerHTML =
        "";


        productos.forEach((producto)=>{


            contenedor.innerHTML += `

                <div class="card-producto">


                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >


                    <h3>
                        ${producto.nombre}
                    </h3>


                    <p>
                        Categoría:
                        ${producto.categoria}
                    </p>


                    <p>
                        Precio:
                        Q${producto.precio}
                    </p>


                    <p>
                        Stock:
                        ${producto.cantidad}
                    </p>


                    <div class="acciones-admin">


                        <button
                            onclick="editarProducto(${producto.id})"
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

    }catch(error){

        console.log(error);

        alert(
            "Error cargando productos"
        );

    }

}



// ======================================
// AGREGAR PRODUCTO
// ======================================

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

        cargarProductos();

    }catch(error){

        console.log(error);

        alert(
            "Error agregando producto"
        );

    }

}



// ======================================
// ELIMINAR PRODUCTO
// ======================================

async function eliminarProducto(id){

    const confirmar =
    confirm(
        "¿Eliminar producto?"
    );


    if(!confirmar){

        return;

    }


    try{

        await fetch(

            `${API}/productos/${id}`,

            {

                method:"DELETE"

            }

        );


        alert(
            "Producto eliminado"
        );


        cargarProductos();

    }catch(error){

        console.log(error);

        alert(
            "Error eliminando producto"
        );

    }

}



// ======================================
// EDITAR PRODUCTO
// ======================================

async function editarProducto(id){

    const nombre =
    prompt(
        "Nuevo nombre"
    );


    const precio =
    prompt(
        "Nuevo precio"
    );


    const cantidad =
    prompt(
        "Nueva cantidad"
    );


    const categoria =
    prompt(
        "Nueva categoría"
    );


    const imagen =
    prompt(
        "Nueva URL imagen"
    );


    if(
        !nombre ||
        !precio ||
        !cantidad ||
        !categoria
    ){

        alert(
            "Completa todos los datos"
        );

        return;

    }


    try{

        await fetch(

            `${API}/productos/${id}`,

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


        alert(
            "Producto actualizado"
        );


        cargarProductos();

    }catch(error){

        console.log(error);

        alert(
            "Error editando producto"
        );

    }

}



// ======================================
// LIMPIAR FORMULARIO
// ======================================

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