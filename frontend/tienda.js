// ======================================
// VARIABLES
// ======================================

let productosGlobal =
    [];



// ======================================
// INICIO
// ======================================

window.onload = () => {

    verificarLogin();

    mostrarLinksAdmin();

    cargarProductos();

};



// ======================================
// MOSTRAR LINKS ADMIN
// ======================================

function mostrarLinksAdmin() {

    const usuario =
        obtenerUsuario();


    const adminLinks =
        document.getElementById(
            "adminLinks"
        );


    if (
        usuario &&
        usuario.rol === "admin"
    ) {

        adminLinks.innerHTML = `

            <a href="admin.html">
                Administrador
            </a>

            <a href="inventario.html">
                Inventario
            </a>

        `;

    }

}



// ======================================
// CARGAR PRODUCTOS
// ======================================

async function cargarProductos() {

    try {

        const respuesta =
            await fetch(

                `${API}/productos`

            );


        const productos =
            await respuesta.json();


        productosGlobal =
            productos;


        mostrarProductos(
            productos
        );

    } catch (error) {

        console.log(error);

        alert(
            "Error cargando productos"
        );

    }

}



// ======================================
// MOSTRAR PRODUCTOS
// ======================================

function mostrarProductos(productos) {

    const contenedor =
        document.getElementById(
            "contenedorProductos"
        );


    contenedor.innerHTML =
        "";


    if (productos.length === 0) {

        contenedor.innerHTML = `

            <h3>
                No hay productos disponibles
            </h3>

        `;

        return;

    }


    productos.forEach((producto) => {


        contenedor.innerHTML += `

            <div class="card-producto">


                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <h3>
                    ${producto.nombre}
                </h3>


                <p>
                    Categoría:
                    ${producto.categoria}
                </p>


                <p>
                    Precio:
                    Q${producto.precio}
                </p>


                <p>

    Stock:

    ${producto.cantidad <= 0

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
                   onclick='agregarCarrito(
                   ${JSON.stringify(producto)}
                 )'
                 >
                 Agregar al Carrito
                 </button>

                 `
                }


            </div>

        `;

    });

}



// ======================================
// AGREGAR AL CARRITO
// ======================================

function agregarCarrito(producto) {

    let carrito =
        JSON.parse(

            localStorage.getItem(
                "carrito"
            )

        ) || [];


    // BUSCAR SI EXISTE
    const existe =
        carrito.find((item) => {

            return item.id === producto.id;

        });


    if (existe) {

        existe.cantidad += 1;

    } else {

        carrito.push({

            ...producto,

            cantidad: 1

        });

    }


    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );


    alert(
        "Producto agregado al carrito"
    );

}



// ======================================
// FILTRAR PRODUCTOS
// ======================================

function filtrarProductos() {

    const texto =
        document.getElementById(
            "buscador"
        ).value.toLowerCase();


    const filtrados =
        productosGlobal.filter((producto) => {


            return (

                producto.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.categoria
                    .toLowerCase()
                    .includes(texto)

            );

        });


    mostrarProductos(
        filtrados
    );

}