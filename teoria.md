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
    -Luego de todo esto debemos tener pusehado nuestros cambios siempre debemos de trener todo pusheado en la rama main para poder pushear los cambios en heroku y podemos lanzar el sig comnando:
        git push heroku main
        Lo que estmos diciendo aqui es que pushee todo lo que tenemos en la rama main y esto hace el deploy

!!! MONGO DB !!!.- Es una BD distribuida basada en documentos y de uso general. Es una BD no SQL, basado en schemas documentos, podemos simular relaciones, no es relacional esta orientada a collection, son dcuemntos poarecidos a JSON pero no son json. TIene una sencilles, es comunmente mas rapida por la misma forma de guardar la informacion y su schema es libre, es decir que los datos que guardamos en estos documentos no son tan rigidos, pero veremos vamos a usar un framework llamado mongoose que nos viene a solucionar esto de los schemas libres nos ayudara a que nuestra BD sea predecible.
Una cosa util en este aso de conexion es Robo 3t que nos sirve para conecctarnos e incluso crear el db desde ahi.
PODEMOS enlanzar esto atravez de un codigo que nos proporciona MongoDB para conexion con apps de terceros x ejm :
    mongodb+srv://jonnathan_bc:<password>@cluster0.lhlwy.mongodb.net/myFirstDB?retryWrites=true&w=majority
Una vez hecha la conexion podemos lanzar los sig comandos entrando al clouster primario:
    - db.createCollection('name_db')
    -use name_db // para que use ese db
    -db.photos.insert({ //Para insertar datos en forma de json siempre
      id: 1,
      name: 'Jonnathan'
    })
    -db.photos.find() o db.photos.find({ username: 'jonnathan' }) // Busca algo en una BD. por defecto mongo nos crea id en las "tablas" con algo comunmente conocido como ObjectId que es una id unica que crea mongo para cada documento, es aleatoria una parte y la otra parte tiene la infor en que moneto se creo la collection.(_id)
    -db.photos.update({ user: 'jonnthan' }, {
        name: 'Israel'
    })

Cabe recalcar, mongoDB inserta sin importar asi sea todo el rato el mismo registro, porque como dijimos no tiene un schema especifico, osea si insertamos una edad en numero y en otro un string etc etc, puede mezclar los tipos de datos o puede mezclar o crear varios schemas de una misma tabla. Por esto es mas rapida por la forma de como guarda la informacion por su flexibilidad pero tambien con lleva tal vez a nivel de backend podemos validar las collection de como queremos que sea validar etc etc pero esto a nivel de backend no de db mongo es flexible y sera siempre asi.

Otro incoveniente que nos podemos encontrar es al momento de actualizar un registro si hjacemos esto:
-db.photos.update({ user: 'jonnthan' }, {
    name: 'Israel'
})
Esta mal esta incorrecta porque estamos machacando el objeto, es decir, me actualiza solo el nombre y los otros campos que existan los eliminar.
Para actualizar tenemos que utilizar un operador especial llamado $set  asi si guardaria el objeto anterior y lo nueva que se esta cambiando:
db.photos.update({ user: 'jonnathan' }, {
    $set: {
        name: 'Israel'
    }
})

Podemos reestringir ip que se puedan conectar a estos db.

!!! MONGOOSE !!!.-  Existe un driver de mongoDB que funcoina igual que Robo3t que funciona a muy bajo nivel.
Existen otras alternativas que es mongoose que es la herramienta mas utilizada para mongoDB tiene un monton de mejoras y que envuelve mongoDB Driver para que no tengamos que preocuparnos de muchas cosas problematicas como hemos visto antes.
Mongioose es un ObjectModel porque lo que hace es crear todo tipo de validacion, logica, va a crear la posibilidad de crear schemas.

//Installation
npm i mongoose

//Uso recomnedable crear un archivo separado donde este la logica de la conexion con mongoDB
mongo.js
const mongoose = require('mongoose')
const connectionString = 'mongodb+srv://jonnathan_bc:password@cluster0.lhlwy.mongodb.net/db_name?retryWrites=true&w=majority'

// Conexion a mongodb.
mongoose.connect(connectionString, {
  useNewUrlParser: true, //Estas opciones son para mongoose version 5 en mi caso buscar domentacion porque puede ser 
  useUnifiedTopology: true, //Que se hayan eliminado en versiones mas actuales.
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Database is conected')
  }).catch(error => {
    console.error(error)
  })

  //Creacion del schema que queremos que tenga en este caso note
  const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean
  })

// creacion modelo.- La creacion del modelo debe de ser siemore en mayuscula la primera letra y en sinfular porque por defecto mongo convierte ese modelo en minusculas y plural Note => notes
const Note = model('Note', noteSchema)

