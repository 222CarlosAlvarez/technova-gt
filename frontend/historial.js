const usuario =
obtenerUsuario();

verificarLogin();


// =========================
// CARGAR HISTORIAL
// =========================

async function cargarHistorial(){

    try{

        const respuesta =
        await fetch(

            `${API}/compras/${usuario.id}`

        );

        const compras =
        await respuesta.json();


        const contenedor =
        document.getElementById(
            "historial"
        );

        contenedor.innerHTML = "";


        if(compras.length === 0){

            contenedor.innerHTML = `

            <p>

            No hay compras

            </p>

            `;

            return;

        }


        compras.forEach(compra=>{

            const productos =
            JSON.parse(
                compra.productos
            );

            contenedor.innerHTML += `

            <div class="card">

                <div class="card-content">

                    <h2>

                    Compra #${compra.id}

                    </h2>

                    <p>

                    Fecha:
                    ${compra.fecha}

                    </p>

                    <p>

                    Total:
                    Q${Number(compra.total)
                    .toFixed(2)}

                    </p>

                    <hr>

                    <h3>

                    Productos:

                    </h3>

                    ${productos.map(producto=>

                        `

                        <p>

                        • ${producto.nombre}
                        - Q${producto.precio}

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


cargarHistorial();