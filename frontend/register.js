// =========================
// MOSTRAR CLAVE ADMIN
// =========================

const rolSelect =
document.getElementById(
    "rol"
);


rolSelect.addEventListener(
    "change",
    ()=>{

        const adminBox =
        document.getElementById(
            "adminBox"
        );

        if(
            rolSelect.value ===
            "admin"
        ){

            adminBox.style.display =
            "block";

        }

        else{

            adminBox.style.display =
            "none";

        }

    }
);


// =========================
// REGISTER
// =========================

async function register(){

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


    // VALIDAR
    if(
        !nombre ||
        !correo ||
        !password
    ){

        alert(
            "Completa todos los campos"
        );

        return;

    }


    // VALIDAR CLAVE ADMIN
    if(
        rol === "admin" &&
        !claveAdmin
    ){

        alert(
            "Debes ingresar la clave admin"
        );

        return;

    }


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
                datos.mensaje ||
                "Error al registrar"
            );

            return;

        }


        alert(
            "Cuenta creada correctamente"
        );


        // REDIRIGIR
        window.location.href =
        "login.html";

    }catch(error){

        console.log(error);

        alert(
            "Error del servidor"
        );

    }

}