const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// DATABASE
// =========================

const db =
new sqlite3.Database("./database.db");


// =========================
// TABLA USUARIOS
// =========================

db.run(`

CREATE TABLE IF NOT EXISTS usuarios(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT,

    correo TEXT UNIQUE,

    password TEXT,

    rol TEXT

)

`);


// =========================
// TABLA PRODUCTOS
// =========================

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


// =========================
// TABLA COMPRAS
// =========================

db.run(`

CREATE TABLE IF NOT EXISTS compras(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    usuario_id INTEGER,

    productos TEXT,

    total REAL,

    fecha TEXT

)

`);

db.run(`

CREATE TABLE IF NOT EXISTS ventas(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    producto_id INTEGER,

    nombre_producto TEXT,

    precio REAL,

    cantidad INTEGER,

    usuario_id INTEGER,

    fecha TEXT

)

`);


// =========================
// INSERTAR PRODUCTOS DEMO
// =========================

db.get(

    `
    SELECT COUNT(*) as total
    FROM productos
    `,

    [],

    (err,row)=>{

        if(err){

            console.log(err);

            return;
        }

        if(row.total === 0){

            db.run(`

            INSERT INTO productos
            (
                nombre,
                precio,
                cantidad,
                categoria,
                imagen
            )

            VALUES

            (
                'Laptop ASUS ROG',
                9500,
                5,
                'Laptops',
                'https://images.unsplash.com/photo-1517336714739-489689fd1ca8'
            ),

            (
                'iPhone 15 Pro',
                12500,
                8,
                'Celulares',
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
            ),

            (
                'AirPods Pro',
                2200,
                10,
                'Audifonos',
                'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5'
            ),

            (
                'Monitor Gamer MSI',
                3200,
                7,
                'Monitores',
                'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf'
            ),

            (
                'Teclado Mecánico RGB',
                850,
                15,
                'Accesorios',
                'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae'
            )

            `);

            console.log(
                "Productos demo insertados"
            );

        }

    }

);


// =========================
// CLAVE ADMIN
// =========================

const ADMIN_PASSWORD =
"123456";


// =========================
// REGISTER
// =========================

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
                "Clave de administrador incorrecta"

            });

        }

    }


    // ENCRIPTAR
    const passwordHash =
    bcrypt.hashSync(password,10);


    // INSERTAR
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
// =========================
// LOGIN
// =========================

app.post("/login",(req,res)=>{

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

        (err,usuario)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            if(!usuario){

                return res.status(404).json({

                    mensaje:
                    "Usuario no encontrado"

                });

            }

            // VALIDAR PASSWORD
            const validar =
            bcrypt.compareSync(

                password,
                usuario.password

            );

            if(!validar){

                return res.status(401).json({

                    mensaje:
                    "Contraseña incorrecta"

                });

            }

            res.json({

                mensaje:
                "Login correcto",

                usuario

            });

        }

    );

});


// =========================
// OBTENER PRODUCTOS
// =========================

app.get("/productos",(req,res)=>{

    db.all(

        `
        SELECT * FROM productos
        `,

        [],

        (err,productos)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(productos);

        }

    );

});


// =========================
// AGREGAR PRODUCTO
// =========================

app.post("/productos",(req,res)=>{

    const {

        nombre,
        precio,
        cantidad,
        categoria,
        imagen

    } = req.body;

    // VALIDAR
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
            imagen || ""

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


// =========================
// ELIMINAR PRODUCTO
// =========================

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

// =========================
// EDITAR PRODUCTO
// =========================

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

// =========================
// COMPRAR
// =========================

app.post("/comprar",(req,res)=>{

    const {

        usuario_id,
        carrito,
        total

    } = req.body;

    // VALIDAR
    if(
        !usuario_id ||
        !carrito ||
        carrito.length === 0
    ){

        return res.status(400).json({

            mensaje:
            "Carrito vacío"

        });

    }

    const fecha =
    new Date()
    .toLocaleString();

    // GUARDAR COMPRA
    db.run(

        `
        INSERT INTO compras
        (
            usuario_id,
            productos,
            total,
            fecha
        )
        VALUES(?,?,?,?)
        `,

        [

            usuario_id,

            JSON.stringify(carrito),

            total,

            fecha

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            // DESCONTAR STOCK
            carrito.forEach(producto=>{

                db.run(

                    `
                    UPDATE productos
                    SET cantidad = cantidad - 1
                    WHERE id = ?
                    `,

                    [producto.id]

                );

            });

            res.json({

                mensaje:
                "Compra realizada"

            });

        }

    );

});


// =========================
// HISTORIAL COMPRAS
// =========================

app.get("/compras/:usuario_id",(req,res)=>{

    const usuario_id =
    req.params.usuario_id;

    db.all(

        `
        SELECT * FROM compras
        WHERE usuario_id = ?
        ORDER BY id DESC
        `,

        [usuario_id],

        (err,compras)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(compras);

        }

    );

});

// =========================
// OBTENER VENTAS
// =========================

app.get("/ventas",(req,res)=>{

    db.all(

        `
        SELECT * FROM ventas
        ORDER BY id DESC
        `,

        [],

        (err,ventas)=>{

            if(err){

                return res.status(500).json({

                    error:err.message

                });

            }

            res.json(ventas);

        }

    );

});


// =========================
// SERVIDOR
// =========================

app.listen(3000,()=>{

    console.log(
        "Servidor funcionando en puerto 3000"
    );

});