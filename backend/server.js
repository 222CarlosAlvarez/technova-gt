const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;



// =====================================
// MIDDLEWARES
// =====================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



// =====================================
// DATABASE
// =====================================

const db = new sqlite3.Database(
    "./database.db",
    (err) => {

        if (err) {

            console.log(err);

        } else {

            console.log("SQLite conectado");

        }

    }
);



// =====================================
// CREAR TABLAS
// =====================================

db.serialize(() => {

    // USUARIOS
    db.run(`

        CREATE TABLE IF NOT EXISTS usuarios(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nombre TEXT NOT NULL,

            correo TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            rol TEXT NOT NULL

        )

    `);


    // PRODUCTOS
    db.run(`

        CREATE TABLE IF NOT EXISTS productos(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nombre TEXT NOT NULL,

            precio REAL NOT NULL,

            cantidad INTEGER NOT NULL,

            categoria TEXT NOT NULL,

            imagen TEXT

        )

    `);


    // COMPRAS
    db.run(`

        CREATE TABLE IF NOT EXISTS compras(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            usuario_id INTEGER,

            producto_id INTEGER,

            nombre_producto TEXT,

            precio REAL,

            cantidad INTEGER,

            subtotal REAL,

            iva REAL,

            total REAL,

            fecha DATETIME DEFAULT CURRENT_TIMESTAMP

        )

    `);

});



// =====================================
// RUTA PRINCIPAL
// =====================================

app.get("/", (req, res) => {

    res.json({

        mensaje: "API TECHNOVA funcionando"

    });

});



// =====================================
// REGISTER
// =====================================

app.post("/register", async (req, res) => {

    try {

        const {
            nombre,
            correo,
            password,
            rol,
            claveAdmin
        } = req.body;


        if (
            !nombre ||
            !correo ||
            !password ||
            !rol
        ) {

            return res.status(400).json({

                mensaje: "Completa todos los campos"

            });

        }


        // VALIDAR ADMIN
        if (rol === "admin") {

            if (claveAdmin !== "123456") {

                return res.status(401).json({

                    mensaje: "Clave administrador incorrecta"

                });

            }

        }


        const passwordHash =
            await bcrypt.hash(password, 10);


        db.run(

            `
            INSERT INTO usuarios(
                nombre,
                correo,
                password,
                rol
            )
            VALUES(?,?,?,?)
            `,

            [
                nombre,
                correo,
                passwordHash,
                rol
            ],

            function (err) {

                if (err) {

                    return res.status(500).json({

                        mensaje: "Correo ya registrado"

                    });

                }


                res.json({

                    mensaje: "Usuario registrado"

                });

            }

        );

    } catch (error) {

        res.status(500).json({

            mensaje: "Error servidor"

        });

    }

});



// =====================================
// LOGIN
// =====================================

app.post("/login", (req, res) => {

    const {
        correo,
        password
    } = req.body;


    db.get(

        `
        SELECT * FROM usuarios
        WHERE correo = ?
        `,

        [correo],

        async (err, usuario) => {

            if (err) {

                return res.status(500).json({

                    mensaje: "Error servidor"

                });

            }


            if (!usuario) {

                return res.status(404).json({

                    mensaje: "Usuario no encontrado"

                });

            }


            const valido =
                await bcrypt.compare(
                    password,
                    usuario.password
                );


            if (!valido) {

                return res.status(401).json({

                    mensaje: "Contraseña incorrecta"

                });

            }


            res.json({

                mensaje: "Login correcto",

                usuario: {

                    id: usuario.id,

                    nombre: usuario.nombre,

                    correo: usuario.correo,

                    rol: usuario.rol

                }

            });

        }

    );

});



// =====================================
// OBTENER PRODUCTOS
// =====================================

app.get("/productos", (req, res) => {

    db.all(

        `
        SELECT *
        FROM productos
        ORDER BY id DESC
        `,

        [],

        (err, productos) => {

            if (err) {

                return res.status(500).json({

                    mensaje: "Error obteniendo productos"

                });

            }


            res.json(productos);

        }

    );

});



// =====================================
// AGREGAR PRODUCTO
// =====================================

app.post("/productos", (req, res) => {

    const {
        nombre,
        precio,
        cantidad,
        categoria,
        imagen
    } = req.body;


    if (
        !nombre ||
        !precio ||
        !cantidad ||
        !categoria
    ) {

        return res.status(400).json({

            mensaje: "Completa todos los campos"

        });

    }


    db.run(

        `
        INSERT INTO productos(
            nombre,
            precio,
            cantidad,
            categoria,
            imagen
        )
        VALUES(?,?,?,?,?)
        `,

        [
            nombre,
            precio,
            cantidad,
            categoria,
            imagen
        ],

        function (err) {

            if (err) {

                return res.status(500).json({

                    mensaje: "Error agregando producto"

                });

            }


            res.json({

                mensaje: "Producto agregado"

            });

        }

    );

});



// =====================================
// EDITAR PRODUCTO
// =====================================

