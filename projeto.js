$('#resultado-pesquisa').hide(); // manter escondido o caixa do resultado da pesquisa no banco
$('#dv-modal').hide(); // esconder a janela modal do estoque assim que carrega a pagina
$('#card-estoque').hide();

//back-end parte de cadastro dos produtos no banco de dados
$('.btn-cadastrar').on('click', function () {
    //Variaveis para pegar as informações sobre produto/quantidade/preco
    let produto = $('#prod').val();
    let quantidade = $('#quant').val();
    let preco = $('#preco').val();

    //Ajax para o serviço cadastro
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/cadastro",
        data: JSON.stringify(
            {
                produto: produto,
                quantidade: quantidade,
                preco: preco
            }
        ),
        contentType: 'application/json',
        success: function (dados) {
            //Confirmar cadastro
            $('#conf').text(dados.status);
        },
        error: function (dados) {
            alert('Não foi possivel cadastrar os dados' + dados);
        }
    });
});

//back-end da parte de pesquisa no banco de dados (index.html)
$('.btn-pesquisar').on('click', function () {
    let pesquisa = $('.pesquisar-produto').val();
    $.ajax(
        {
            type: 'GET',
            url: 'http://localhost:3000/pesquisa/' + pesquisa,
            success: function (dados) {
                $('.produto').text('Nome do produto: ' + dados.produto);
                $('.cod').text('Código produto: ' + dados.codigo);
                $('.qtd').text('Quantidade em Estoque: ' + dados.quantidade);
                $('.valor').text('Preço: ' + dados.preco);
                $('#resultado-pesquisa').show();
            },
            error: function (dados) {
                $('#resultado-pesquisa').text('Busca não encontrada');
                $('#resultado-pesquisa').show();
            }
        } );
});
// FIM DA PESQUISA NO BANCO DE DADOS

//Estoque
$('.btn-estoque').on('click', function () {
    $('#container').hide();
    $('#card-estoque').show();
    $.ajax(
        {
            type: 'GET',
            url: 'http://localhost:3000/pesquisa',
            dataType: 'json',
            success: function (dados) {
                for (let i = 0; i <= 2; i++) {
                    let cProd = dados.resultados[i].codigo
                    $('.nome-produto' + i).text('Produto: ' + dados.resultados[i].produto);
                    $('.price' + i).text('Preço: ' + dados.resultados[i].preco);
                    $('.qtd' + i).text('Quantidade: ' + dados.resultados[i].quantidade);
                    $('.codigo' + i).text('Código: ' + dados.resultados[i].codigo);
                    console.log(cProd);
                }
                }});
});

//Botão atualizar
$('#btn-atualizar').on('click', function () {
    $('#dv-modal').show(); // mostrar o janela modal assim que clicar no botao atualizar
});

//Botão Fechar/Atualizar produto
$('.btn-fechar').on('click', function () {
    $('#dv-modal').hide()
    $('body').show();
    //Variaveis atualizar quantidade e preço no banco de dados
    let codigoProd = $('#codigoP').val();
    let attQuant =  $('#attQuant').val();
    let attPreco = $('#attPreco').val();

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/atualizar",
        data: JSON.stringify(
            {
                quantidade: attQuant,
                preco: attPreco,
                codigo: codigoProd

            }
        ),
        contentType: 'application/json',
        success: function (dados) {
            location.reload();
        },
        error: function (dados) {
            alert('Não foi possivel atualizar os dados');
        }
    });
});