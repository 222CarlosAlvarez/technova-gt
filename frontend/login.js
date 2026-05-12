// ======================================
// LOGIN
// ======================================

async function login(){

    const correo =
    document.getElementById(
        "correo"
    ).value;


    const password =
    document.getElementById(
        "password"
    ).value;


    // VALIDAR
    if(
        !correo ||
        !password
    ){

        alert(
            "Completa todos los campos"
        );

        return;

    }


    try{

        const respuesta =
        await fetch(

            `${API}/login`,

            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    correo,
                    password

                })

            }

        );


        const datos =
        await respuesta.json();


        // ERROR LOGIN
        if(!respuesta.ok){

            alert(
                datos.mensaje
            );

            return;

        }


        // GUARDAR USUARIO
        guardarUsuario(
            datos.usuario
        );


        alert(
            "Login correcto"
        );


        // ADMIN
        if(
            datos.usuario.rol ===
            "admin"
        ){

            window.location.href =
            "admin.html";

        }else{

            window.location.href =
            "index.html";

        }

    }catch(error){

        console.log(error);

        alert(
            "Error conexión servidor"
        );

    }

}