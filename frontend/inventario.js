// ======================================
// VARIABLES
// ======================================

let productosGlobal =
[];



// ======================================
// INICIO
// ======================================

window.onload = ()=>{

    verificarAdmin();

    cargarInventario();

};



// ======================================
// CARGAR INVENTARIO
// ======================================

async function cargarInventario(){

    try{

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


        actualizarResumen(
            productos
        );

    }catch(error){

        console.log(error);

        alert(
            "Error cargando inventario"
        );

    }

}



// ======================================
// MOSTRAR PRODUCTOS
// ======================================

function mostrarProductos(productos){

    const tabla =
    document.getElementById(
        "tablaProductos"
    );


    tabla.innerHTML =
    "";


    productos.forEach((producto)=>{


        tabla.innerHTML += `

            <tr>


                <td>
                    ${producto.id}
                </td>


                <td>
                    ${producto.nombre}
                </td>


                <td>
                    ${producto.categoria}
                </td>


                <td>
                    Q${producto.precio}
                </td>


                <td>

                    ${
                        producto.cantidad <= 0

                        ?

                        `<span class="sin-stock">
                            Sin Stock
                        </span>`

                        :

                        producto.cantidad
                    }

                </td>


            </tr>

        `;

    });

}



// ======================================
// FILTRAR CATEGORIA
// ======================================

function filtrarCategoria(){

    const texto =
    document.getElementById(
        "buscarCategoria"
    ).value.toLowerCase();


    const filtrados =
    productosGlobal.filter((producto)=>{


        return producto.categoria
        .toLowerCase()
        .includes(texto);

    });


    mostrarProductos(
        filtrados
    );


    actualizarResumen(
        filtrados
    );

}



// ======================================
// ACTUALIZAR RESUMEN
// ======================================

function actualizarResumen(productos){

    document.getElementById(
        "totalProductos"
    ).innerText =
    productos.length;


    const sinStock =
    productos.filter((p)=>{

        return p.cantidad <= 0;

    });


    document.getElementById(
        "sinStock"
    ).innerText =
    sinStock.length;

}