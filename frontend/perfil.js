const usuario =
obtenerUsuario();


// =========================
// VALIDAR LOGIN
// =========================

verificarLogin();


// =========================
// MOSTRAR DATOS
// =========================

function cargarPerfil(){

    document.getElementById(
        "nombre"
    ).innerText =
    usuario.nombre;


    document.getElementById(
        "correo"
    ).innerText =
    usuario.correo;


    document.getElementById(
        "rol"
    ).innerText =
    usuario.rol;

}


// =========================
// CARGAR COMPRAS
// =========================

async function cargarCompras(){

    try{

        const respuesta =
        await fetch(

            `${API}/compras/${usuario.id}`

        );

        const compras =
        await respuesta.json();


        // =========================
        // RESUMEN
        // =========================

        document.getElementById(
            "cantidadCompras"
        ).innerText =
        compras.length;


        let total = 0;

        compras.forEach(compra=>{

            total += Number(
                compra.total
            );

        });


        document.getElementById(
            "totalGastado"
        ).innerText =
        formatoMoneda(total);


        // =========================
        // ULTIMAS COMPRAS
        // =========================

        const contenedor =
        document.getElementById(
            "ultimasCompras"
        );

        contenedor.innerHTML = "";


        if(compras.length === 0){

            contenedor.innerHTML = `

            <p>

            No hay compras realizadas

            </p>

            `;

            return;

        }


        compras.slice(0,5)
        .forEach(compra=>{

            const productos =
            JSON.parse(
                compra.productos
            );

            contenedor.innerHTML += `

            <div class="card">

                <div class="card-content">

                    <h3>

                    Compra #${compra.id}

                    </h3>

                    <p>

                    Fecha:
                    ${compra.fecha}

                    </p>

                    <p>

                    Total:
                    ${formatoMoneda(
                        compra.total
                    )}

                    </p>

                    <h4>

                    Productos:

                    </h4>

                    ${productos.map(producto=>

                        `
                        <p>

                        • ${producto.nombre}

                        </p>
                        `

                    ).join("")}

                </div>

            </div>

            `;

        });

    }catch(error){

        console.log(error);

    }

}


// =========================
// INICIAR
// =========================

cargarPerfil();

cargarCompras();