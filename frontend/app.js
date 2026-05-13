const API =
"https://technova-backend-bdgq.onrender.com";



// =====================================
// GUARDAR USUARIO
// =====================================

function guardarUsuario(usuario){

    localStorage.setItem(

        "usuario",

        JSON.stringify(usuario)

    );

}



// =====================================
// OBTENER USUARIO
// =====================================

function obtenerUsuario(){

    return JSON.parse(

        localStorage.getItem(
            "usuario"
        )

    );

}



// =====================================
// CERRAR SESION
// =====================================

function logout(){

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
    "login.html";

}



// =====================================
// VERIFICAR LOGIN
// =====================================

function verificarLogin(){

    const usuario =
    obtenerUsuario();


    if(!usuario){

        window.location.href =
        "login.html";

    }

}



// =====================================
// MOSTRAR LINKS ADMIN
// =====================================

function mostrarLinksAdmin(idContenedor){

    const usuario =
    obtenerUsuario();


    const contenedor =
    document.getElementById(
        idContenedor
    );


    if(

        usuario &&
        usuario.rol === "admin"

    ){

        contenedor.innerHTML = `

            <a href="admin.html">

                Admin

            </a>

            <a href="inventario.html">

                Inventario

            </a>

        `;

    }

}