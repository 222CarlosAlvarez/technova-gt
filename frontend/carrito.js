const usuario =
obtenerUsuario();


// =========================
// VERIFICAR LOGIN
// =========================

verificarLogin();


// =========================
// CARRITO
// =========================

let carrito =
obtenerCarrito();


// =========================
// MOSTRAR CARRITO
// =========================

function mostrarCarrito(){

    const contenedor =
    document.getElementById(
        "contenedorCarrito"
    );

    contenedor.innerHTML = "";

    let total = 0;


    // VACIO
    if(carrito.length === 0){

        contenedor.innerHTML = `

        <p>

        No hay productos en el carrito

        </p>

        `;

        return;

    }


    // RECORRER
    carrito.forEach((producto,index)=>{

        const precio =
        Number(producto.precio);

        total += precio;

        contenedor.innerHTML += `

        <div class="carrito-item">

            <div>

                <h3>

                ${producto.nombre}

                </h3>

                <p>

                Precio:
                ${formatoMoneda(precio)}

                </p>

            </div>

            <button
            onclick="eliminarProducto(${index})">

                Eliminar

            </button>

        </div>

        `;

    });


    // TOTAL
    contenedor.innerHTML += `

    <hr>

    <h2>

    Total:
    ${formatoMoneda(total)}

    </h2>

    <button onclick="comprar()">

        Finalizar Compra

    </button>

    <button onclick="vaciarCarrito()">

        Vaciar Carrito

    </button>

    `;

}


// =========================
// ELIMINAR PRODUCTO
// =========================

function eliminarProducto(index){

    carrito.splice(index,1);

    guardarCarrito(carrito);

    mostrarCarrito();

}


// =========================
// VACIAR
// =========================

function vaciarCarrito(){

    carrito = [];

    guardarCarrito(carrito);

    mostrarCarrito();

}


// =========================
// COMPRAR
// =========================

async function comprar(){

    if(carrito.length === 0){

        alert(
            "Carrito vacío"
        );

        return;

    }

    let total = 0;

    carrito.forEach(producto=>{

        total += Number(
            producto.precio
        );

    });


    try{

        const respuesta =
        await fetch(

            `${API}/comprar`,

            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    usuario_id:
                    usuario.id,

                    carrito,

                    total

                })

            }

        );

        const datos =
        await respuesta.json();

        alert(
            datos.mensaje
        );

        // LIMPIAR
        carrito = [];

        guardarCarrito(carrito);

        mostrarCarrito();

    }catch(error){

        console.log(error);

    }

}


// =========================
// INICIAR
// =========================

mostrarCarrito();