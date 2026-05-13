// ======================================
// VARIABLES
// ======================================

let carrito = [];



// ======================================
// INICIO
// ======================================

window.onload = ()=>{

    verificarLogin();

    mostrarLinksAdmin(
        "adminLinks"
    );

    cargarCarrito();

};



// ======================================
// CARGAR CARRITO
// ======================================

function cargarCarrito(){

    carrito = JSON.parse(

        localStorage.getItem(
            "carrito"
        )

    ) || [];


    mostrarCarrito();

}



// ======================================
// MOSTRAR CARRITO
// ======================================

function mostrarCarrito(){

    const contenedor =
    document.getElementById(
        "contenedorCarrito"
    );


    const totalTexto =
    document.getElementById(
        "totalCarrito"
    );


    contenedor.innerHTML =
    "";


    // CARRITO VACIO
    if(carrito.length === 0){

        contenedor.innerHTML = `

            <h2>
                Carrito vacío
            </h2>

        `;


        totalTexto.innerHTML =
        "Q0.00";


        return;

    }


    let subtotal = 0;


    // RECORRER PRODUCTOS
    carrito.forEach((producto,index)=>{


        const precio =
        Number(producto.precio) || 0;


        const cantidad =
        Number(producto.cantidad) || 0;


        const totalProducto =
        precio * cantidad;


        subtotal +=
        totalProducto;


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
                    Precio:
                    Q${precio.toFixed(2)}
                </p>


                <p>
                    Cantidad:
                    ${cantidad}
                </p>


                <p>
                    Subtotal:
                    Q${totalProducto.toFixed(2)}
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


    // IVA
    const iva =
    subtotal * 0.12;


    // TOTAL
    const total =
    subtotal + iva;


    totalTexto.innerHTML = `

        <p>

            Subtotal:
            Q${subtotal.toFixed(2)}

        </p>

        <p>

            IVA 12%:
            Q${iva.toFixed(2)}

        </p>

        <h2>

            Total:
            Q${total.toFixed(2)}

        </h2>

    `;

}



// ======================================
// ELIMINAR PRODUCTO
// ======================================

function eliminarProducto(index){

    carrito.splice(index,1);


    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );


    mostrarCarrito();

}



// ======================================
// COMPRAR TODO
// ======================================

async function comprarTodo(){


    // VALIDAR
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


        // RECORRER PRODUCTOS
        for(const producto of carrito){


            const precio =
            Number(producto.precio) || 0;


            const cantidad =
            Number(producto.cantidad) || 0;


            // SUBTOTAL
            subtotalGeneral +=
            precio * cantidad;


            // ENVIAR COMPRA
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


            const datos =
            await respuesta.json();


            // ERROR
            if(!respuesta.ok){

                alert(

                    datos.mensaje ||

                    "Error realizando compra"

                );

                return;

            }

        }


        // IVA
        const iva =
        subtotalGeneral * 0.12;


        // TOTAL
        const total =
        subtotalGeneral + iva;


        // MENSAJE
        alert(

`Compra realizada correctamente

Subtotal: Q${subtotalGeneral.toFixed(2)}

IVA 12%: Q${iva.toFixed(2)}

Total: Q${total.toFixed(2)}`

        );


        // LIMPIAR CARRITO
        carrito = [];


        localStorage.removeItem(
            "carrito"
        );


        // ACTUALIZAR
        mostrarCarrito();


        // RECARGAR
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