// =====================================
// INICIO
// =====================================

window.onload = ()=>{

    verificarLogin();

    mostrarLinksAdmin(
        "adminLinks"
    );

    mostrarPerfil();

};



// =====================================
// MOSTRAR PERFIL
// =====================================

function mostrarPerfil(){

    const usuario =
    obtenerUsuario();


    const contenedor =
    document.getElementById(
        "datosPerfil"
    );


    contenedor.innerHTML = `

        <div class="perfil-info">


            <p>

                <strong>
                    ID:
                </strong>

                ${usuario.id}

            </p>


            <p>

                <strong>
                    Nombre:
                </strong>

                ${usuario.nombre}

            </p>


            <p>

                <strong>
                    Correo:
                </strong>

                ${usuario.correo}

            </p>


            <p>

                <strong>
                    Rol:
                </strong>

                ${usuario.rol}

            </p>


        </div>

    `;

}