//Creacion de nuestra primera nota a trevex de una instancia a note.
const note = new Note({
  content: 'MongoDB es incrible midu',
  date: new Date(),
  important: true
})

note.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close() //Como buena practica siempre debemos de cerrar las conecciones.
  }).catch(error => {
    console.error(error)
  })

Como hemos dichos estos schemas son a nivel de apliczcion no a nivel de DB, osea que el schema se hace dentro de la applicacion porque no podemos cambiar la flexibilidad de mongo db.

INTEGRACION CON NUESTRO BACKEND.- Una vz que tenemos todo esto podemos en nuetsro index conectar el backendo con el DB ejm

-require('./mongo') //ponemos la conexion requiriendola al orincipio de nuestro index al inicio
-const Note = require('./models/Note') //importamos el modeli

-Podemos empezar a modificar nuestras rutas para que nos traiga la informacion que tenemos ennuestro DB por ejm
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

Podemos nosotros rasnformar el toJSON que nos devuelve por que mongo db nos crea dos cmpos por defecto el _id y el __v.
Entonces en el schema podemos nosotros "mutar" este toJSON para que nos devuelva o quite informacion que queremos en este caso lo que vamos ha hacer es que el id tenga el valor del _id y quitar el __v. Pero ojo no quita del database si no solo de la vista que nosotros queremos para manejo de informacion x ejm

Note.js
const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
    ...code
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id //Con esto el id tiene le valor de _id
    delete returnedObject._id //Con esto eliminamos los _id
    delete returnedObject.__v //Con esto eliminamos los __v
  }
})

Vamos ahora a colocar las conexiones de nuestro db en un archivo .env para poder colocar ahi las credenciales y que estas sean invisibles a los users, pero ojo siempre debemos de ignorar el .env en el gitignore.
Pero para que lo lea debemos de instyalar dotenv npm i dotenv una vez instalado debemos de requerirlo en nuestro index pero al inicio en la linea 1 el metodo config() ejm
index.js
require('dotenv').config() lo que hace y el motivo de colocarlo primero es que primero vera esto y lo que hace es leer si tenemos un archivo .env y colocara las variables de entorno que tengamos en este archivo.
Importante siempre ignorar este archivo en el gitignore.

El orden de los middlewares son siempre imprtantes porque va en orden leyendo de arriba hacia abajo.
Los middlewares en donde por ejm al next() si le pasamos el parametro del error por defecto el buscara el un middleware que tenga como primer parametro un error ejm

app.post('mkml', (request, response, next) => {
  ...code
  .then(() => {})
  .catch(error => next(error)) //Esto busca lo de abajo porque  tiene ese middleware con el primer parametro error.
})

app.use((error, request, response, next) => {
  console.error(error)
  console.error(error.name)

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'id used is malformed' })
  } else {
    response.status(500).end()
  }
})

Puede haber fugas de memoria en mongoose por eso es buena oractica siempre cerrar las conexiones.

!!! TESTING DESDE 0 CON JEST !!!.- Los test siemore deben ser predecibles siempre debemos hacer que nuestro test falle para verificar la funcionalidad de nuetsro test y este sea correcto.
Jest estaba mas para navegador para cliente pero lo han podido solucionar ahora es para backend tambien.

Installation
npm i jest --save-dev o npm i jest -D como desarrolo lo uno es igual que el otro.

En windows hay veces que falla. es decir que si tenemos espacion en nuestras carpetas puede no funcionar correctamente.
Como dijimos jest esta por defecto esta pensado para trabajar en el cliente, esto lo que hace es simular cosas del DOM y nosotros esas cosas no las necesitamos y de hecho pueden ser problematicas.
Para solucionar esto en nuestro package.json podemos agregar una configuracion para jest y lo que etsmoa diciendo con esta configuracion  que el entorno en donde vamos a ejecutar nuestros test es node ejm:

