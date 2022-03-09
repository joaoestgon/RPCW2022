const axios = require('axios');

axios.get('http://localhost:3000/alunos')
    .then(function(resp) {
        alunos = resp.data;
        alunos.forEach(p => {
            console.log(`${p.id}, ${p.nome}`);
        });
    })
    .catch(function(error) {
        console.log(error);
    });