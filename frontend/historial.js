// =====================================
// INICIO
// =====================================

window.onload = ()=>{

    verificarLogin();

    mostrarLinksAdmin(
        "adminLinks"
    );

    obtenerHistorial();

};



// =====================================
// OBTENER HISTORIAL
// =====================================

async function obtenerHistorial(){

    const usuario =
    obtenerUsuario();


    try{


        const respuesta =
        await fetch(

            `${API}/compras/${usuario.id}`

        );


        const compras =
        await respuesta.json();


        mostrarHistorial(
            compras
        );


    }catch(error){

        console.log(error);

    }

}



// =====================================
// MOSTRAR HISTORIAL
// =====================================

function mostrarHistorial(compras){

    const contenedor =
    document.getElementById(
        "contenedorHistorial"
    );


    contenedor.innerHTML =
    "";


    // SIN COMPRAS
    if(compras.length === 0){

        contenedor.innerHTML = `

            <h2>
                No hay compras registradas
            </h2>

        `;

        return;

    }


    // RECORRER COMPRAS
    compras.forEach(compra=>{


        contenedor.innerHTML += `

            <div class="card-historial">


                <h2>

                    ${compra.nombre_producto}

                </h2>


                <p>

                    Precio:
                    Q${Number(compra.precio).toFixed(2)}

                </p>


                <p>

                    Cantidad:
                    ${compra.cantidad}

                </p>


                <p>

                    Subtotal:
                    Q${Number(compra.subtotal).toFixed(2)}

                </p>


                <p>

                    IVA:
                    Q${Number(compra.iva).toFixed(2)}

                </p>


                <h3>

                    Total:
                    Q${Number(compra.total).toFixed(2)}

                </h3>


                <p>

                    Fecha:
                    ${compra.fecha}

                </p>


            </div>

        `;

    });

}