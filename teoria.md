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

4)
