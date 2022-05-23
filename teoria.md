!!! NODE JS !!!.- Siempre que queremos realizar una api con node los primero que debemos hacer es levantar un servidor, nodemon es una herramienta que nos facilita no ha levatar el server si no a que este pendiente a todos los cambios que ocurren en nuestro index y no tener que instarlo a mano siempre.

NOTA: REST API vamos a crear una api rest para que sea un rest es que del mismo path podemos hacer varias cosas, sui queremos una notas /api/notas seria el path la diff de como se trata ese recurso seria la accion x ejm el .get, -opst, .put, .delete.

1) Crear el servidor con express que este no solo nos sirve para levantar y crear un server si no que nos ayuda en los headers que se llaman el automaticamente lo detecta appliction/json o text/plain por ejm, este nos ayuda a tener diff rutas y cada ruta haga algo, tener diff middlewares lo podemos instalar con - npm i express:

/*CON NODE JS PURO
const http = require('http')

const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(notes))
})

const PORT = 3001

app.listen(PORT)
console.log(`Server is running in port ${PORT}`) */

//CON EXPRESS
const express = require('express')
const app = express()

let notes = [
    {
        id: 1,
        content: 'Nota 1',
        important: true
    },
    {
        id: 2,
        content: 'Nota 2',
        important: false
    },
    {
        id: 3,
        content: 'Nota 3',
        important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world!!!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

//Al levantar el puerto el server siempre debe de ser asincrono porque si algo falla no podemos colocar que el perto se creo o que haga algo si el servidor a fallado.
const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server is running in port ${PORT}`)
})

2)Instalar nodemon npm i nodemon -D como dependencia de desarrolo siempre, no es recomendable instalarlo de manera global porque podemos tener pero problemas cuando se clonen los proyectos en el equipo y no tienen las dependencias en el proyecto si no solo en mi computador. Para ejecutarlo lanzamos ./node_modules/.bin/nodemon index.js en consola o podemos crear un script en el package.json "dev": "nodemon index.js"

3) Para crear una nota en un metodo post, debemos de siempre tener un json parse , express ya lo tiene por defecto lo cual vamos a hacer uso en nuestro index.js ejm: en versiones actuales de express viene esto integrado, lo que hace esto es devolverme en la request.body la informacion que le estamos pasando en el servicio. Cuando hacemos un post siempre debemos de realizar validaciones para ver si esta o no llegando y no nos llegue vacio o undefined x ejm.

const express = require('express')
const app = express()

app.use(express.json()) //Con esto le decimos que el app use este json parse.

app.post('/api/notes', (request, response) => {
    const note = request.body

    if(!note || !note.content) {
        response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)
    
    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toISOString()
    }

    //Añadimos la nueva nota al array de notas
    notes = [...notes, newNote]

    response.json(newNote)
})

!!! LINTERS !!! Nos sirve para code style, nos permite a mejorar la lintado de nuestro codigo el linter mas extendido es eslint lo vamos a instalar con -D porque es una dependencia de desarrolo.
 1) npm i eslint -D => Importante siempre que podamoseliminar el caret de los paquetes.
 2) Podemos ejecutar un binario que nos va a permitir iniciar el slint con:
    ./node_modules/.bin/eslint --init, pero una buena practica siempre es crear un script por ejm:
    "lint": "eslint .", => npm run lint

    Una vez respodido las preguntas lanzando el binario o el script nos aparece un archivo llamado .eslintrc.jsy aqui estara toda la configuracion del linter y para que nos salgan los errores debemos instalar en vsc una extension llamada eslint que esto lo que hace es leer ese archivo de configuracion. En ese archivo de configuracion vemos que nos ha colocado en esta opcion:
    module.exports = {
    'env': {
        'browser': true,
    Nos ha colocado un browser true esto lo que hace es que no nos ayuda a detectar las variables de entorno con el process => process.env.PORT, debemos de agregarle a esa configuracion la opcion de 'node': con el valor true ejm:
    module.exports = {
    'env': {
        'browser': true,
        'node': true
    }
    Con esto le estamos diciendo que el entorno de desarrollo es node.

3) Otra opcion de linter seria standard... lo podemos instalar con npm i standard -D, esta ya viene con una configuracion especifica directa para cada lenguaje de programacion e incluso viene ya por defecto de trabajar sin semicolumns, esta basado en eslint.
Podemos en nuestro package.json colocar la sig opcion que es  otra forma de configurar el linter
},
"eslintConfig": {
    "extends": "./node_modules/standard/eslintrc.json"
}

!!! MIDDLEWARE !!!.-Es una funcion que intercepta una peticion que esta pasando por mi api.
app.use((request, response, next) = {
    ...codigo
    next()
})
Es decir, va leyendo la app de arriba ha abajo y va entrando en los path que le colocquemos si coincide con eso pues nos devolvera lo que contiene eso, le tenemos que psar el next porque si no no nos devuelve nada, el next significa que si no coincide con la ruta pasa al sig. Puede ser muy util para errores 404

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

Un error tipico de consumo de apis son los errores de cors, express nos da una utilidad propia para evitar estos errores de cors, es facil de solucionar cuando tenemos el backend a disposicion. Cuando estas en origines distintos podemos usar imagenes, cdn de js, fuentes, pero en informacion con fetch con request no devuelve la informacion lo hacemos de la sig manera, existe un middleware en express para solucionar este error lo hacemos de la sig manera:

1)Instalcion de cors de express npm i cors -E , este -E lo que estamos diciendo es que nos instale la version exacta
2) En nuestro index lo que solo dedemos hacer es que lo use ejm:

    const cors = require('cors')
    app.use(cors())


!!! DEPLOY IN HEROKU !!!
1)Debemos de crear el repositorio si no tenemos de nuestro backend.
2)En nuestro proyecto debemos crear en la raiz un archivo llamada Procfile con las sig congiguraciones:
    web: npm start

3)Crear la app en heroku en los sig pasos:
    -Instalar el CLI de heroku.
    -Crear una cuenta.
    -En nuestro index debemos de modificar un poco el codigo especificamente en el puerto, porque en heroku no le podemos decir el puerto porque el lo hace automaticamente, para estoel puerto lo utiliza d euna variable de entrono llamado port 

    const PORT = process.env.PORT || 3001
    Esto necesitaheroku para el usar el puerto que quiera
    -Luego de todo esto vamos a crear la app de heroku lanzamos el siguiente comando heroku create 