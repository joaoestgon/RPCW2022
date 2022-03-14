var http = require('http')
var url = require('url')

const axios = require('axios');

function generateMainPage()
{
    page='<html>\n ' + 
        '<head>\n' + 
            '<meta charset="UTF-8"/>\n'+
        '</head>\n'+
        '<body>' +
        
            '<li><h3><a href="http://localhost:4000/alunos"> Lista de Alunos </a></h3></li>'+
            '<li><h3><a href="http://localhost:4000/instrumentos"> Lista de Instrumentos </a></h3></li>'+
            '<li><h3><a href="http://localhost:4000/cursos"> Lista de Cursos </a> </h3></li>'+
        
         '</body>'+
         '</html>'

    return page;
}

async function generateTabelaCursosPage()
{
    page =  '<html>\n' + 
    '<head>\n' + 
        '<meta charset="UTF-8"/>\n'+
    '</head>\n'+
    '<body>' +
    '<h1>Tabela de Cursos</h1>' +
        '<table border==\"1\">' +
        '<tr>' +
            '<td>Id</td>' + '<td>Designação</td> ' + '<td>Duração</td>' + '<td>Instrumento</td>'
        '</tr>'

await axios.get('http://localhost:3000/cursos')
    .then(function(resp) {
        instrumentos = resp.data;
        instrumentos.forEach(c => {
            page += '<tr>'
            designacao = `${c.designacao}`
            duracao = `${c.duracao}`
            instrumento = `${c.instrumento['#text']}`

            page += '<td>' +
                    id +
                    '</td><td>' +
                    designacao +
                    '</td><td>' +
                    duracao +
                    '</td><td>' +
                    instrumento +
                    '</td>'   
            page += '</tr>'
        });

        page += '</tr>'

    })
    .catch(function(error) {
        console.log(error);
    });

    page += '</table></body></html';

    return page;

    /*
    "id": "CB6",
    "designacao": "Curso Básico de Flauta",
    "duracao": "5",
    "instrumento": {
        "id": "I6",
        "#text": "Flauta"
    }
    */
}

async function generateTabelaAlunosPage()
{
    page =  '<html>\n' + 
    '<head>\n' + 
        '<meta charset="UTF-8"/>\n'+
    '</head>\n'+
    '<body>' +
    '<h1>Tabela de Alunos</h1>' +
        '<table border==\"1\">' +
        '<tr>' +
            '<td>Id</td>' + '<td>Nome</td> ' + '<td>Data de Nascimento</td>' + '<td>Curso</td>' + '<td>Ano de Curso</td>' + '<td>Instrumento</td>'
        '</tr>'

await axios.get('http://localhost:3000/alunos')
    .then(function(resp) {
        instrumentos = resp.data;
        instrumentos.forEach(a => {
            page += '<tr>'
            id = `${a.id}`
            nome = `${a.nome}`
            dataNasc = `${a.dataNasc}`
            curso = `${a.curso}`
            anoCurso = `${a.anoCurso}`
            instrumento = `${a.instrumento}`

            page += '<td>' +
                    id +
                    '</td><td>' +
                    nome +
                    '</td><td>' +
                    dataNasc +
                    '</td><td>' +
                    curso +
                    '</td><td>' +
                    anoCurso +
                    '</td><td>' +
                    instrumento +
                    '</td>'   
            page += '</tr>'
        });

        page += '</tr>'

    })
    .catch(function(error) {
        console.log(error);
    });

    page += '</table></body></html';

    return page;

    /*
    "id": "A38204",
    "nome": "HUGO JOSE PEREIRA PACHECO",
    "dataNasc": "1997-10-2",
    "curso": "CB7",
    "anoCurso": "1",
    "instrumento": "Fliscorne"
    */
}

async function generateTabelaInstrumentosPage()
{
    page =  '<html>\n' + 
            '<head>\n' + 
                '<meta charset="UTF-8"/>\n'+
            '</head>\n'+
            '<body>' +
            '<h1>Tabela de Instrumentos</h1>' +
                '<table border==\"1\">' +
                '<tr>' +
                    '<td>Id</td>' + '<td>Nome</td> ' +
                '</tr>'
    
    await axios.get('http://localhost:3000/instrumentos')
    .then(function(resp) {
        instrumentos = resp.data;
        instrumentos.forEach(i => {
            page += '<tr>'
            id = `${i.id}`
            nome = `${i['#text']}`
            id2 = i.id
            nome2 = i['#text']

            page += '<td>' +
                    id2 +
                    '</td><td>' +
                    nome2 +
                    '</td>'
            
            page += '</tr>'

            //console.log(`${i.id}, ${i['#text']}`);
        });
        page += '</tr>'
    })
    .catch(function(error) {
        console.log(error);
    });

    page += '</table></body></html';
    console.log(page)
    return page;
}

http.createServer( async function(req, res){
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + "" + req.url + " " + d)
    var myurl = url.parse(req.url, true).pathname
   
    if(myurl == "/"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(generateMainPage())
        res.end()
    }else if(myurl == "/cursos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await generateTabelaCursosPage())
        res.end()
    }else if(myurl == "/alunos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await generateTabelaAlunosPage())
        res.end()
    }else if(myurl == "/instrumentos"){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(await generateTabelaInstrumentosPage())
        res.end()
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write('<p>Rota não Suportada: ' + req.url + '</p>')
        res.end()
    }
    
}).listen(4000)

console.log("Servidor a escutar funk no BA...")