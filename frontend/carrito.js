// =====================================
// VARIABLES
// =====================================

let carrito = [];



// =====================================
// INICIO
// =====================================

window.onload = ()=>{

    verificarLogin();

    mostrarLinksAdmin(
        "adminLinks"
    );

    cargarCarrito();

};



// =====================================
// CARGAR CARRITO
// =====================================

function cargarCarrito(){

    carrito = JSON.parse(

        localStorage.getItem(
            "carrito"
        )

    ) || [];


    mostrarCarrito();

}



// =====================================
// MOSTRAR CARRITO
// =====================================

function mostrarCarrito(){

    const contenedor =
    document.getElementById(
        "contenedorCarrito"
    );


    const totalCarrito =
    document.getElementById(
        "totalCarrito"
    );


    contenedor.innerHTML =
    "";


    if(carrito.length === 0){

        contenedor.innerHTML = `

            <h2>
                Carrito vacío
            </h2>

        `;

        totalCarrito.innerHTML = "";

        return;

    }


    let subtotal = 0;


    carrito.forEach((producto,index)=>{


        const precio =
        Number(producto.precio) || 0;


        const cantidad =
        Number(producto.cantidad) || 0;


        const subtotalProducto =
        precio * cantidad;


        subtotal += subtotalProducto;


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

                    Precio:
                    Q${precio.toFixed(2)}

                </p>

                <p>

                    Cantidad:
                    ${cantidad}

                </p>

                <p>

                    Subtotal:
                    Q${subtotalProducto.toFixed(2)}

                </p>

                <button
                    class="btn-eliminar"
                    onclick="eliminarProducto(${index})"
                >

                    Eliminar

                </button>

            </div>

        `;

    });


    const iva =
    subtotal * 0.12;


    const total =
    subtotal + iva;


    totalCarrito.innerHTML = `

        <h2>

            Subtotal:
            Q${subtotal.toFixed(2)}

        </h2>

        <h2>

            IVA 12%:
            Q${iva.toFixed(2)}

        </h2>

        <h1>

            Total:
            Q${total.toFixed(2)}

        </h1>

    `;

}



// =====================================
// ELIMINAR PRODUCTO
// =====================================

function eliminarProducto(index){

    carrito.splice(index,1);


    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );


    mostrarCarrito();

}



// =====================================
// COMPRAR TODO
// =====================================

async function comprarTodo(){


    if(carrito.length === 0){

        alert(
            "Carrito vacío"
        );

        return;

    }


    const usuario =
    obtenerUsuario();


    try{


        let subtotalGeneral = 0;


        for(const producto of carrito){


            const precio =
            Number(producto.precio) || 0;


            const cantidad =
            Number(producto.cantidad) || 0;


            subtotalGeneral +=
            precio * cantidad;


            const respuesta =
            await fetch(

                `${API}/compras`,

                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        usuario_id:
                        usuario.id,

                        producto_id:
                        producto.id,

                        nombre_producto:
                        producto.nombre,

                        precio:
                        precio,

                        cantidad:
                        cantidad

                    })

                }

            );


            // VALIDAR RESPUESTA
            if(!respuesta.ok){

                const errorTexto =
                await respuesta.text();

                alert(
                    errorTexto
                );

                return;

            }

        }


        const iva =
        subtotalGeneral * 0.12;


        const total =
        subtotalGeneral + iva;


        alert(

`Compra realizada correctamente

Subtotal: Q${subtotalGeneral.toFixed(2)}

IVA 12%: Q${iva.toFixed(2)}

Total: Q${total.toFixed(2)}`

        );


        carrito = [];


        localStorage.removeItem(
            "carrito"
        );


        mostrarCarrito();


        setTimeout(()=>{

            window.location.href =
            "historial.html";

        },1000);


    }catch(error){

        console.log(error);

        alert(
            "Error realizando compra"
        );

    }

}