// =====================================
// MOSTRAR CLAVE ADMIN
// =====================================

function mostrarClaveAdmin(){

    const rol =
    document.getElementById(
        "rol"
    ).value;


    const claveAdmin =
    document.getElementById(
        "claveAdmin"
    );


    if(rol === "admin"){

        claveAdmin.style.display =
        "block";

    }else{

        claveAdmin.style.display =
        "none";

    }

}



// =====================================
// REGISTRO
// =====================================

async function register(event){

    event.preventDefault();


    const nombre =
    document.getElementById(
        "nombre"
    ).value;


    const correo =
    document.getElementById(
        "correo"
    ).value;


    const password =
    document.getElementById(
        "password"
    ).value;


    const rol =
    document.getElementById(
        "rol"
    ).value;


    const claveAdmin =
    document.getElementById(
        "claveAdmin"
    ).value;


    try{


        const respuesta =
        await fetch(

            `${API}/register`,

            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    nombre,
                    correo,
                    password,
                    rol,
                    claveAdmin

                })

            }

        );


        const datos =
        await respuesta.json();


        // ERROR
        if(!respuesta.ok){

            alert(
                datos.mensaje
            );

            return;

        }


        alert(
            "Usuario registrado correctamente"
        );


        // REDIRECCION
        window.location.href =
        "login.html";


    }catch(error){

        console.log(error);

        alert(
            "Error registrando usuario"
        );

    }

}