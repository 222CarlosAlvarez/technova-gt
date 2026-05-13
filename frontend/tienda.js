// =====================================
// VARIABLES
// =====================================

let productos = [];



// =====================================
// INICIO
// =====================================

window.onload = ()=>{

    verificarLogin();

    mostrarLinksAdmin(
        "adminLinks"
    );

    obtenerProductos();

};



// =====================================
// OBTENER PRODUCTOS
// =====================================

async function obtenerProductos(){

    try{


        const respuesta =
        await fetch(

            `${API}/productos`

        );


        productos =
        await respuesta.json();


        mostrarProductos();


    }catch(error){

        console.log(error);

    }

}



// =====================================
// MOSTRAR PRODUCTOS
// =====================================

function mostrarProductos(){

    const contenedor =
    document.getElementById(
        "contenedorProductos"
    );


    contenedor.innerHTML =
    "";


    // SIN PRODUCTOS
    if(productos.length === 0){

        contenedor.innerHTML = `

            <h2>
                No hay productos
            </h2>

        `;

        return;

    }


    // RECORRER PRODUCTOS
    productos.forEach(producto=>{


        contenedor.innerHTML += `

            <div class="card-producto">


                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <h2>

                    ${producto.nombre}

                </h2>


                <p>

                    Categoría:
                    ${producto.categoria}

                </p>


                <p>

                    Precio:
                    Q${Number(producto.precio).toFixed(2)}

                </p>


                <p>

                    Stock:

                    ${
                        producto.cantidad <= 0

                        ?

                        `<span class="sin-stock">
                            Agotado
                        </span>`

                        :

                        producto.cantidad
                    }

                </p>


                ${
                    producto.cantidad <= 0

                    ?

                    `

                    <button disabled>

                        Sin Stock

                    </button>

                    `

                    :

                    `

                    <button
                        onclick='agregarCarrito(${JSON.stringify(producto)})'
                    >

                        Agregar al Carrito

                    </button>

                    `
                }


            </div>

        `;

    });

}



// =====================================
// AGREGAR CARRITO
// =====================================

function agregarCarrito(producto){

    let carrito = JSON.parse(

        localStorage.getItem(
            "carrito"
        )

    ) || [];


    // VALIDAR SI YA EXISTE
    const existe =
    carrito.find(

        p => p.id === producto.id

    );


    if(existe){

        // VALIDAR STOCK
        if(
            existe.cantidad >=
            producto.cantidad
        ){

            alert(
                "No hay más stock disponible"
            );

            return;

        }


        existe.cantidad += 1;


    }else{


        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            precio: producto.precio,

            imagen: producto.imagen,

            cantidad: 1

        });

    }


    // GUARDAR
    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );


    alert(
        "Producto agregado al carrito"
    );

}