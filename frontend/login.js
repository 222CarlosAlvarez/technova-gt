async function login(event){

    event.preventDefault();


    const correo =
    document.getElementById(
        "correo"
    ).value;


    const password =
    document.getElementById(
        "password"
    ).value;


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


        // ERROR
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


        // REDIRECCION
        window.location.href =
        "index.html";


    }catch(error){

        console.log(error);

        alert(
            "Error iniciando sesión"
        );

    }

}