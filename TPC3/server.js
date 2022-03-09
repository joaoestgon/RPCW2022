var http = require('http')
var url = require('url')

const axios = require('axios');

function generateMainPage()
{
    page="<body> Exemplo de Conteudo </body>"

    return page;
}

function generateTabelaCursosPage()
{
    axios.get('http://localhost:3000/cursos')
    .then(function(resp) {
        alunos = resp.data;
        alunos.forEach(c => {
            console.log(`${c.id}, ${c.designacao}, ${c.duracao}, ${c.instrumento['#text']}`);
        });
    })
    .catch(function(error) {
        console.log(error);
    });

    /*
    "id": "CB6",
    "designacao": "Curso Básico de Flauta",
    "duracao": "5",
    "instrumento": {
        "id": "I6",
        "#text": "Flauta"
    }
    */

    page="<body> Exemplo de Conteudo Cursos </body>"

    return page;
}

function generateTabelaAlunosPage()
{
    axios.get('http://localhost:3000/alunos')
    .then(function(resp) {
        alunos = resp.data;
        alunos.forEach(p => {
            console.log(`${p.id}, ${p.nome}, ${p.dataNasc}, ${p.curso}, ${p.anoCurso}, ${p.instrumento}`);
        });
    })
    .catch(function(error) {
        console.log(error);
    });

    /*
    "id": "A38204",
    "nome": "HUGO JOSE PEREIRA PACHECO",
    "dataNasc": "1997-10-2",
    "curso": "CB7",
    "anoCurso": "1",
    "instrumento": "Fliscorne"
    */

    page="<body> Exemplo de Conteudo Alunos </body>"

    return page;
}

function generateTabelaInstrumentosPage()
{
    axios.get('http://localhost:3000/instrumentos')
    .then(function(resp) {
        alunos = resp.data;
        alunos.forEach(i => {
            console.log(`${i.id}, ${i['#text']}`);
        });
    })
    .catch(function(error) {
        console.log(error);
    });

    /*
    "id": "I1",
    "#text": "Clarinete"
    */

    page="<body> Exemplo de Conteudo Instrumentos </body>"

    return page;
}

http.createServer(function(req, res){
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + "" + req.url + " " + d)
    var myurl = url.parse(req.url, true).pathname
   
    if(myurl == "/"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(generateMainPage())
        res.end()
    }else if(myurl == "/cursos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(generateTabelaCursosPage())
        res.end()
    }else if(myurl == "/alunos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(generateTabelaAlunosPage())
        res.end()
    }else if(myurl == "/instrumentos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(generateTabelaInstrumentosPage())
        res.end()
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write('<p>Rota não Suportada: ' + req.url + '</p>')
        res.end()
    }
    
}).listen(4000)

console.log("Servidor a escutar funk no BA...")