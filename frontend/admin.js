// =====================================
// INICIO
// =====================================

window.onload = ()=>{

    verificarAdmin();

    obtenerEstadisticas();

};



// =====================================
// VERIFICAR ADMIN
// =====================================

function verificarAdmin(){

    const usuario =
    obtenerUsuario();


    if(

        !usuario ||

        usuario.rol !== "admin"

    ){

        window.location.href =
        "index.html";

    }

}



// =====================================
// OBTENER ESTADISTICAS
// =====================================

async function obtenerEstadisticas(){

    try{


        const respuesta =
        await fetch(

            `${API}/estadisticas`

        );


        const datos =
        await respuesta.json();


        mostrarEstadisticas(
            datos
        );


    }catch(error){

        console.log(error);

    }

}



// =====================================
// MOSTRAR ESTADISTICAS
// =====================================

function mostrarEstadisticas(datos){

    const contenedor =
    document.getElementById(
        "estadisticas"
    );


    contenedor.innerHTML = `

        <div class="card-admin">

            <h2>

                Productos

            </h2>

            <p>

                ${datos.totalProductos}

            </p>

        </div>



        <div class="card-admin">

            <h2>

                Compras

            </h2>

            <p>

                ${datos.totalCompras}

            </p>

        </div>



        <div class="card-admin">

            <h2>

                Ingresos

            </h2>

            <p>

                Q${Number(datos.ingresos).toFixed(2)}

            </p>

        </div>



        <div class="card-admin">

            <h2>

                Productos Agotados

            </h2>

            <p>

                ${datos.agotados}

            </p>

        </div>

    `;

}