...code
},
"jest": {
Para que nuestro linter no nos de errores en el codigo que no esxiste etc etc, podemos realizar en el package.json en el aprtado de eslintConfig lo sig una key env con el valor de jest que sea true, con esto le decimos que el el entorno de test es jest por lo tanto quita los errores de lintado y podemos usar jest en node.

"eslintConfig"
: {
  "extensds": "...code",
  "env": {
    "jest": true
  }
}
Por defecto jest lo que hace es buscar los archivos que tiene .test.js y los ejecuta siempre y para ejecutar podemos crear un script "test": "jest --verbose" --verbose lo que hace es decrile que me de toda la informacion posble.

!!! TESTING DEL BACKEND !!!.- Antes de empezar con el testing, debemos de nosotros indicar el entorno de donde estamos desarrollando, en node hay como un reggla donde podemos tener un entorno de desarrollo y produccion.
EN node podemos vamos a modificar un poco nuestros scripts colocando los diff entornos para cada script ejm:

//Antes
"scripts": {
  "dev": "nodemon index.js",
  "lint": "standard .",
  "start": "node index.js",
  "test": "jest --verbose"
},

//Ahora
"scripts": {
  "dev": "NODE_ENV=development nodemon index.js",
  "lint": "npm run lint",
  "start": "NODE_ENV=production node index.js",
  "test": "NODE_ENV=test jest --verbose"
},

PEro esto no funciona bien en windows por lo que debemos de colocar un prefijo antes de cada contenido ejm:
 1)Vamos a instalar una dependencia llamada cross env npm i cross-env, esto me va a permitir justamente es ue las variables de entorno funcionen bien de mejor manera.

 2)En nuestros scripts como dijimos vamos a anteponer un prefijo cross-env en donde vamos a usar las varianles de entorno dentro de cada comando ejm:

 "scripts": {
  "dev": "cross-env NODE_ENV=development nodemon index.js",
  "lint": "npm run lint",
  "start": "cross-env NODE_ENV=production node index.js",
  "test": "cross-env NODE_ENV=test jest --verbose"
},

Como queremos testear nuestra app tira de una BD, no es una buena practica lo que vamos ha hacer, vamos a tirar de una b BD diff para este test entonces seguimos lo ssig pasos
 1)Creamos una variable de entorno llamada MONGO_DB_URI_TEST: con el valor de las connection string solo que le cambiamos el nombre del DB  para que cree otra poude ser notes-app-test entonces tirara de ahi nuestros test de ese DB.

 2)Luego en donde tenemos la conecxon a la BD en este caso el archivo mongo.js vamos a modificar el apartado donde estamos haciendo la conexion directa ejm 

 //Antes
 const connectionString = process.env.MONGO_DB_URI

 //MOdificado
 const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
  const connectionString = NODE_ENV === 'test'
   ? MONGO_DB_URI_TEST
   : MONGO_DB_URI 

Vamos a hacer test de integracion, osea, que integra mas de una cosa porque no es solo un metodo en concreto sino que vamos a testear nuestras endopoint de nuestra app, por lo cual debemos de tenr un forma facil de acceder a ellos como lo vamos ha hacer con esta herramienta supertes que es una biblioteca que nos va a permitir probar facilmente servidores http:
 1) npm i supertest -D instalamos como deopendencia de desarrollo.
 2)Luego donde vamos a utilizar debemos de importar supertes, luego importamos la app osea desde el index.js de nuestra app el app primcipal debemos d eimportarlo y luego con el supertes lo que vamos a hacer es asiganarle ese valor ejm 

  const supertest = require('supertest') import supertes
  const app = require('../index') import app siempre debemos asegurarnos estar exportando la app en el index.js.
  const api = supertest(app) Asignacion al suertest nuestra app

 3) Luego ya solo debemos de empezar a crear nuestros test como vemos en este ejm creamos un test de nuestra api de notas. Ojo los test de api son siempre asincronos siempre

  const supertest = require('supertest')
  const app = require('../index')
  const api = supertest(app) 

 test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
Nota Siempre el conten-type debemos pasarle en una regex porque si le pasmos como string peta porque no sabe si le va allegar el charset.
Tenemos varios scripts que podemos utilizar para lanzar los test x ejm:

- "test": "cross-env NODE_ENV=test jest --verbose --silent", lanza el comando
- "test:watch": "npm run test -- --watch" reutilizacion del test + -- --watch que es para que siempre este a la escucha de que cambie el documento y se vuelva a lanzar automaticamente.

-"test:watch": "npm run test -- --watch test/notes.test.js" para lanzar un test en especifico
- PAra consola npm run test -- -t "name_test".

Generacion de ids random en base a los ids de un json.

!!! Controladores(Controllers) !!!.- Con los controladores vamos a ser capaces de crear endpoints que vamos a tener disponibles en nuestra app hecha con express fuera del index ejm:

1) Debemos en nuestro index crear el middleware que va a hacer uso de nuestro controller(router)
  index.js 
  app.use('/api/users', userRouter)

2)Creamos una carpeta llamada controllers si no la tenemos con un archivo llamado userRouter controllers/userRouter

3) Debemos de importar el router de express
const userRouter = require('express').Router() //El Router() es una clase la cual nos va a permitir crear u router de forma separada a lo que tenemos en el indice y utilizarlo despues.
const User = require('./models/User') 

// Aqui dentro podemos crear nuestras endpoints como hicimos con las notas asi quedara mas limpio nuestro index
Por ejm
userRouter.post('/', async () => {

})

module.exports = userRouter
Ojo aqui el nombre de las rutas siempre apuntan a / o /:id porque esto es relativo al middleware creado en el index  => app.use('/api/users', userRouter) este porque aqui ya le estamos indicando que todo esto va a ir al api/users siempre.

