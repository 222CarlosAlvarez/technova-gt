const API =
"http://localhost:3000";


// =========================
// USUARIO
// =========================

const usuario =
JSON.parse(

    localStorage.getItem(
        "usuario"
    )

);


// =========================
// VALIDAR ADMIN
// =========================

if(
    !usuario ||
    usuario.rol !== "admin"
){

    window.location.href =
    "login.html";

}


// =========================
// CARGAR PRODUCTOS
// =========================

async function cargarDashboard(){

    try{

        // PRODUCTOS
        const respuestaProductos =
        await fetch(
            `${API}/productos`
        );

        const productos =
        await respuestaProductos.json();


        // VENTAS
        const respuestaVentas =
        await fetch(
            `${API}/ventas`
        );

        const ventas =
        await respuestaVentas.json();


        // =========================
        // CALCULOS
        // =========================

        let totalStock = 0;

        let totalVentas = 0;


        productos.forEach(producto=>{

            totalStock += Number(
                producto.cantidad
            );

        });


        ventas.forEach(venta=>{

            totalVentas += Number(
                venta.precio
            );

        });


        // =========================
        // MOSTRAR
        // =========================

        document.getElementById(
            "totalProductos"
        ).innerText =
        productos.length;


        document.getElementById(
            "totalStock"
        ).innerText =
        totalStock;


        document.getElementById(
            "totalVentas"
        ).innerText =
        `Q${totalVentas.toFixed(2)}`;


        // =========================
        // PRODUCTOS
        // =========================

        const contenedor =
        document.getElementById(
            "productos"
        );

        contenedor.innerHTML = "";


        productos.forEach(producto=>{

            const agotado =
            producto.cantidad <= 0;

            contenedor.innerHTML += `

            <div class="card">

                <img
                src="${producto.imagen}">

                <div class="card-content">

                    <h3>

                    ${producto.nombre}

                    </h3>

                    <p>

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

                    <p style="
                    color:
                    ${agotado ? 'red':'green'};
                    font-weight:bold;
                    ">

                    ${agotado
                    ? 'AGOTADO'
                    : 'DISPONIBLE'}

                    </p>

                </div>

            </div>

            `;

        });

    }catch(error){

        console.log(error);

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

    window.location.href =
    "login.html";

}


// =========================
// INICIAR
// =========================

cargarDashboard();