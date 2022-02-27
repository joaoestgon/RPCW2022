var http = require('http')
var fs = require('fs')
var url = require('url')

function constructHMTL (element){
    return '<html>\n ' + 
    '<head>\n' + 
        '<meta charset="UTF-8"/>\n'+
    '</head>\n'+
    '<body>\n'+
        '<h1>Filme: "' + element['title'] + '"</h1>\n'+
        '<ul>'+
        '<li> Ano de Produção: <b>'+  element['year'] + '</b>.</li>\n'+
        '<li> Elenco: <b>'+  element['cast'] + '</b>.</li>\n'+
        '<li> Estilos: <b>'+  element['genres'] + '</b>.</li>\n'+
        '</ul>'+
    '</body>'+
'</html>'
}

function allMoviesToFile(allMovies){
    allMovies.sort(function (a, b) {
        return (a.filme > b.filme) ? 1 : ((b.filme > a.filme) ? -1 : 0);
    });
    var contentFile ='<html>\n ' + 
            '<head>\n' + 
                '<meta charset="UTF-8"/>\n'+
            '</head>\n'+
            '<body>\n'+
                '<h1> Lista de filmes: </h1>\n'+
                '<ul>'

    allMovies.forEach(element => {
        contentFile = contentFile +  '<li> <a href="http://localhost:7777/filmes/f' + element.cont + '"' + '> '+ element.filme +' </a></li>\n'
});
    fs.writeFile('./filmes.html', contentFile, err => {
        if (err) console.log("Erro a escrever no ficheiro...");
    } );
    contentFile = contentFile + '</ul>'+
            '</body>'+
            '</html>'
}

fs.readFile('./cinemaATP.json', (err,data) => {
    if(err) console.log("Erro na leitura do ficheiro...");
    else {
        var cont = 0;
        var allMovies = [];
        let jsonData = JSON.parse(data);
        
        jsonData.forEach(element => {
            var contentFile = constructHMTL(element)
            fs.writeFile('./filmes/f' + cont + '.html', contentFile, err => {
                if (err) console.log("Erro a escrever no ficheiro...");
            } );
            
            allMovies[cont] = { cont: cont, filme : element['title']};
            cont += 1;
        });
      
    
        allMoviesToFile(allMovies);
    }
});


http.createServer(function(req, res){
    var myurl = req.url.substring(1)
    fs.readFile('./' +myurl +'.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        if(err){
            res.write("<p> Errooouuuuuuuuu... </p>")
        }
        else{
            res.write(data)
        }
        res.end()
    })
     
    
}).listen(7777)