Una de las mejores forma de encriptar nuestras password apara segutidad nuestra y de nuestros usuarios es con bcrypt ya que no permite crear passwordHash en una sola direccion como si fuese bidirecccional al final si tenemos el hash podemos volver a desencriptar y tiene varios metodos que en el desarrolo nos pueden ser muy utiles en el desarrollo, este metodo de encrptacion tiene que ser o es muy recomnedable que sea de forma asincrona, porque esta operacion de hashear una pass suele ser muy grande, si nosotros bloqueamos el thread de node lo que puede suceder es que lleguen peticiones se va parando el thread esperando que crees el hash y que cada vez vaya mas lento el servidor por eso es recomnedable y buenisiam practica hacerlo asincrono esta funcionalidad bcrypt ya viene con metodos asincronos(bcrypt.hash) y sincronos(bcrypt.hashSync) que podemos usarlo.

1-npm i bcrypt
2-importacion donde lo vayamos a usar en este caso es el controlador del user
 const bcrypt = require('bcrypt')

3-Este recibe dos parametros el password que vamos a hashear y como segundo parametro saltOfRounds que esto no es mas que la complejidad algoritmica que queremos que se hashe la password, cuanta mas complejidad tarda mas pero mas segura sera como buena practica y el valor que se suele usar es ser siempre 10.

const saltRounds = 10
const passwordHash = await bcrypt.hash(password, saltRounds)


const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})
module.exports = usersRouter

!!! Testing Drive Development (TDD) !!!.- Es una forma de desarrollo en donde primero hacemos el test luego escribimos el código. En base seria que nos apoyamos en el test primero y no en la funcionalidad en si.
Es una buena practica.

En mongoose existe una iibreria llamada mongoose unique validator !!! Nos permite validar los campos que nosotros queremos que sean requeridos, unicos etc etc. Las validaciones lo hacemos en el schema ya que desde aqui ya parte un shcema especifico de como estamos creando las collection

install
npm i --save mongoose-unique-validator

//USO
//requerimos
const uniqueValidator = require('mongoose-unique-validator')

//Modelo validacion, aqui como vemos al campo le pasamos un objeto y colocamos unique: true para que sea unico y le pasamos el type: tipo de dato que require en este caso String al campo username
const userSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

//Luego debemos usarlo como plugin con el schema que creamos en este caso el userSchema.
userSchema.plugin(uniqueValidator)
Revisar la documentacion de unique validator que tenemos varios tipos de uso.

!!! JOIN !!!.- Esto se denomina a una relacion entre una tabla y otra, hablando DB relaciones, en este caso en mongoDB lo tenemos que hacer a mano, pero es muy complejo hacerlo se llama Agregacion, existe en mongoose un concepto llamado en Populate es un metodo que lo que hace es utlizar las referencia creadas en los schemas, lo que hace es recuperar la informacion y popularla(rellenar) la informacion del usuario dondoe la necesitamos. ejm:

//Aqui le agragamos el populate en la llamada en get, aqui me traera la informacion completa de las notas.
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes')
  response.json(users)
})

//Lo que hace ese populate es tirar del modelo del usuario, pero busca si tenemos una referencia si la tiene pues me envia los datos de la referencia en este caso la referencia es ref: 'Note'.
const userSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})
Aunque podemos nosotros en mongoose tambein escoger los campos que queremos que se visualicen, en este caso estamos trayendo la collection de notas pero por default me trae todos los campos que existen en ese documento, por ejm:

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    _id: 0
  })
  response.json(users)
})
Como vemos en el ejm le pasamos el nombre del campo con el valor de 1 cuando queremos que nos muestre y le podemos pasar 0 si queremos que no muestre esa informacion. Este populate recibe dos parametros el nombre del campo de referencia y como segundo parametro un objeto donde como vimos le podemos pasar los campos que queremos que se muestren o no, asi podemos tener el control en nuestros schemas siempre y como buena practica.

Basicamente no es exactamente un JOIN, porque un JOIN es transaccional, lo que quiere decir esto es que esa operacion bloquea las tablas no permite que haya escrituras en las tablas, porque puede ser que cuando hacemos el JOIN puede ser que la informacion que nos traemos de esa tabala no es exactamente la que hay en la tabla.
En este caso lo que esta haciendo es algo no transaccional mongoose porque mientras esta haciendo estas operaciones no esta bloqueando que se esten escribiendo en los documentos, lo que sig es que cuando hemos recuperando unas notas por ejm, puede ser que mientas estaba ocurriendo alguien borro esa nota y yo la tenga aunque ya no existe. Entonces esto lo que hace mongoose no es transacional porque no esta bloqueando la escrituras de la tabla entonces mientras sucede la peticio pueden estar sucediendo otras.
