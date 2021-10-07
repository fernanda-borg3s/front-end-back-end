const express = require('express');
//Body parse já está incluido no express, não é necessario npm novamente.
const bodyParser = require('body-parser');

//CORS (Cross-Origin Resource Sharing) é um sistema que consiste na transmissão de 
//HTTP headers (en-US), que determina se navegadores vão bloquear código JavaScript 
//de acessarem respostas provindas de requisições entre origens.
const cors = require('cors');

//Obtem o objeto pg do pacote
const pg = require('pg');

//Express.js é um framework para Node.js que fornece recursos mínimos para construção de servidores web.
const app = express();

app.use(cors());
app.use(bodyParser.json());

const client = new pg.Client(
    {
        user: 'postgres',
        host: 'localhost',
        database: 'ex1',
        password: '',
        port: 5432

    }
);

client.connect();

//Serviços para inserir dados no banco de dados
app.post('/cadastro', function (req, res) {
    client.query(
        {
            text: "INSERT INTO produto (prod,preco,qtd) VALUES($1,$2,$3)",
            values: [req.body.produto, req.body.preco, req.body.quantidade]
        }
    );
    res.json(
        {
            status: 'Cadastro Concluido!',
        }
    );
}
);
//Serviço que cria o array de produtos do banco de dados
app.get('/pesquisa', function (req, res) {
    client.query('SELECT * FROM produto')
        .then(function (ret) {

            let produtos = [];
            for (const produto of ret.rows) {
                produtos.push(
                    {
                        produto: produto.prod,
                        quantidade: produto.qtd,
                        codigo: produto.codigo,
                        preco: produto.preco
                    }
                );
            };

            res.json(
                {
                    status: 'OK',
                    resultados: produtos
                }
            );
        });
});

//Serviço para requisitar(pesquisar) dados do produto
app.get('/pesquisa/:pesquisa', function (req, res) {
    client.query(
        {
            text: 'SELECT * FROM produto WHERE prod = $1',
            values: [req.params.pesquisa]
        }
    ).then(
        function (ret) {
            //Produto selecionado a partir da pesquisa do usuario
            let produto = ret.rows[0];
            //------//
            res.json(
                {
                    status: 'OK',
                    produto: produto.prod,
                    codigo: produto.codigo,
                    quantidade: produto.qtd,
                    preco: produto.preco
                }
            );
        }
    );
});

app.listen(
    3000,
    function () {
        console.log("Servidor web funciona!");
    }
);
//Usar npx nodemon "nome arquivo servidor"