app.put("/productos/:id", (req, res) => {

    const id = req.params.id;


    const {
        nombre,
        precio,
        cantidad,
        categoria,
        imagen
    } = req.body;


    db.run(

        `
        UPDATE productos
        SET

        nombre = ?,
        precio = ?,
        cantidad = ?,
        categoria = ?,
        imagen = ?

        WHERE id = ?
        `,

        [
            nombre,
            precio,
            cantidad,
            categoria,
            imagen,
            id
        ],

        function (err) {

            if (err) {

                return res.status(500).json({

                    mensaje: "Error actualizando producto"

                });

            }


            res.json({

                mensaje: "Producto actualizado"

            });

        }

    );

});



// =====================================
// ELIMINAR PRODUCTO
// =====================================

app.delete("/productos/:id", (req, res) => {

    const id = req.params.id;


    db.run(

        `
        DELETE FROM productos
        WHERE id = ?
        `,

        [id],

        function (err) {

            if (err) {

                return res.status(500).json({

                    mensaje: "Error eliminando producto"

                });

            }


            res.json({

                mensaje: "Producto eliminado"

            });

        }

    );

});



// =====================================
// REALIZAR COMPRA
// =====================================

app.post("/compras", (req, res) => {

    const {
        usuario_id,
        producto_id,
        nombre_producto,
        precio,
        cantidad
    } = req.body;


    // VALIDAR PRODUCTO
    db.get(

        `
        SELECT *
        FROM productos
        WHERE id = ?
        `,

        [producto_id],

        (err, producto) => {

            if (err) {

                return res.status(500).json({

                    mensaje: "Error servidor"

                });

            }


            if (!producto) {

                return res.status(404).json({

                    mensaje: "Producto no encontrado"

                });

            }


            // VALIDAR STOCK
            if (
                producto.cantidad < cantidad
            ) {

                return res.status(400).json({

                    mensaje: "Stock insuficiente"

                });

            }


            // CALCULOS
            const subtotal =
                Number(precio) *
                Number(cantidad);


            const iva =
                subtotal * 0.12;


            const total =
                subtotal + iva;


            // GUARDAR COMPRA
            db.run(

                `
                INSERT INTO compras(

                    usuario_id,
                    producto_id,
                    nombre_producto,
                    precio,
                    cantidad,
                    subtotal,
                    iva,
                    total

                )
                VALUES(?,?,?,?,?,?,?,?)
                `,

                [
                    usuario_id,
                    producto_id,
                    nombre_producto,
                    precio,
                    cantidad,
                    subtotal,
                    iva,
                    total
                ],

                function (err) {

                    if (err) {

                        return res.status(500).json({

                            mensaje: "Error guardando compra"

                        });

                    }


                    // DESCONTAR STOCK
                    db.run(

                        `
                        UPDATE productos
                        SET cantidad = cantidad - ?
                        WHERE id = ?
                        `,

                        [
                            cantidad,
                            producto_id
                        ],

                        function (err) {

                            if (err) {

                                return res.status(500).json({

                                    mensaje: "Error actualizando inventario"

                                });

                            }


                            res.json({

                                mensaje: "Compra realizada",

                                subtotal,
                                iva,
                                total

                            });

                        }

                    );

                }

            );

        }

    );

});



// =====================================
// HISTORIAL COMPRAS
// =====================================

app.get("/compras/:usuario_id", (req, res) => {

    const usuario_id =
        req.params.usuario_id;


    db.all(

        `
        SELECT *
        FROM compras
        WHERE usuario_id = ?
        ORDER BY fecha DESC
        `,

        [usuario_id],

        (err, compras) => {

            if (err) {

                return res.status(500).json({

                    mensaje: "Error obteniendo historial"

                });

            }


            res.json(compras);

        }

    );

});



// =====================================
// ESTADISTICAS ADMIN
// =====================================

app.get("/estadisticas", (req, res) => {

    const datos = {};


    db.get(

        `
        SELECT COUNT(*) AS totalProductos
        FROM productos
        `,

        [],

        (err, row) => {

            datos.totalProductos =
                row.totalProductos;


            db.get(

                `
                SELECT COUNT(*) AS totalCompras
                FROM compras
                `,

                [],

                (err, row2) => {

                    datos.totalCompras =
                        row2.totalCompras;


                    db.get(

                        `
                        SELECT SUM(total) AS ingresos
                        FROM compras
                        `,

                        [],

                        (err, row3) => {

                            datos.ingresos =
                                row3.ingresos || 0;


                            db.get(

                                `
                                SELECT COUNT(*) AS agotados
                                FROM productos
                                WHERE cantidad <= 0
                                `,

                                [],

                                (err, row4) => {

                                    datos.agotados =
                                        row4.agotados;


                                    res.json(datos);

                                }

                            );

                        }

                    );

                }

            );

        }

    );

});



// =====================================
// SERVIDOR
// =====================================

app.listen(PORT, () => {

    console.log(

        `Servidor funcionando en puerto ${PORT}`

    );

});