
const express = require('express')
const fs = require("fs")

const server = express()

// middleware
server.use(express.json())

function getKodersFile() {
    const content = fs.readFileSync('koders.json', 'utf8')
    return JSON.parse(content)
}

//practica fd + express
/* //GET/koders -> regresa un json con una lista de koders
La lista de koders viene de un archivo
*/

server.get('/koders', async (request, response)=>{
   const jsonParsed = getKodersFile()
   response.json(jsonParsed.koders)
})

server.post('/koders', (request, response) =>{
    const name = request.body.name
    const gender = request.body.gender

    const newKoder = {name, gender}

    const json = getKodersFile()
    //console.log('json:', json)
    
    json.koders.push(newKoder)

    fs.writeFileSync("koders.json",JSON.stringify(json,null,2),"utf8")

    response.json({success: true})

})

server.patch('/koders/:id', (request, response)=>{
    const id = parseInt(request.params.id)//string a numero
    const name = request.body.name

    const json = getKodersFile()
    
    const newKoders = json.koders.reduce((koders, koderActual) => {
        if (id === koderActual.id) {
            koderActual.name = name
        }
        return [
            ...koders,
            koderActual
        ]
    }, [])

    json.koders = newKoders

    fs.writeFileSync('koders.json', JSON.stringify(json,null,2),'utf8')

    response.json({
        success: true
    }) 
})

//Crear un endpoint para borrar
// DELETE: /koders/:id
// GET: /koders/:id

server.get('/koders/:id',(request, response)=>{
    const id = request.params.id 

    const json = getKodersFile()

    const koderFound = json.koders.find((koder)=>koder.id == id)

    if (!koderFound) {
        response.status(404)
        response.json({
            success: false,
            message: 'koder not fount :C'
        })
        return
    }

    response.json({
        success: true,
        message: 'koder found',
        data:{
            koder: koderFound
        }
    })
})

server.delete('/koders/:id', (request, response)=>{

    const id = request.params.id

    const json = getKodersFile()

    const newKoders = json.koders.filter(koder =>koder.id != id)

    json.koders = newKoders

    fs.writeFileSync("koders.json", JSON.stringify(json, null, 2), "utf8")

    response.json ({
        success: true
    })
})

server.listen(8080,()=>{
    console.log('Server listening in port 8080')
})