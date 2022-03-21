var http = require('http')
var axios = require('axios')
var fs = require('fs')

//var static = require('./static.js')

// Chavetas permitem importar parcialmente os modulos
var {parse} = require('querystring')

// Funções auxilidares
// Template para a página com a lista de alunos ------------------

function recuperaInfo(request, callback){
    if (request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''

        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

function geraPagTarefas( alunos, d){
  let pagHTML = `
    <html>
        <head>
            <title>Gestor de Tarefas</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="container">
                <div id="addtarefa">
                    <input type="text" placeholder="NovaTarefa">
                    <button id="add_button"> + </button>
                </div>
                <div id="tarefas"></div> 
            </div>

            <div class="w3-container w3-teal">
                <h2>Lista de Alunos</h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Nome</th>
                    <th>Id</th>
                    <th>Git</th>
                </tr>
  `
  /* ----------------------------------------------------
     To be replaced with code to generate the table rows
     ---------------------------------------------------- */

     alunos.forEach(a => {
         pagHTML += ` <tr>
                        <td><a href="http://localhost:4004/alunos/${a.Id}">${a.Nome}</a></td>
                        <td>${a.Id}</td>
                        <td>${a.Git}</td>
                    </tr>
        `
     });

  pagHTML += `
        </table>
        <div class="w3-container w3-teal">
            <address>Gerado por gtarefas::2022 em ${d} --------------</address>
        </div>
    </body>
    </html>
  `
  return pagHTML
}



// Criação do servidor

var gtarefasServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido

   
    switch(req.method){
        case "GET": 
            // GET /tarefas --------------------------------------------------------------------
            if((req.url == "/") || (req.url == "/tarefas")){
                axios.get("http://localhost:3000/tarefas")
                    .then(response => {
                        var tarefas = response.data

                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagTarefas(tarefas, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a página inicial...")
                        res.end()
                    })
            }
            // GET /alunos/:id --------------------------------------------------------------------
            else if(/\/alunos\/(A|PG)[0-9]+$/.test(req.url)){
                var idAluno = req.url.split("/")[2]
                axios.get("http://localhost:3000/alunos/?Id=" + idAluno)
                    .then( response => {
                        let a = response.data
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagAluno(a, d))
                        res.end()
                        
                        // Add code to render page with the student record
                    })
            }
            // GET /alunos/registo --------------------------------------------------------------------
            else if(req.url == "/alunos/registo"){
                // Add code to render page with the student form
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(geraFormAluno(d))
                res.end()
            }
            // GET /w3.css ------------------------------------------------------------------------
            else if(req.url == "/public/w3.css"){
                fs.readFile("w3.css", function(erro, dados){
                    if(!erro){
                        res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                        res.write(dados)
                        res.end()
                    }
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
            case "POST":
                if(req.url == '/alunos'){
                    recuperaInfo(req, resultado => {
                        console.log('Post de aluno:' + JSON.stringify(resultado))
                        resultado['id'] = resultado['Id']
                        axios.post('http://localhost:3000/alunos', resultado)
                                .then(resp => {
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(geraPostConfirm(resp.data, d))
                                    res.end()
                                })
                                .catch(erro=> {
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p>Erro no post 1 ' + erro +'</p>')
                                    res.write('<p><a href="/">Voltar</a></p>')
                                    res.end()
                                })
                    })
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Erro no post' + erro +'</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                    }
                    break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
})

gtarefasServer.listen(4004)
console.log('Servidor à escuta na porta 4004...')