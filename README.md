# E-commerce API

#### Esta es una aplicacion backend de comercio electronico. Se administran usuarios con su respectivo rol, productos y carritos.


## Endpoints disponibles para administrar usuarios

#### GET: api/user/register : crea un nuevo usuario.
Ejemplo de uso:
```
{
    "firstName": "Manolo",
    "lastName": "Casca",
    "email": "manoloCasca@gmail.com",
    "age": 32,
    "role": "admin",
    "password": "passEjemplo123"
}
```
Respuesta exitosa: {result: "success", payload: user}

#### POST: api/user/login : inicia sesion.
Ejemplo de uso:
```
{
    "email": "manolo@gmail.com",
    "password": "passEjemplo123"
}
```
Respuesta exitosa: redireccion a la pantalla principal.

Respuesta con error de credenciales: 

{
    "result": "error",
    "error": "Email no encontrado"
}

#### POST: api/user/logout : cierra sesion.
Respuesta exitosa: redireccion a la pantalla de login.

#### GET: api/user/getUserById : obtiene la info del usuario

Respuesta exitosa:
```
{
    "result": "success",
    "payload": {
        "id": "668529c3e030361d7662f67a",
        "firstName": "Manolo",
        "lastName": "Casca",
        "email": "manolo@gmail.com",
        "age": 32,
        "role": "user",
        "cart": {
            "_id": "668529c3e030361d7662f678",
            "products": [
                {
                    "pid": "665390a5d002b6904781a04e",
                    "quantity": 1,
                    "_id": "6691fb64abd425a70ea0737c"
                }
            ],
            "__v": 0
        }
    }
}
```

### POST: api/products/ : inserta un nuevo producto (role admin)
Ejemplo de uso:
```
{
    "code": "sandMila",
    "title": "Sandwich de mila completo",
    "description": "pan de pizza, mila de carne, tomate, lechuga"
    "price": 9000,
    "file": File: sandMila.jpg,
    "stock": 50,
    "category": "snadwich"
}
```

Respuesta exitosa:
```
{
    "result": "success",
    "payload": {
        "id": "6697020a974066e93cc5927e",
        "code": "sandMila",
        "title": "Sandwich de mila completo",
        "description": "pan de pizza, mila de carne, tomate, lechuga",
        "price": 9000,
        "thumbnail": [
            "sandMila.jpg"
        ],
        "stock": 50,
        "category": "sandwich",
        "status": true
    }
}
```

Respuesta con error de permisos:
```
{
    "error": "No permissions"
}
```

Respuesta con error:
```
{
    "result": "error",
    "error": "Debe completar los datos del producto"
}
```

### GET: api/products/665397a2a11f42b6131fbaec
Respuesta exitosa:
```
{
    "result": "success",
    "payload": {
        "id": "665397a2a11f42b6131fbaec",
        "code": "pjym",
        "title": "Pizza jamon y morron",
        "description": "muzza. salsa de tomate, jamon, morron, aceitunas, oregano",
        "price": 10000,
        "thumbnail": [
            "jamonYmorron.png"
        ],
        "stock": 54,
        "category": "pizza",
        "status": true
    }
}
```

Respuesta con error:
````
{
    "result": "error",
    "error": "El producto especificado no existe"
}
````