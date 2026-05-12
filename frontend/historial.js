// ======================================
// INICIO
// ======================================

window.onload = ()=>{

    verificarLogin();

    cargarHistorial();

};



// ======================================
// CARGAR HISTORIAL
// ======================================

async function cargarHistorial(){

    const usuario =
    obtenerUsuario();


    try{

        const respuesta =
        await fetch(

            `${API}/compras/${usuario.id}`

        );


        const compras =
        await respuesta.json();


        const contenedor =
        document.getElementById(
            "contenedorHistorial"
        );


        contenedor.innerHTML =
        "";


        // SI NO HAY COMPRAS
        if(compras.length === 0){

            contenedor.innerHTML = `

                <h3>
                    No hay compras registradas
                </h3>

            `;

            return;

        }


        compras.forEach((compra)=>{


            contenedor.innerHTML += `

                <div class="card-producto">


                    <h3>
                        ${compra.nombre_producto}
                    </h3>


                    <p>
                        Precio:
                        Q${compra.precio}
                    </p>


                    <p>
                        Cantidad:
                        ${compra.cantidad}
                    </p>


                    <p>
                        Total:
                        Q${compra.total}
                    </p>


                    <p>
                        Fecha:
                        ${compra.fecha}
                    </p>


                </div>

            `;

        });

    }catch(error){

        console.log(error);

        alert(
            "Error cargando historial"
        );

    }

}