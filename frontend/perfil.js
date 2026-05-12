// ======================================
// INICIO
// ======================================

window.onload = ()=>{

    verificarLogin();

    cargarPerfil();

    cargarCompras();

};



// ======================================
// CARGAR PERFIL
// ======================================

function cargarPerfil(){

    const usuario =
    obtenerUsuario();


    document.getElementById(
        "nombreUsuario"
    ).innerText =
    usuario.nombre;


    document.getElementById(
        "correoUsuario"
    ).innerText =
    usuario.correo;


    document.getElementById(
        "rolUsuario"
    ).innerText =
    usuario.rol;

}



// ======================================
// CARGAR COMPRAS
// ======================================

async function cargarCompras(){

    const usuario =
    obtenerUsuario();


    try{

        const respuesta =
        await fetch(

            `${API}/compras/${usuario.id}`

        );


        const compras =
        await respuesta.json();


        const historial =
        document.getElementById(
            "historialPerfil"
        );


        historial.innerHTML =
        "";


        // SI NO HAY COMPRAS
        if(compras.length === 0){

            historial.innerHTML = `

                <h3>
                    No hay compras registradas
                </h3>

            `;

            return;

        }


        let totalGastado = 0;


        compras.forEach((compra)=>{


            totalGastado +=
            Number(compra.total);


            historial.innerHTML += `

                <div class="card-producto">


                    <h3>
                        ${compra.nombre_producto}
                    </h3>


                    <p>
                        Cantidad:
                        ${compra.cantidad}
                    </p>


                    <p>
                        Precio:
                        Q${compra.precio}
                    </p>


                    <p>
    Subtotal:
    Q${compra.subtotal}
</p>

<p>
    IVA:
    Q${compra.iva}
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


        // RESUMEN
        document.getElementById(
            "cantidadCompras"
        ).innerText =
        compras.length;


        document.getElementById(
            "totalGastado"
        ).innerText =
        `Q${totalGastado}`;


    }catch(error){

        console.log(error);

        alert(
            "Error cargando perfil"
        );

    }

}