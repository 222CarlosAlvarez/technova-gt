const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;


// ======================================
// CORS
// ======================================

app.use(

    cors({

        origin: "*",

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]

    })

);


// ======================================
// MIDDLEWARES
// ======================================

app.use(express.json());

app.use(

    express.urlencoded({

        extended: true

    })

);


// ======================================
// DATABASE
// ======================================

const db = new sqlite3.Database(

    "./database.db",

    (err)=>{

        if(err){

            console.log(err);

        }else{

            console.log(
                "SQLite conectado"
            );

        }

    }

);


// ======================================
// CREAR TABLAS
// ======================================

db.serialize(()=>{


    // USUARIOS
    db.run(`

        CREATE TABLE IF NOT EXISTS usuarios(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nombre TEXT,

            correo TEXT UNIQUE,

            password TEXT,

            rol TEXT

        )

    `);


    // PRODUCTOS
    db.run(`

        CREATE TABLE IF NOT EXISTS productos(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nombre TEXT,

            precio REAL,

            cantidad INTEGER,

            categoria TEXT,

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

            total REAL,

            fecha DATETIME DEFAULT CURRENT_TIMESTAMP

        )

    `);

});


// ======================================
// RUTA PRINCIPAL
// ======================================

app.get("/",(req,res)=>{

    res.json({

        mensaje:
        "API TECHNOVA funcionando"

    });

});


// ======================================
// OBTENER PRODUCTOS
// ======================================

app.get("/productos",(req,res)=>{

    db.all(

        `
        SELECT *
        FROM productos
        ORDER BY id DESC
        `,

        [],

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});


// ======================================
// AGREGAR PRODUCTO
// ======================================

app.post("/productos",(req,res)=>{

    const {

        nombre,
        precio,
        cantidad,
        categoria,
        imagen

    } = req.body;


    if(
        !nombre ||
        !precio ||
        !cantidad ||
        !categoria
    ){

        return res.status(400).json({

            mensaje:
            "Completa todos los campos"

        });

    }


    db.run(

        `
        INSERT INTO productos
        (
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

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                mensaje:
                "Producto agregado"

            });

        }

    );

});


// ======================================
// EDITAR PRODUCTO
// ======================================

app.put("/productos/:id",(req,res)=>{

    const id =
    req.params.id;

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

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                mensaje:
                "Producto actualizado"

            });

        }

    );

});


// ======================================
// ELIMINAR PRODUCTO
// ======================================

app.delete("/productos/:id",(req,res)=>{

    const id =
    req.params.id;


    db.run(

        `
        DELETE FROM productos
        WHERE id = ?
        `,

        [id],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json({

                mensaje:
                "Producto eliminado"

            });

        }

    );

});


// ======================================
// REGISTER
// ======================================

app.post("/register",(req,res)=>{

    const {

        nombre,
        correo,
        password,
        rol,
        claveAdmin

    } = req.body;


    // VALIDAR
    if(
        !nombre ||
        !correo ||
        !password ||
        !rol
    ){

        return res.status(400).json({

            mensaje:
            "Completa todos los campos"

        });

    }


    // VALIDAR ADMIN
    if(rol === "admin"){

        if(claveAdmin !== "123456"){

            return res.status(401).json({

                mensaje:
                "Clave admin incorrecta"

            });

        }

    }


    // HASH PASSWORD
    const passwordHash =
    bcrypt.hashSync(password,10);


    // INSERTAR USUARIO
    db.run(

        `
        INSERT INTO usuarios
        (
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

        function(err){

            if(err){

                console.log(err);

                return res.status(500).json({

                    mensaje:
                    "Correo ya registrado"

                });

            }

            res.json({

                mensaje:
                "Usuario registrado correctamente"

            });

        }

    );

});


// ======================================
// LOGIN
// ======================================

app.post("/login",(req,res)=>{

    const {

        correo,
        password

    } = req.body;


    db.get(

        `
        SELECT *
        FROM usuarios
        WHERE correo = ?
        `,

        [correo],

        (err,usuario)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }


            if(!usuario){

                return res.status(401).json({

                    mensaje:
                    "Usuario no encontrado"

                });

            }


            const valido =
            bcrypt.compareSync(

                password,
                usuario.password

            );


            if(!valido){

                return res.status(401).json({

                    mensaje:
                    "Contraseña incorrecta"

                });

            }


            res.json({

                mensaje:
                "Login correcto",

                usuario:{

                    id:usuario.id,
                    nombre:usuario.nombre,
                    correo:usuario.correo,
                    rol:usuario.rol

                }

            });

        }

    );

});


// ======================================
// REALIZAR COMPRA
// ======================================

app.post("/compras",(req,res)=>{

    const {

        usuario_id,
        producto_id,
        nombre_producto,
        precio,
        cantidad

    } = req.body;


    const total =
    Number(precio) *
    Number(cantidad);


    db.run(

        `
        INSERT INTO compras
        (
            usuario_id,
            producto_id,
            nombre_producto,
            precio,
            cantidad,
            total
        )
        VALUES(?,?,?,?,?,?)
        `,

        [

            usuario_id,
            producto_id,
            nombre_producto,
            precio,
            cantidad,
            total

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }


            // RESTAR STOCK
            db.run(

                `
                UPDATE productos
                SET cantidad =
                cantidad - ?
                WHERE id = ?
                `,

                [

                    cantidad,
                    producto_id

                ]

            );


            res.json({

                mensaje:
                "Compra realizada"

            });

        }

    );

});


// ======================================
// HISTORIAL COMPRAS
// ======================================

app.get("/compras/:usuario_id",(req,res)=>{

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

        (err,rows)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(rows);

        }

    );

});


// ======================================
// INICIAR SERVIDOR
// ======================================

app.listen(PORT,()=>{

    console.log(

        `Servidor funcionando en puerto ${PORT}`

    );

});