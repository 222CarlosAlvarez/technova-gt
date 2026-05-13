// ======================================
// VARIABLES
// ======================================

let carrito =
JSON.parse(

    localStorage.getItem("carrito")

) || [];



// ======================================
// INICIO
// ======================================

window.onload = ()=>{

    verificarLogin();

    mostrarCarrito();

};



// ======================================
// MOSTRAR CARRITO
// ======================================

function mostrarCarrito(){

    const contenedor =
    document.getElementById(
        "contenedorCarrito"
    );


    const totalHTML =
    document.getElementById(
        "totalCarrito"
    );


    contenedor.innerHTML =
    "";


    let total = 0;


    if(carrito.length === 0){

        contenedor.innerHTML = `

            <h3>
                Tu carrito está vacío
            </h3>

        `;


        totalHTML.innerText =
        "Q0";

        return;

    }


    carrito.forEach((producto,index)=>{


        const subtotal =

            Number(producto.precio) *
            Number(producto.cantidad);


        total += subtotal;


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
                    Q${producto.precio}
                </p>


                <p>
                    Cantidad:
                    ${producto.cantidad}
                </p>


                <p>
                    Subtotal:
                    Q${subtotal}
                </p>


                <button
                    class="btn-eliminar"
                    onclick="eliminarDelCarrito(${index})"
                >
                    Eliminar
                </button>


            </div>

        `;

    });


    totalHTML.innerText =
    `Q${total}`;

}



// ======================================
// ELIMINAR PRODUCTO
// ======================================

function eliminarDelCarrito(index){

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

    // OBTENER CARRITO
    const carrito = JSON.parse(

        localStorage.getItem(
            "carrito"
        )

    ) || [];


    // OBTENER USUARIO
    const usuario =
    obtenerUsuario();


    // VALIDAR
    if(carrito.length === 0){

        alert(
            "Carrito vacío"
        );

        return;

    }


    try{

        let subtotalGeneral = 0;


        // RECORRER PRODUCTOS
        for(const producto of carrito){


            const precio =
            Number(producto.precio);


            const cantidad =
            Number(producto.cantidad);


            // VALIDAR
            if(

                isNaN(precio) ||
                isNaN(cantidad)

            ){

                console.log(producto);

                continue;

            }


            // CALCULAR SUBTOTAL
            subtotalGeneral +=
            precio * cantidad;


            // ENVIAR AL BACKEND
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
                    datos.mensaje
                );

                return;

            }

        }


        // IVA
        const ivaGeneral =
        subtotalGeneral * 0.12;


        // TOTAL
        const totalGeneral =
        subtotalGeneral + ivaGeneral;


        // MENSAJE
        alert(

`Compra realizada correctamente

Subtotal: Q${subtotalGeneral.toFixed(2)}

IVA 12%: Q${ivaGeneral.toFixed(2)}

Total: Q${totalGeneral.toFixed(2)}`

        );


        // LIMPIAR
        localStorage.removeItem(
            "carrito"
        );


        // RECARGAR
        window.location.reload();


    }catch(error){

        console.log(error);

        alert(
            "Error realizando compra"
        );

    }

}