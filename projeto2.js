//Variáveis Globais:
let utilizadores = []

let eventos = []

let parcerias = []

let categorias = []

//Vai servir para saber se há alguém com sessão iniciada ou não
let logged = false;

//Vai simplificar saber qual é o indice no array utilizadores do utilizador loggado
let indexUtilizador = 0;

//Vai ser usada para por o mês a atualizar se automaticamente no calendário
let mesNoCalendario = ""

//Serve para saber qual é o id do evento que está a ser alterado
let idEventoAlterar = 0

//Variavel que vai guardar o id da parceria a alterar
let idDaParceriaModificar = 0

//------------------------------------------


window.onload = function () {

    //TEstes com o calendário
    //brincadeirasCalendário(); Funciona

    //Criar Eventos default
    // let par1 = new Parceria("Esmad", 'ali', 'alie')
    // let par2 = new Parceria('Pporto', 'porto', 'pipi')
    // let par3 = new Parceria('Fiu', 'fiufiu', 'fiufiufiu')

    // parcerias.push(par1, par2, par3)


    let datinha = new Date() //VAi ser mais vezes usado

    //Variavel para o item da navbar para o admin
    let adminzito = document.getElementById('Admin')

    calendarioFixe(datinha.getMonth() + 1, datinha.getFullYear())

    //Isto deve ser a primeira cena a fazer em principio
    //Local Storage, encher os arrays, utilizadores e eventos
    if (localStorage.getItem('utilizadores')) {
        let a = JSON.parse(localStorage.getItem('utilizadores'))

        //Maneira de encher o array sem ter que mexer nas variáceis internas
        for (let i = 0; i < a.length; i++) {
            let b = new Utilizador(a[i]._nome, a[i]._password, a[i]._mail, a[i]._tipo)
            utilizadores.push(b)
        }

        console.log(utilizadores)

        //Tou a fazer isto porque ao fazer utilizadores.nome aos utilizadores que ficaram no localstorage, isto devolve undefined
        //mas se criar um novo objeto que não estava guardado já funciona, mas se fizer utilizadores._nome, já me dá o valor direito
        //e tenho as merdas bem na class....
        //Não funcionou...

        // for(let i = 0; i<meninos.length; i++){
        //     utilizadores.push(meninos[i])
        // }
    }

    if (localStorage.getItem('eventos')) {
        let a = JSON.parse(localStorage.getItem('eventos'))

        //nome, dataEhora, descricao, categoria, foto, responsavel, utilizadores[indexUtilizador]._id
        for (let i = 0; i < a.length; i++) {
            let b = new Evento(a[i]._nome, a[i]._data, a[i]._descricao, a[i]._categoria, a[i]._imagem, a[i]._responsavel, a[i]._userId)
            eventos.push(b)
        }

        console.log(eventos)
    }

    if (this.localStorage.getItem('parcerias')) {
        let a = JSON.parse(localStorage.getItem('parcerias'))

        for (let i = 0; i < a.length; i++) {
            let b = new Parceria(a[i]._nome, a[i]._localizacao, a[i]._link)
            parcerias.push(b)
        }
        console.log(parcerias)
    }

    for (let i = 0; i < utilizadores.length; i++) { //porque fodeu se
        utilizadores[i].fotografia = "Docente"
    }
    //só para ter um caraho de um administrador
    // let r = new Utilizador("El Admin", "123", "adminFixi@gmail.com", "", "Adminstrador")
    // utilizadores.push(r)

    utilizadores[4].fotografia = "Administrador"

    //localStorage.setItem("utilizadores", JSON.stringify(utilizadores))

    //Iniciar o indexUtilizador como estava antes
    indexUtilizador = JSON.parse(localStorage.getItem('indexUtilizador'))


    //Adminhe
    if (adminzito != null) {
        if (utilizadores[indexUtilizador].fotografia == "Administrador") {
            adminzito.style.display = 'inline-block'
        }
    }

    //+-Global, só para o que estiver dentro do window.onload
    let btnAdicionar = document.getElementById('btnAdicionarEventos')

    //Mostrar ou não o botão de login, consoante o estado da variavel logged
    estadoLogged();
    if (logged == true) {
        //Vou fazer copyPaste do que está já está feito no botão de login e logoff, mas podia ser feito numa função secalhar

        //Mostrar o botão de log-off e esconder o de log-in
        let btnLogin = document.getElementById('Login')
        btnLogin.style.display = "none"

        let btnLogoff = document.getElementById('Logoff')
        btnLogoff.style.display = "inline-block"

        //Botão de registar disabled, não me parece a melhor opção, mas de outra maneira daria trabalho a mais para agora
        let btnRegistar = document.getElementById('Registar')
        btnRegistar.disabled = true

        let msgErro = document.getElementById('MsgErroRegistar')
        msgErro.innerHTML = "Bem vindo, " + utilizadores[indexUtilizador].nome + " !!!"

        if (utilizadores[indexUtilizador].tipoUtilizador == 'Docente' && btnAdicionar != null) { //A variavel interna é _tipo e não tipoUtilizador
            btnAdicionar.style.display = 'inline-block'
        }

        //Função para adicionar a opção de ver o perfil do utilizador, se esta merda fosse com windows forms.....
        verPerfil(true);

    }
    else {
        //Ativar o botão de registar
        let btnRegistar = document.getElementById('Registar')
        btnRegistar.disabled = false


        //Esconder o botão de log-off e mostrar o de log-in
        let btnLogoff = document.getElementById('Logoff')
        btnLogoff.style.display = "none"

        let btnLogin = document.getElementById('Login')
        btnLogin.style.display = "inline-block"

        //Esconder o botão de Adicionar Eventos
        if (btnAdicionar != null)
            btnAdicionar.style.display = 'none'

        //indexUtilizador = 0, verificar o valor desta variável depois

        verPerfil(false)
    }

    //Preencher o catálogo ao entrar na página Agenda/Catálogo
    if (document.getElementById('ohPaEle') != undefined) {
        document.getElementById('ohPaEle').innerHTML = ""
        encherCatalogo();
    }


    //Data minima para marcar Eventos... Que belo português fds
    minDate();

    //Definir a data e o ano no calendário
    coco();

    //Marcar os dias que têm eventos, tem que estar aqui po que senão o array ainda não está preenchido
    marcarDias(datinha.getMonth() + 1);

    //Preencher o array de categorias
    mamaAquiNaPila()

    //Preencher a tabela dos utilizadores por agora
    if (document.getElementById('bodyUtilizadores') != null) {
        for (let i = 0; i < utilizadores.length; i++) {
            preencherTabelaUtiPar(utilizadores[i].nome, utilizadores[i].mail, utilizadores[i].id)
        }
    }

    if (document.getElementById('tableParcerias') != null) {
        for (let i = 0; i < parcerias.length; i++) {
            preencherTabelaUtiPar(parcerias[i].nome, parcerias[i].link, parcerias[i].id, true)
        }
    }

    if (document.getElementById('corpoEventos') != null) { //Isto podia estar tudo dentro de um dos if's
        let datatatata = ""
        for (let i = 0; i < eventos.length; i++) {
            if (eventos[i].data[0] != undefined) datatatata = eventos[i].data[0].split(';')[0]
            preencherTabelaEventos(eventos[i].nome, datatatata, eventos[i].id)
        }

        //Preencher com tags a pagina de admin, vós entendeis
        categoriasUnicasFunc() //Tenho mesmo que mexer nisto
        apresentarCategorias()
    }




    //Para o caso de o utilizador estar logado e entrar na página Inicial sem fazer login
    if (btnAdicionar != null && logged == true)
        btnAdicionar.style.display = 'inline-block'

    //Preencher o catálogo com eventos
    if (document.getElementById('containerCardsCarrosel') != null) {

        for (let i = 0; i < 6; i++) {

            if (eventos[i].data[0] != undefined) {
                preencherCarrosel(eventos[i].nome,
                    eventos[i].imagem,
                    eventos[i].descricao,
                    eventos[i].data[0].split(';')[0],
                    eventos[i].data[0].split(';')[1],
                    eventos[i].pontuacao
                    , i)
            }
            else if (eventos[i].data[0] == undefined) {
                preencherCarrosel(eventos[i].nome,
                    eventos[i].imagem,
                    eventos[i].descricao,
                    "Por Anunciar",
                    "Por Anunciar",
                    eventos[i].pontuacao //Fazer alguma merda quando a pontuação não estiver definida
                    , i)
            }

        }
    }

    //Registar um utilizador
    let formRegistar = document.getElementById('FormRegisto')
    formRegistar.addEventListener('submit', function (e) {
        e.preventDefault()

        let nome = document.getElementById('Nome').value
        let password = document.getElementById('PassRegisto').value
        let confPass = document.getElementById('ConfPassRegisto').value
        let eMail = document.getElementById('Mail').value
        let foto = document.getElementById('Fotografia').value
        let a = document.getElementById('tipoUtilizador') //Select .....

        let tipo = a.options[a.selectedIndex].value //Tipo de Utilizador


        //Confirmar Pass's
        let continuar = true
        let msgErro = document.getElementById('MsgErroRegistar') //Dá para usar outra vez o nome da variável

        if (foto == "") {

            let conf = confirm("Não introduziu uma foto \nContinuar sem mostrar as beiças?") //Dá para editar o texto desta merda?

            if (conf == false)
                continuar = false
        }

        if (confMail(eMail) == false) {
            continuar = false
            msgErro.innerHTML = "O mail já existe"
        }
        else {
            continuar = true;
            msgErro.innerHTML = ""
        }

        if (password == confPass && continuar == true) {
            //Criar Utilizador
            let novoUtilizador = new Utilizador(nome, password, eMail, foto, tipo) //Porque caralhos me está a por o tipo de utilizador na foto????

            //Mete-lo no array
            utilizadores.push(novoUtilizador)

            //Devem faltar merdas

            //1º Merda
            //Avisar que se registou ou fez login com sucesso

            msgErro.innerHTML = "Registado com sucesso!!!!"

            //2º Merda 
            //Local storage
            localStorage.setItem("utilizadores", JSON.stringify(utilizadores))


            console.log(utilizadores)
            //console.log(JSON.stringify(utilizadores))
        }
        else if (password != confPass && continuar == true) {
            msgErro.innerHTML = "As passowrds têm que ser iguais"

            //Limpar as caixas das pass's
            password = ""
            confPass = ""

            //FAzer focus na pass
            document.getElementById('PassRegisto').focus()
        }
        else if (password == confPass && continuar == false) { //Caso as passes sejam iguais e o utilizador queira por uma foto 

            //Ajudar o utilizador ....
            document.getElementById('Fotografia').focus()
        }

    })

    //Modal Registar
    //Limpar a modal ao fechar, não consegui fazer em JS, Copiadissimo
    $("#ModalRegistar").on('hide.bs.modal', function () {
        formRegistar.reset()

        //Limpar a mensagem de erro 
        document.getElementById('MsgErroRegistar').innerHTML = "";
    });



    //Fazer Login
    let formLogin = document.getElementById('FormLogin')
    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        let ok = false

        //Vai servir para personalizar a mensagem de erro.
        let erroMail = true;
        let erroPass = true;
        let erro = ""

        let mail = document.getElementById('mailLogin').value
        let pass = document.getElementById('passLogin').value

        for (let i = 0; i < utilizadores.length; i++) { //Acho que bastava usar o indexUtilizador mas sbé
            console.log(utilizadores[i].mail)

            if (utilizadores[i].mail == mail) { //Por agora vou trabalhar com as variáveis internas, e assim funciona


                erroMail = false //Ou seja, não há erros

                if (utilizadores[i].password == pass) {
                    ok = true
                    erroPass = false;
                    indexUtilizador = i; //Simplificar a vida
                    console.log("ok = " + ok)
                    localStorage.setItem('indexUtilizador', JSON.stringify(indexUtilizador))
                }
            }
        }

        //Atuar consoante estar tudo bem ou não, pandeleiro
        let msgErro = document.getElementById('MsgErroLogin')
        if (ok == true) {
            //Dizer que o utilizador está com sessão iniciada
            logged = true; //Vai servir para várias merdas a seguir
            localStorage.setItem('logged', JSON.stringify(logged))


            //Mostrar o botão de log-off e esconder o de log-in
            let btnLogin = document.getElementById('Login')
            btnLogin.style.display = "none"

            let btnLogoff = document.getElementById('Logoff')
            btnLogoff.style.display = "inline-block"

            //Mostrar na navbar o item para o adminstrador
            if (utilizadores[indexUtilizador].fotografia == "Administrador") {
                adminzito.style.display = 'inline-block'
            }

            //Botão de registar disabled, não me parece a melhor opção, mas de outra maneira daria trabalho a mais para agora
            let btnRegistar = document.getElementById('Registar')
            btnRegistar.disabled = true

            if (btnAdicionar != null && utilizadores[indexUtilizador].fotografia != "Estudante") //Está fotografia, mas tá mal, só não sei porque
                btnAdicionar.style.display = 'inline-block'

            msgErro.innerHTML = "Bem vindo, " + utilizadores[indexUtilizador].nome + " !!!"

            if (utilizadores[indexUtilizador].tipoUtilizador == 'Docente' && btnAdicionar != null) { //A variavel interna é _tipo e não tipoUtilizador
                btnAdicionar.style.display = 'inline-block'
            }

            //Função para adicionar a opção de ver o perfil do utilizador, se esta merda fosse com windows forms.....
            verPerfil(true);


        }
        else {
            msgErro.innerHTML = mensagemErro(erroMail, erroPass) //Função que personaliza a mensagem de erro
        }
    })

    //Modal Login
    //Limpar
    $("#ModalLogin").on('hide.bs.modal', function () {
        formRegistar.reset()

        //Limpar a mensagem de erro
        document.getElementById('MsgErroLogin').innerHTML = ""
    });



    //Fazer logoff
    let btnLogoff = document.getElementById('Logoff')
    btnLogoff.addEventListener('click', function () {

        //Ativar o botão de registar
        let btnRegistar = document.getElementById('Registar')
        btnRegistar.disabled = false


        //Esconder o botão de log-off e mostrar o de log-in
        let btnLogoff = document.getElementById('Logoff')
        btnLogoff.style.display = "none"

        let btnLogin = document.getElementById('Login')
        btnLogin.style.display = "inline-block"

        //Esconder o cenas do admin
        adminzito.style.display = 'none'

        //Esconder o botão de Adicionar Eventos
        if (btnAdicionar != null)
            btnAdicionar.style.display = 'none'

        indexUtilizador = 0
        localStorage.setItem('indexUtilizador', JSON.stringify(indexUtilizador))

        logged = false; //Em principio vai ser esta variavel que vai dizer o que é que se mostra ou não nas páginas
        localStorage.setItem('logged', JSON.stringify(logged))

        location.reload()

        verPerfil(false)

    })

    //Meter merdas para o botão de adcionar Eventos (Modal Eventos)
    let formEvento = document.getElementById('FormRegistarEvento')

    if (formEvento != null) {
        formEvento.addEventListener('submit', function (e) { //Verificar isto
            e.preventDefault()

            let dataEhora = [] //Vai guardar a data e hora num arrray porque sinhe
            let continuar = true
            let msgErro = document.getElementById('MsgErroRegistarEventos')


            let nome = document.getElementById('NomeEvento').value
            let data = document.getElementById('DataEvento').value
            console.log("A data é = " + data + " -(Ao ser definida)")

            let hora = document.getElementById('HoraEvento').value //Not required
            console.log("A hora é = " + hora + " -(Ao ser definida)")

            let descricao = document.getElementById('DescriçãoEvento').value //Not required, o valor de uma textarea é .value
            let categoria = document.getElementById('CategoriaEvento').value
            let foto = document.getElementById('FotografiaEvento').value //Not required
            let responsavel = document.getElementById('ResponsavelEvento').value


            //Nome
            if (!verificar(nome)) {
                continuar = false;
                console.log('O nome do evento já existe');

                //Personalizar a mensagem de Erro
                msgErro.innerHTML = "O nome do Evento já existe"
            }


            //Data e Hora
            if (hora == "") {
                let conf = confirm("Não indicou a hora do evento\nContinuar???") //VAi estar tudo em alerts, mudar isto para algo menos labajão

                if (conf == true) {
                    let bla = data + ";" + hora
                    dataEhora.push(bla)
                    console.log(dataEhora)
                }
                else {
                    //por o cenas na hora.....
                    document.getElementById('HoraEvento').focus()
                    continuar = false; //Ou seja, não vai fazer submit
                }
            }
            else {
                let bla = data + ";" + hora
                dataEhora.push(bla)
                console.log(dataEhora)
            }

            //Descrição
            if (descricao == "") {
                let conf = confirm("Continuar sem explicar o que caralhos é o evento???")

                if (!conf) {
                    document.getElementById('DescriçãoEvento').focus()
                    continuar = false;
                } //Deve faltar cenas aqui
            }

            //Fotografia
            if (foto == "") {

                let conf = confirm("Não introduziu uma foto \nContinuar sem mostrar as beiças?") //Dá para editar o texto desta merda?

                if (conf == false) {
                    continuar = false
                }

            }


            if (continuar == true) {
                //O que vai ficar no evento.Categoria vai ser o id de uma categoria
                if (categoriasUnicasFunc(categoria)) {
                    //Fazer esta merda

                    categorias.push(categoria)
                }

                let novoEvento = new Evento(nome, dataEhora, descricao, categoria, foto, responsavel, utilizadores[indexUtilizador].id)

                eventos.push(novoEvento)

                localStorage.setItem('eventos', JSON.stringify(eventos))

                console.log(eventos)
                console.log("O formato da data é = " + novoEvento._data[0])

                msgErro.innerHTML = "Belo ebento :)"
            }
            else {
                msgErro.innerHTML += "Está qualquer coisa male" //Esta merda está a entrar aqui quando não devia
            }
        })
    }

    //Modal Adicionar Evento
    //Limpar
    $("#ModalAdicionnarEventos").on('hide.bs.modal', function () {

        //Limpar o form
        formEvento.reset()

        //Limpar a msgErro
        document.getElementById('MsgErroRegistarEventos').innerHTML = ""
    });



    //Mexer no calendário
    //Tentar receber o dia para trabalha-lo
    let calendario = document.getElementById('calendario')
    if (calendario != null) {
        calendario.addEventListener('click', function (event) {
            //console.log(event.target.innerHTML) //Isto dá o numero do dia em que se clicou

            let conf = ""
            if (event.target.className == "btn-primary") {
                conf = confirm("Quer filtrar os eventos pelo dia " + event.target.innerHTML)
            }

            //Melhorar o confirmar para só aparecer a mensagem se o bo
            if (conf != "" && conf == true) {
                console.log("Olá Boutarde")
                let elDia = event.target.innerHTML;
                let temEventos = false
                let losDiasOcupados = []

                //FAzer uma função que filtre para o catálogo os eventos do dia selecionado
                for (let i = 0; i < eventos.length; i++) {
                    if (eventos[i].data[0] != undefined) {
                        let chacalaca = eventos[i].data[0].split(';')[0].split('-')[2]
                        console.log(chacalaca)

                        if (chacalaca == elDia) {
                            temEventos = true
                            losDiasOcupados.push(eventos[i]) //Depois ao passar o id para a função vai ser dessa maneira que os eventos vão ser filtrados para o catálogo
                            console.log(losDiasOcupados, temEventos)
                            btnResetCatalogo.style.display = 'inline-block'
                        }
                    }
                }


                let mostrar = false;

                if (temEventos == true) {
                    document.getElementById('ohPaEle').innerHTML = ""
                    for (let i = 0; i < losDiasOcupados.length; i++) {
                        //Aqui vai ser a tal função que vai filtrar os eventos... Que vai sempre funcionar passando um evento de cada vez
                        if (document.getElementById('ohPaEle') != null) {

                            if (logged == true) mostrar = paNaoSei(losDiasOcupados[i].userId)

                            if (losDiasOcupados[i].data != undefined && losDiasOcupados[i].data[0] != undefined) {
                                preencherCatalogo(losDiasOcupados[i].nome,
                                    losDiasOcupados[i].imagem,
                                    losDiasOcupados[i].descricao,
                                    losDiasOcupados[i].data[0].split(';')[0],
                                    losDiasOcupados[i].data[0].split(';')[1],
                                    losDiasOcupados[i].pontuacao,
                                    i, mostrar)
                            }
                            else if (losDiasOcupados[i].data != undefined && losDiasOcupados[i].data[0] == undefined) {
                                preencherCatalogo(losDiasOcupados[i].nome,
                                    losDiasOcupados[i].imagem,
                                    losDiasOcupados[i].descricao,
                                    "Por Anunciar",
                                    "Por Anunciar",
                                    losDiasOcupados[i].pontuacao,
                                    i, mostrar)
                            }
                        }
                    }
                }
            }
        })
    }


    //Mexer na data do calendário a partir das setas, feito
    let setasCalendario = document.getElementsByClassName('setas') //Array

    let contadorSetas = 0; //Vai servir para saber que setas mostrar ou não
    let novaData = new Date(datinha.getMonth() + 1 + "/" + datinha.getDate() + "/" + datinha.getFullYear())
    let cabecalhoCalendario = document.getElementById('DataCalendário')
    let mesDefinir = datinha.getMonth()

    console.log(novaData)

    if (setasCalendario[0] != undefined) {
        //seta esquerda 
        setasCalendario[0].addEventListener('click', function () {

            //Parte do calendário


            //Parte das Setas tratada....
            if (contadorSetas > 0) {
                contadorSetas--;
                mesDefinir--
                novaData.setMonth(mesDefinir);
                cabecalhoCalendario.innerHTML = novaData.toString().split(' ')[1] + " " + novaData.getFullYear()
                calendarioFixe(novaData.getMonth() + 1, novaData.getFullYear())
                marcarDias(novaData.getMonth() + 1);

                if (contadorSetas == 0) {
                    setasCalendario[0].style.display = 'none'
                }
            }
            if (contadorSetas < 6) {
                setasCalendario[1].style.display = 'inline-block'
            }


        })

        //Seta Direita
        setasCalendario[1].addEventListener('click', function () {

            //Parte das Setas tratada....
            if (contadorSetas < 6) {
                contadorSetas++;
                mesDefinir++
                novaData.setMonth(mesDefinir);
                cabecalhoCalendario.innerHTML = novaData.toString().split(' ')[1] + " " + novaData.getFullYear()
                calendarioFixe(novaData.getMonth() + 1, novaData.getFullYear())
                marcarDias(novaData.getMonth() + 1);

                if (contadorSetas == 6) {
                    setasCalendario[1].style.display = 'none'
                }
            }

            if (contadorSetas > 0) {
                setasCalendario[0].style.display = 'inline-block'
            }
        })
    }


    //Botão para pesquisar/filtrar eventos
    let btnPesquisar = document.getElementById('btnPesquisar')
    if (btnPesquisar != undefined) {

        btnPesquisar.addEventListener('click', function () {

            //Mostrar o botão para dar reset ao catálogo
            btnResetCatalogo.style.display = 'inline-block'

            let filtraditos = [];

            let searchNome = document.getElementById('searchNome').value
            let searchGenero = document.getElementById('searchGenero').value
            let c = document.getElementById('searchData')

            let searchData = c.options[c.selectedIndex].value

            if (searchNome != "") {
                filtraditos = eventos.filter(function (evento) {
                    //Como nome dos eventos são unicos, se ele puser o nome todo só vai aparecer um resultado 
                    return evento.nome
                        .toUpperCase()
                        .includes(searchNome.toUpperCase())
                })
                msgErroCatalogo(filtraditos.length)
                console.log(filtraditos + "---" + searchNome)
            }

            if (searchGenero != "") {
                console.log('genero = ' + searchGenero)
                if (searchNome == "") {
                    console.log(eventos)
                    filtraditos = eventos.filter(function (evento) {
                        return evento.categoria
                            .toUpperCase()
                            .includes(searchGenero.toUpperCase())
                    })
                    msgErroCatalogo(filtraditos.length)
                }
                else {
                    filtraditos = filtraditos.filter(function (evento) {
                        return evento.categoria
                            .toUpperCase()
                            .includes(searchGenero.toUpperCase())
                    })
                    msgErroCatalogo(filtraditos.length)
                }
            } //Tenho que ver o que esta merda vai dar e depois fazer alterações em principio

            //Ainda tenho que fazer a função para a data, por agora testar só pelos dois campos, udpadate: filtrar por nome e categoria esta feito, nenhum erro por agora

            //Filtrare por data
            if (searchData != 'Todos') {
                if (filtraditos.length > 0) {
                    filtraditos = filtrarPorData(filtraditos, searchData); //caca
                }
                else {
                    filtraditos = filtrarPorData(eventos, searchData);
                }
            }

            console.log("filtraditos = " + filtraditos)
            if (filtraditos.length > 0) {
                if (document.getElementById('ohPaEle') != null) {
                    //Limpar a tabela
                    document.getElementById('ohPaEle').innerHTML = ""

                    let chicharrito = false

                    for (let i = 0; i < filtraditos.length; i++) {

                        if (logged == true) chicharrito = paNaoSei(filtraditos[i].userId)

                        if (filtraditos[i].data[0] != undefined) {
                            preencherCatalogo(filtraditos[i].nome,
                                filtraditos[i].imagem,
                                filtraditos[i].descricao,
                                filtraditos[i].data[0].split(';')[0],
                                filtraditos[i].data[0].split(';')[1],
                                filtraditos[i].pontuacao
                                , i, chicharrito)
                        }
                        else if (filtraditos[i].data[0] == undefined) {
                            preencherCatalogo(filtraditos[i].nome,
                                filtraditos[i].imagem,
                                filtraditos[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                filtraditos[i].pontuacao //Fazer alguma merda quando a pontuação não estiver definida
                                , i, chicharrito)
                        }
                    }
                }
            }
        })
    }

    //Botão para fazer reset ao catálogo
    let btnResetCatalogo = document.getElementById('btnLimparCatalogo')
    if (btnResetCatalogo != null) {
        btnResetCatalogo.addEventListener('click', function () {

            document.getElementById('ohPaEle').innerHTML = "";
            encherCatalogo()

            //Limpar os filtros, sim ou não????

            //Esconder o botão
            btnResetCatalogo.style.display = 'none'
        })
    }


    let formModificarEvento = document.getElementById('ModalModificarEvento')
    if (formModificarEvento != null) {
        formModificarEvento.addEventListener('submit', function (e) {
            e.preventDefault()

            let elId = 0;

            for (let i = 0; i < eventos.length; i++) {
                if (eventos[i].id == idEventoAlterar) {
                    elId = i
                }
            }

            eventos[elId].nome = document.getElementById('NomeEvento2').value
            eventos[elId].data[0] = document.getElementById('DataEvento2').value + ";" + document.getElementById('HoraEvento2').value
            eventos[elId].descricao = document.getElementById('DescriçãoEvento2').value
            eventos[elId].categoria = document.getElementById('CategoriaEvento2').value
            eventos[elId].imagem = document.getElementById('FotografiaEvento2').value
            eventos[elId].responsavel = document.getElementById('ResponsavelEvento2').value

            //Mensagem de "erro", depois talvez precise de mexer nisto
            document.getElementById('MsgErroRegistarEventos2').innerHTML = "Como dizia o meu tio Carlos \nBem Introduzido"

            // console.log(eventos)
            //"Gravar" as mudanças
            localStorage.setItem("eventos", JSON.stringify(eventos)) //O que estou a fazer mal para ao dar refresh os eventos não estarem alterados
        })
    }

    //Modal Adicionar Evento
    //Limpar
    $("#ModalModificarEvento").on('hide.bs.modal', function () {

        //Limpar o form
        document.getElementById('FormRegistarEvento2').reset()

        //Limpar a msgErro
        document.getElementById('MsgErroRegistarEventos2').innerHTML = ""
    });


    let btnPesquisaAvancada = document.getElementById('btnPesquisaAvancada')
    if (btnPesquisaAvancada != null) {
        btnPesquisaAvancada.addEventListener('click', function () {
            let botones = document.getElementsByClassName('ordenhar')
            console.log(botones)

            let mostrar = false

            //Mostrar o botão para dar reset ao catalogo
            btnResetCatalogo.style.display = 'inline-block'

            let cenasPesquisar = ""
            for (let i = 0; i < botones.length; i++) {
                //console.log(botones[i].value)
                if (botones[i].checked == true) {
                    cenasPesquisar = botones[i].value
                }
            }

            eventosRealizadosENemPorIsso();

            if (cenasPesquisar == "Melhor Pontuados") {
                document.getElementById('ohPaEle').innerHTML = ""
                //Só dá para fazer esta quando começarmos a pontuar eventos, mas a função está feita e a funcionar
            }
            else if (cenasPesquisar == "Eventos Realizados") {
                if (realizados.length > 0) {
                    document.getElementById('ohPaEle').innerHTML = ""

                    for (let i = 0; i < realizados.length; i++) {

                        if (logged == true) mostrar = paNaoSei(realizados[i].userId)

                        if (realizados[i].data != undefined && realizados[i].data[0] != undefined) {
                            preencherCatalogo(realizados[i].nome,
                                realizados[i].imagem,
                                realizados[i].descricao,
                                realizados[i].data[0].split(';')[0],
                                realizados[i].data[0].split(';')[1],
                                realizados[i].pontuacao,
                                i, mostrar)
                        }
                        else if (realizados[i].data != undefined && realizados[i].data[0] == undefined) {
                            preencherCatalogo(realizados[i].nome,
                                realizados[i].imagem,
                                realizados[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                realizados[i].pontuacao,
                                i, mostrar)
                        }
                    }
                }
                else {
                    document.getElementById('ohPaEle').innerHTML = "Nâo há cá Disso!!!"
                }
            }
            else if (cenasPesquisar == "por Realizar") {
                if (notRealizados.length > 0) {
                    document.getElementById('ohPaEle').innerHTML = ""

                    for (let i = 0; i < notRealizados.length; i++) {

                        if (logged == true) mostrar = paNaoSei(notRealizados[i].userId)

                        if (notRealizados[i].data != undefined && notRealizados[i].data[0] != undefined) {
                            preencherCatalogo(notRealizados[i].nome,
                                notRealizados[i].imagem,
                                notRealizados[i].descricao,
                                notRealizados[i].data[0].split(';')[0],
                                notRealizados[i].data[0].split(';')[1],
                                notRealizados[i].pontuacao,
                                i, mostrar)
                        }
                        else if (notRealizados[i].data != undefined && notRealizados[i].data[0] == undefined) {
                            preencherCatalogo(notRealizados[i].nome,
                                notRealizados[i].imagem,
                                notRealizados[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                notRealizados[i].pontuacao,
                                i, mostrar)
                        }
                    }
                }
                else {
                    document.getElementById('ohPaEle').innerHTML = "Nâo há cá Disso!!!" //Isto nunca deve acontecer
                }
            }
            else if (cenasPesquisar == "Recentes") {
                document.getElementById('ohPaEle').innerHTML = ""
                ordenharPorData();
            }
        })
    }

    //Função para o submit de uma parceria

    let formParceria = document.getElementById('formParceria')
    if (formParceria != undefined) {
        formParceria.addEventListener('submit', function (event) {
            event.preventDefault();

            let continuar = true
            let msgErro = ""
            let elErro = document.getElementById('MensagemMamaAquiNaPila')

            let nomeP = document.getElementById('nomeP').value
            let nomeL = document.getElementById('nomeL').value //Estas dois campos vºao porder ser adicionados depois
            let nomeLink = document.getElementById('nomeLink').value

            for (let i = 0; i < parcerias.length; i++) {
                if (nomeP == parcerias[i].nome) {
                    continuar = false;
                    msgErro = "O nome da Empresa já existe"
                }
            }

            if (nomeL == "" || nomeLink == "") {

                let msg = confirm("continuar sem preencher todos os campos?")

                if (!msg) continuar = false
            }

            //Adicionar confirms para os campos que não forem preenchidos, done à trolha
            //Adicinar mensagem de erro, done
            //Gravar o array em local storage, done


            if (continuar == true) {

                let parceria = new Parceria(nomeP, nomeL, nomeLink)

                parcerias.push(parceria)

                //Criar a tabela de novo


                //Gravar o array
                localStorage.setItem('parcerias', JSON.stringify(parcerias))

                //Dizer que o admin é lindo
                elErro.innerHTML = "O Admin é Lindo"

            }
            else {
                elErro.innerHTML = msgErro
            }

        })

        //Modal Parcerias
        //Limpar
        $("#ModalParceria").on('hide.bs.modal', function () {

            //Limpar o form
            document.getElementById('formParceria').reset()

            //Limpar a msgErro
            document.getElementById('MensagemMamaAquiNaPila').innerHTML = ""
        });
    } 

    //Fazer uma cena para alterar a parceria
    let formAltParceria = document.getElementById('formAlterarParceria')
    formAltParceria.addEventListener('submit', function(e){
        e.preventDefault()

        let sinhe = true

        let nome = document.getElementById('nomePAlt').value
        let localizacao = document.getElementById('nomeLAlt').value
        let link = document.getElementById('nomeLinkAlt').value


        if(localizacao == "" || link == ""){
            let conf = confirm("Tem campos por preencher, continuar?")

            if(!conf) sinhe = false
        }
    
        if(sinhe){
            for(let i = 0; i< parcerias.length; i++){
                if(idDaParceriaModificar == parcerias[i].id){
                    parcerias[i].nome = nome
                    parcerias[i].localizacao = localizacao
                    parcerias[i].link = link

                    document.getElementById('MensagemMamaAquiNaPila').innerHTML = "Be mudado, És Ganda cena"
                }
            }


            document.getElementById('corpoParcerias').innerHTML = ""
            for(let i = 0; i<parcerias.length; i++){
                preencherTabelaUtiPar(parcerias[i].nome, parcerias[i].link, parcerias[i].id, true)
            }
            //Falta gravar o novo array
            
        }
    })

    let forminhaModificarEvento = document.getElementById('FormRegistarEventoAlt')
    forminhaModificarEvento.addEventListener('submit', function(e){
        e.preventDefault()

        // let nomi
    })
}
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################

//---------------------------------------------- Funções ----------------------------------------------------------------------------------------

//Função para preencher o catálogo com uma mensagem de "erro", para o caso de não existir nenhum evneto à medida que se vai procurando o evento
function msgErroCatalogo(tamanhoArray) { //Nome de merda

    // let seguir = true
    if (tamanhoArray == 0) { //Ver como isto fica
        document.getElementById('ohPaEle').innerHTML = "Não foi encontrado nenhum evento que corresponda com a pesquisa..." //Como centrar o texto diretamente por aqui
        //seguir = false //Vai retornar false para ajudar, por agora não
    }
}

//Função para saber se se vai mostrar o menu nos eventos ou não
function paNaoSei(eventoUserId) {

    let mostrar = false;

    if (logged == true && utilizadores[indexUtilizador].fotografia == "Administrador") {
        mostrar = true
    }
    else if (logged == true && utilizadores[indexUtilizador].fotografia == "Docente") { //Isto está como fotografia poorque mim ser estupido, é para ficar em tipoUtilizador
        if (eventoUserId == utilizadores[indexUtilizador].id) {
            mostrar = true
        }
    }

    return mostrar
}

//Filtrar os Eventos, voltar aqui e fazer duas funções auxiliares
function filtrarEventos(nome, genero, data) {

    let arrayMaiLindo = [] //Vai filtrado por nome e/ou genero e depois é igualdo ao array que sair da função que o filtra por data


    if (nome != "" || genero != "") {

    }
    else if (nome == "" && genero == "") {
        //Só função para data
        if (data != "") {

        }
    }

}
//Função para preencher o carrosel 
function preencherCarrosel(cardName, cardImage, cardDescricao, cardData, cardHora, cardPontuacao, indice) {

    let container = document.getElementById('containerCardsCarrosel')

    //Div para por o cartão
    let div1 = document.createElement('div')
    if (indice == 0) div1.setAttribute('class', 'carousel-item col-md-4 active');
    else div1.setAttribute('class', 'carousel-item col-md-4')
    //Cartão
    let div2 = document.createElement('div')
    div2.setAttribute('class', 'card')

    //Meter o cartão dentro do seu container
    div1.appendChild(div2)

    //Imagem
    let divImg = document.createElement('img') //As imagens não estão a aparecer
    if (indice == 0) divImg.setAttribute('class', 'card-img-top img-fixed');
    else divImg.setAttribute('class', 'card-img-top img-fluid')

    divImg.setAttribute('src', "images/4.png")

    div2.appendChild(divImg)

    //Corpo do Card
    let cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body')

    div2.appendChild(cardBody)

    //Titulo
    let titulo = document.createElement('h4')
    titulo.setAttribute('class', 'card-title')
    titulo.textContent = cardName

    cardBody.appendChild(titulo)

    //Descrição
    let descricao = document.createElement('p')

    //descricao = ajustarDescricao(descricao)
    descricao.setAttribute('class', 'card-text')
    descricao.textContent = ajustarDescricao(cardDescricao)

    cardBody.appendChild(descricao)

    //Botão + (Ver detalhes)
    let btnDetalhes = document.createElement('a')
    btnDetalhes.setAttribute('class', 'btn btn-primary')
    btnDetalhes.innerHTML = '+'

    cardBody.appendChild(btnDetalhes)

    //Detalhes do Evento
    let detalhes = document.createElement('p')
    detalhes.setAttribute('class', 'card-text desricao-card-carrosel') //Por esta merda em letras mais pequenas
    detalhes.innerHTML = `Data: ${cardData} 
                        Hora: ${cardHora}
                        Pontuação: ${cardPontuacao}`

    div2.appendChild(detalhes)

    container.appendChild(div1)

}

//Função para preencher o catálogo ao entrar na página
function encherCatalogo() {
    contador = 0;

    let mostrar = false

    //Limpar catálogo
    document.getElementById('ohPaEle').innerHTML = ""

    for (let i = 0; i < eventos.length; i++) {
        if (document.getElementById('ohPaEle') != null) { //Isto secalhar vai para uma função

            if (logged == true) mostrar = paNaoSei(eventos[i].userId)

            if (eventos[i].data[0] != undefined) {
                preencherCatalogo(eventos[i].nome,
                    eventos[i].imagem,
                    eventos[i].descricao,
                    eventos[i].data[0].split(';')[0],
                    eventos[i].data[0].split(';')[1],
                    eventos[i].pontuacao
                    , i, mostrar)
            }
            else if (eventos[i].data[0] == undefined) {
                preencherCatalogo(eventos[i].nome,
                    eventos[i].imagem,
                    eventos[i].descricao,
                    "Por Anunciar",
                    "Por Anunciar",
                    eventos[i].pontuacao //Fazer alguma merda quando a pontuação não estiver definida
                    , i, mostrar)
            }
        }
    }
}

//Função para preencher o catálogo, Navegação para cima deles

let linhaContainer = ""

function preencherCatalogo(cardName, cardImage, cardDescricao, cardData, cardHora, cardPontuacao, indice, mostrarMenu/* = false*/) { //A parte de filtrar é feita antes, esta função só preenche

    //Botão hamburguer para dropdown

    //Container
    let divGrande = document.createElement('div')
    divGrande.setAttribute('class', 'btn-group dropleft')

    if (!mostrarMenu) {
        divGrande.style.display = 'none'
    }
    else {
        divGrande.removeAttribute('style')
        /*Ou divGrande.setAttribute('style', ''), ou seja style vazio */
    }

    //Botão
    let btnMenu = document.createElement('button')
    btnMenu.setAttribute('type', 'button')
    btnMenu.setAttribute('class', "navbar-toggler-1")
    btnMenu.setAttribute('data-toggle', 'dropdown')


    //Três pontos que fazem de Menu
    let menu3Pontos = document.createElement('span')
    menu3Pontos.setAttribute('class', 'navbar-toggler-icon')

    btnMenu.appendChild(menu3Pontos)
    divGrande.appendChild(btnMenu)

    //Dropdown e conteudo
    let divPequena = document.createElement('div')
    divPequena.setAttribute('class', 'dropdown-menu')

    divGrande.appendChild(divPequena)

    //3 Opções que por agora vão ser default, e que vão ter que ser mudadas
    let btn1 = document.createElement('button')
    btn1.setAttribute('class', 'dropdown-item ' + eventos[indice].id)
    btn1.setAttribute('type', 'button')
    btn1.textContent = "Mexer-lhe"

    //Fazer com que abra uma modal
    btn1.setAttribute('data-toggle', 'modal')
    btn1.setAttribute('data-target', '#ModalModificarEvento')
    btn1.addEventListener('click', nemSei) //Função para 'editar' o evento, depois para modificar lo é um eventListener no submit na modal

    let btn2 = document.createElement('button')
    btn2.setAttribute('class', 'dropdown-item ' + eventos[indice].id)
    btn2.setAttribute('type', 'button')
    btn2.textContent = "Remover"

    //Adicionar lhe um eventListener
    btn2.addEventListener('click', funcaoLeinda)

    let btn3 = document.createElement('button')
    btn3.setAttribute('class', 'dropdown-item')
    btn3.setAttribute('type', 'button')
    btn3.textContent = "ata"

    divPequena.appendChild(btn1)
    divPequena.appendChild(btn2)
    divPequena.appendChild(btn3)

    //Container principal
    let bossContainer = document.getElementById('ohPaEle') //Meter tudo aqui

    //O cartão em si
    let cartao = document.createElement('div')
    cartao.setAttribute('class', 'card col-lg-3 ' + eventos[indice].id) //Em vez de lg, secalhar fica md

    //Div Imagem / Imagem 
    let divHeader = document.createElement('div')
    divHeader.setAttribute('class', 'card-header')

    let imagem = document.createElement('img')
    imagem.setAttribute('class', 'card-img') //Pode ter que ser card-img-top, só com o card-img é que a imagem see adapta ao tamanho do card
    imagem.setAttribute('src', cardImage)

    divHeader.appendChild(imagem) //Imagem no sitio
    cartao.appendChild(divHeader) //Cabeçalho com a imagem dentro do cartão

    //Corpo do cartão
    let corpitoJeitoso = document.createElement('div')
    corpitoJeitoso.setAttribute('class', 'card-body')

    //Nome do Evento
    let titulo = document.createElement('h5')
    titulo.setAttribute('class', 'card-title')
    titulo.textContent = cardName

    titulo.appendChild(divGrande)
    corpitoJeitoso.appendChild(titulo)

    //Descrição
    let descricao = document.createElement('p')

    //descricao = ajustarDescricao(descricao)
    descricao.setAttribute('class', 'mnac')
    descricao.textContent = ajustarDescricao(cardDescricao)
    corpitoJeitoso.appendChild(descricao)

    //Data
    let dataCard = document.createElement('p')
    dataCard.setAttribute('class', 'mnac')
    dataCard.textContent = "Data: " + cardData;
    corpitoJeitoso.appendChild(dataCard)

    //Hora
    let horaCard = document.createElement('p')
    horaCard.setAttribute('class', 'mnac')
    horaCard.textContent = "Hora: " + cardHora;
    corpitoJeitoso.appendChild(horaCard)

    //Pontuação
    let pont = document.createElement('p')
    pont.setAttribute('class', 'mnac')
    pont.textContent = "Pontuação: " + cardPontuacao
    corpitoJeitoso.appendChild(pont)

    //Meter o corpo no cartão... Eu daqui a uns anos, get it, sem abrigo eheh
    cartao.appendChild(corpitoJeitoso)


    //Esta div leva 4 cards, fazer um if aqui para dizer se ficam na linha ou é criada outra, como caralhos fazer esta filha da putice
    if (indice % 4 == 0) {
        linhaContainer = document.createElement('div')
        linhaContainer.setAttribute('class', 'row linha-cards')
    }

    //Mats
    contador += indice
    if (contador > 4) contador = 0; //Confirmar se é =4 ou >4

    //appened quase Final
    linhaContainer.appendChild(cartao)

    //appened Final
    bossContainer.appendChild(linhaContainer)
}

//Função que vai ser associada ao botão "Mexer-lhe", no menu dos cards
function nemSei(event) {
    let idEventoProcurar = event.target.className.split(' ')[1]
    idEventoAlterar = idEventoProcurar

    let oTal = eventos.filter(function (evento) {
        return evento.id == idEventoProcurar
    })

    //Tira trabalho
    oTal = oTal[0]

    console.log(oTal)

    let nome = document.getElementById('NomeEvento2')
    let data = document.getElementById('DataEvento2')

    let hora = document.getElementById('HoraEvento2') //Not required

    let descricao = document.getElementById('DescriçãoEvento2') //Not required, o valor de uma textarea é .value
    let categoria = document.getElementById('CategoriaEvento2')
    let foto = document.getElementById('FotografiaEvento2') //Not required
    let responsavel = document.getElementById('ResponsavelEvento2')

    nome.value = oTal.nome

    if (oTal.data[0] != undefined) data.value = oTal.data[0].split(';')[0]
    // else data.value = "TBA"
    if (oTal.data[0].split(';')[1] != "") hora.value = oTal.data[0].split(';')[1]
    if (oTal.descricao != "") descricao.value = oTal.descricao
    categoria.value = oTal.categoria
    if (oTal.imagem != "") foto.value = oTal.imagem
    responsavel.value = oTal.responsavel
}

//Função que vai ser associada ao botão remover nos cards
function funcaoLeinda(event) {

    //console.log(event.target.className)

    let loId = event.target.className.split(' ')[1]
    console.log(loId)

    let conf = confirm('Tem a certeza que quer remover o evento?????')

    if (conf) {
        for (let i = 0; i < eventos.length; i++) {
            if (eventos[i].id == loId) {
                eventos.splice(i, 1)
            }
        }

        //"Gravar" as alterações
        localStorage.setItem('eventos', JSON.stringify(eventos))

        //Dar refresh ao catálogo
        encherCatalogo()
    }
}


//Guardar o estado da variavel logged em localstorage para ser usada noutras páginas
function estadoLogged() { //Os nomes das funções estão uma piça, porque esta função tabém vai determinar se se mostra o botão de logoff ou login

    if (localStorage.getItem('logged')) {
        logged = JSON.parse(localStorage.getItem('logged'))
        console.log(logged)
    }
}

//Função para ver o perfil de utilizador
function verPerfil(esconder) {

    //Se esconder for true esconde o perfil, senão mostra-o

    let perfil = document.getElementById('Perfil')

    if (esconder) {
        //Mostrar o perfil
        perfil.removeAttribute('style')
    }
    else {
        perfil.setAttribute('style', 'display: none')
    }
}


//Função para verificar se o nome existe
function verificar(lemerde) { //Tentar fazer esta função reutilizavel para outros arrays e para outros campos sem ser o nome

    let sbe = true;

    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].nome == lemerde) {
            sbe = false;
        }
    }

    return sbe;
}


let diasOcupados = []; //VAi ser usado nas funções marcarDias() e diasComEventos()

//Marcar os dias com eventos a azul
function marcarDias(mes) { //Por acabar, vai ter que receber o mes para depois passa lo para a função diasComEventos()

    let diasMarcar = [] //Vai fazer com que não se faça tudo num só for(), e dá para passar para uma função
    let semanas = document.getElementsByClassName('Dias') //Para brincar com os dias usar children ou childNodes

    for (let i = 0; i < semanas.length; i++) {
        let dias = semanas[i].children

        for (let k = 0; k < dias.length; k++) {
            dias[k].removeAttribute('class')
        }
    }


    for (let i = 0; i < semanas.length; i++) {
        let dias = semanas[i].children

        for (let k = 0; k < dias.length; k++) {
            //console.log(dias[k].innerHTML)
            //Função que preencha um array com os dias ocupados e devolva esse array

            //console.log(eventos[i]._data[0].split(';')[0].split('-')[2])
            if (diasComEventos(dias[k].innerHTML, mes)) {
                dias[k].setAttribute('class', 'btn-primary')
            }
        }
    }
}

//Vai retornar um array com os dias que têm eventos
function diasComEventos(dia, mes) { //Por acabar 

    //Sempre que um dia tenha eventos retorna true e os eventos, que pode ser util para filtrar os eventos desse dia, hmmmm... não me cheira

    //let eventosDoDia = []
    let possuiEvento = false;

    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].data[0] != undefined) {     /*O que estava mal era que não dá para fazer split de undefined e como ás vezes a data pode
                                                    não estar definida e esta linha tem que existir para não crashar, isso ou o try/catch*/
            if (eventos[i].data[0].split(';')[0].split('-')[2] == dia && parseInt(eventos[i].data[0].split(';')[0].split('-')[1]) == mes) {
                possuiEvento = true
            }
        }
    }

    return possuiEvento
}

//Confirmar se o mail já existe
function confMail(mail) {
    let bamos = true
    for (let i = 0; i < utilizadores.length; i++) {
        if (utilizadores[i].mail == mail) {
            bamos = false;
        }
    }

    return bamos;
}

//Personalizar mensagem de erro
function mensagemErro(email, passi) {
    let mensagem = ""

    if (email) { //Ou seja o email não existe
        mensagem = "O mail que introduziu não existe"
    }
    else if (passi) { //Se o mail existe mas a pass é true, então é porque o mail e a pass não correspondem
        mensagem = "A password está errada"
    }

    return mensagem
}

//Função para não deixar marcar eventos anteriores à data atual
function minDate() {
    let data = new Date()

    let datinha = data
        .toISOString()
        .split('T')[0]

    //Definir o mes do calendário
    mesNoCalendario = data.toDateString()
        .split(' ')[1] + "  " + data.toDateString().split(' ')[3]


    console.log(datinha)

    let cal = document.getElementById('DataEvento')

    //Estes if's são para quando não existir certo elemento numa página, as merdas não darem erros
    if (cal != null)
        cal.setAttribute('min', datinha)
}

//Por o ano no calendário
function coco() {
    if (document.getElementById('DataCalendário') != null) //Isto devia ser feito com try catch
        document.getElementById('DataCalendário').innerHTML = mesNoCalendario
}

//Função para preencher o catálogo, esta função deve também ser usada quando as setas para mexer no mês forem clicadas, nah, hmmmm +-
function brincadeirasCalendário(mesito = "") { //Em principio não vai voltar a ser usado, foi para testes

    let dias = document.getElementsByClassName('Dias')

    //Inicial por ser a variavel que vai ter a data sem usar nenhuma função
    //Vai ficar deste género: Tue May 08 2018 18:34:27 GMT+0100 (Hora de Verão de GMT)

    // if(mesito != ""){ Fazer esta merda 

    // }
    // else{

    // }

    let dataInicial = new Date()
    console.log("dataInicial - " + dataInicial)

    //Merdas auxiliares
    let data1 = dataInicial.toLocaleDateString()
    console.log("Vai dar mês/dia/ano - " + data1) //Em principio é igual a 08/05/2018

    let data2 = dataInicial.toString().split(' '); //[0]- Dia da semana, [1]- Mês, [2]- Dia, [3]- Ano, etc...
    console.log("Vai dar um array com vários elementos da data de hoje - " + data2)

    let data3 = data2[1] + '/01/' + data2[3]
    console.log("Só ver a data3 - " + data3)

    let maisData = new Date(data3)
    console.log("Ver as cenas todas para o inicio do mês - " + maisData)

    let diaDaSemana = maisData.toString().split(' ')[0]
    console.log("Deve dizer me que dia da semana foi o dia 1 deste mês - " + diaDaSemana)

    let indici = inicioDoMes(diaDaSemana)
    console.log("O indice devolvido é - " + indici)

    let contadorDias = 1; //Vai servir para meter o numero dos dias no calendário

    let diaMaximus = fimDoMes(dataInicial.getMonth())
    console.log(diaMaximus)

    //--------------------------------------------------------------------------------  
    for (let i = 0; i < dias.length; i++) {
        for (let k = indici; k < dias[i].children.length; k++) {

            if (contadorDias <= diaMaximus) {

                dias[i].children[k].innerHTML = contadorDias
                console.log("indice - " + k + "|| dias - " + contadorDias)
                contadorDias++;

            }

        }

        indici = 0;
    }
    //Feito
}
//Função auxiliar à de cima
function inicioDoMes(dia) {
    //Vai receber o dia e retornar o indice em que esse dia se encontra

    let bla = 8 //Indice que nunca é usado 

    if (dia == 'Sun') {
        bla = 0;
    }
    else if (dia == 'Mon') {
        bla = 1;
    }
    else if (dia == 'Tue') {
        bla = 2;
    }
    else if (dia == 'Wed') {
        bla = 3;
    }
    else if (dia == 'Thu') {
        bla = 4;
    }
    else if (dia == 'Fri') {
        bla = 5;
    }
    else if (dia == 'Sat') {
        bla = 6;
    }

    return bla
}

//Vai devolver quanto dias tem o mes em questão
function fimDoMes(mes) {
    let bla = 0

    //let mes = parseInt(mesito), em principio isto não é preciso

    if (mes == 1) { //Melhorar este código de merda
        bla = 31;
    }
    else if (mes == 2) { //Fazer o Fevereiro direito
        bla = 28;
    }
    else if (mes == 3) {
        bla = 31;
    }
    else if (mes == 4) {
        bla = 30;
    }
    else if (mes == 5) {
        bla = 31;
    }
    else if (mes == 6) {
        bla = 30;
    }
    else if (mes == 7) {
        bla = 31;
    }
    else if (mes == 8) {
        bla = 31;
    }
    else if (mes == 9) {
        bla = 30;
    }
    else if (mes == 10) {
        bla = 31;
    }
    else if (mes == 11) {
        bla = 30;
    }
    else if (mes == 12) {
        bla = 31;
    }

    return bla
}

//Limitar a descrição nos cards, vai retornar uma string que se for demasiado grande vai ter reticencias no fim
function ajustarDescricao(desc) {

    let frase = ""

    //console.log('A frase - ' + desc)
    if (desc.length > 50) {
        frase = desc.substr(0, 50) + "...";
        //console.log(frase)
    }
    else {
        frase = desc
        //console.log('fodeu')
    }

    return frase;
}

//Função para preecher o calendário com um mes qualquer
function calendarioFixe(mes, ano) { //TEm que ser o numero do mês

    let dias = document.getElementsByClassName('Dias')

    let diaUm = mes + "/01/" + ano

    let data = new Date(diaUm) //Inicio do mês

    let data1 = data.toString().split(' ') //[0]- Dia da semana, [1]- Mês, [2]- Dia, [3]- Ano, etc...

    let fimMes = fimDoMes(mes)

    let indici = inicioDoMes(data1[0])
    //console.log("O indice devolvido é - " + indici)

    let contadorDias = 1

    for (let i = 0; i < dias.length; i++) {
        for (let k = indici; k < dias[i].children.length; k++) {

            if (contadorDias <= fimMes) {

                dias[i].children[k].innerHTML = contadorDias
                //console.log("indice - " + k + "|| dias - " + contadorDias)
                contadorDias++;

            }

        }

        indici = 0;
    }
}

//Funções que não sei onde usar mas que já vão estar feitas #######################################################################3

//Função para filtrar eventos realizados e por realizar

//Vai precisar de dois arrays globais para ser de fácil acesso
let realizados = []
let notRealizados = []

function eventosRealizadosENemPorIsso() { //Que cria o arrayDosMili

    realizados = []
    notRealizados = []

    let hoje = new Date()
    let dataEvento = ""

    for (let i = 0; i < eventos.length; i++) { //Isto provavelmente pode ser uma função
        if (eventos[i].data.length > 0) {
            let dia = eventos[i].data[0]
                .split(';')[0]
                .split('-')[2]

            let mes = eventos[i].data[0]
                .split(';')[0]
                .split('-')[1]

            let ano = eventos[i].data[0]
                .split(';')[0]
                .split('-')[0]

            let date = mes + '/' + dia + '/' + ano
            //console.log(date)



            let horache = ""
            if (eventos[i].data[0].split(';')[1] != "") {
                let horas = eventos[i].data[0]
                    .split(';')[1]
                    .split(':')[0]

                let minutes = eventos[i].data[0]
                    .split(';')[1]
                    .split(':')[1]

                horache = ',' + horas + ':' + minutes
                //console.log(horache)
            }

            if (horache != "") {
                date += horache
            }

            //console.log("date = " + date)
            dataEvento = new Date(date)
            //console.log("dataEvento = " + dataEvento)

            //FAzer aqui também a parte de passar os milissegundos para um array
            let idMaisMili = dataEvento.getTime() + "-" + eventos[i].id //Assim poupa imenso trabalho, em principio
            //Sendo milisegundos em 1º e depois o id, dá para ordenar diretamente em principio


            arrayDosMili.push(idMaisMili)
            // console.log("idMaisMili = " + idMaisMili)

            if (hoje.getTime() >= dataEvento.getTime()) {
                realizados.push(eventos[i])
            }
            else {
                notRealizados.push(eventos[i])
            }
        }
    }

    console.log(realizados)
    console.log(notRealizados)
}

function melhorPontuados() {

    let array1 = eventos.concat()

    array1.sort(function (a, b) { return b.pontuacao - a.pontuacao })

    let array2 = []

    for (let i = 0; i < array1.length; i++) {
        array2.push(array1[i])
    }

    return array2 //Array com os 5 eventos mais bem classificados, nah, se depois quisermos só os cinco melhores pegamos nos cinco primeiros do array devolvido

}

let arrayDosMili = [] //Vou transformar as datas em milisegundos e depois ordenar o array principal

//Função para ordenar os eventos do mais perto para o mais longe, fds.....
function ordenharPorData() {

    let arrayQueEventualmenteVaiSerOrdenado = eventos.concat() //Copiar o array eventos para o outro, já não deve ser preciso

    let auxiliar = arrayDosMili.sort(function (a, b) { return a.split('-')[0] - b.split('-')[0] }) //Está ordenado por mais perto até mais longe
    //console.log(arrayDosMili)
    console.log(auxiliar)

    let mostrar = ""

    for (let i = 0; i < auxiliar.length; i++) {
        for (let k = 0; k < eventos.length; k++) {
            if (auxiliar[i].split('-')[1] == eventos[k].id) {
                if (logged == true) mostrar = paNaoSei(eventos[k].userId)

                if (eventos[k].data[0] != undefined) {
                    preencherCatalogo(eventos[k].nome,
                        eventos[k].imagem,
                        eventos[k].descricao,
                        eventos[k].data[0].split(';')[0],
                        eventos[k].data[0].split(';')[1],
                        eventos[k].pontuacao
                        , i, mostrar)
                }
                else if (eventos[k].data[0] == undefined) {
                    preencherCatalogo(eventos[k].nome,
                        eventos[k].imagem,
                        eventos[k].descricao,
                        "Por Anunciar",
                        "Por Anunciar",
                        eventos[k].pontuacao //Fazer alguma merda quando a pontuação não estiver definida
                        , i, mostrar)
                }
            }
        }
    }
}

//Função para filtrar por data 
function filtrarPorData(arrayLindo, filtration /*Que data vai ser filtrada*/) { //Vai receber um array para filtrar, que ou vai já estar filtrado, ou vai ser o array eventos

    // if('Todas as datas'), não vai ser preciso fazer isto porque é só deixar o array na mesma

    let dataHoje = new Date()
    let arrayDevolver = []

    dataHoje.setHours(23, 59, 59)

    //console.log("dataHoje" + dataHoje)
    console.log(arrayLindo)
    //console.log(filtration)

    eventosRealizadosENemPorIsso() //só pelo array com os milisagundos e o id dos eventos

    let diaEMes = ""
    let diaEMes2 = new Date()
    //Pegar no arrayDosMili e trabalha-lo
    if (filtration == 'hoje') { //
        for (let i = 0; i < arrayDosMili.length; i++) { //Maneira complicada
            console.log(parseInt(dataHoje.getTime()) - arrayDosMili[i].split('-')[0] + " ---- " + arrayDosMili[i].split('-')[1])
            if ((parseInt(dataHoje.getTime()) - arrayDosMili[i].split('-')[0]) <= 86400000 && (parseInt(dataHoje.getTime()) - arrayDosMili[i].split('-')[0]) > 0) {
                arrayDevolver.push(arrayDosMili[i].split('-')[1])
            }
        }
    }
    else if (filtration == 'amanha') {
        //Função para receber o dia e o mês, que podia ser usada em cima, depois é só procurar por eventos que correspondam
        for (let i = 0; i < arrayLindo.length; i++) {
            diaEMes = devolverDiaMes(arrayLindo[i])
            console.log("diaEMes - " + diaEMes)

            console.log((dataHoje.getMonth()))
            if (diaEMes != undefined && dataHoje.getMonth() + 1 == diaEMes.split(';')[1] && (dataHoje.getDate() + 1) == diaEMes.split(';')[0]) {
                arrayDevolver.push(arrayLindo[i])
            } //Não esquecer que o getMonth() dá os meses a começar em zero e não em 1
        }
    }
    else if (filtration == 'estaSemana') { //604800000, é o tempo que dura uma semana em milisegundos
        diaEMes2.setTime(diaEMes2.getTime() + 604800000)
        console.log(diaEMes2)

        for (let i = 0; i < arrayLindo.length; i++) {
            diaEMes = devolverDiaMes(arrayLindo[i])

            if (diaEMes != undefined && dataHoje.getMonth() + 1 == diaEMes.split(';')[1] && diaEMes.split(';')[0] >= dataHoje.getDate() && diaEMes.split(';')[0] <= diaEMes2.getDate()) {
                arrayDevolver.push(arrayLindo[i])
            } //Aparentemente está certo
        }
    }
    else if (filtration == "fds") {

        let mu = bibi()
        let dia1 = "";

        console.log(mu)
        for (let k = 0; k < arrayLindo.length; k++) {
            if (arrayLindo[k].data[0] != undefined) {
                dia1 = arrayLindo[k].data[0].split(';')[0]
                    .split('-')[2]

                console.log("dia1 - " + dia1)
                if (dia1 == mu[0] || dia1 == mu[1]) {
                    arrayDevolver.push(arrayLindo[k])
                }
            }
        }
    }
    else if (filtration == 'proximaSemana') {
        bibi() //Correr a função para ter o valor do inicio da proxima semana

        let mu = proximaSegunda.split(';')

        let intervalo1 = mu[0], intervalo2 = 0; //Intervalo temporal a procurar

        intervalo2 = new Date(mu[1] + "/" + mu[0] + "/" + dataHoje.getFullYear())

        intervalo2.setTime(intervalo2.getTime() + 604800000)
        // console.log(intervalo2)

        for (let i = 0; i < arrayLindo.length; i++) {
            if (arrayLindo[i].data[0] != undefined) {
                let nateDias = arrayLindo[i].data[0]
                    .split(';')[0]
                    .split('-')[2]

                let nateMes = arrayLindo[i].data[0]
                    .split(';')[0]
                    .split('-')[1] //Acho que isto é o mes

                console.log(mu[1], parseInt(nateMes))

                if (nateMes == mu[1] || nateMes == mu[1] + 1) {
                    if (nateDias >= intervalo1 && nateDias <= intervalo2.getDate()) {
                        console.log("entrou2")
                        arrayDevolver.push(arrayLindo[i])
                    }
                }
            }
        }
    }
    else if (filtration == "proximoMes") {

        let dataMil = new Date()

        dataMil.setMonth(dataMil.getMonth() + 1)

        let elMes = dataMil.getMonth() + 1

        //Fazer com que dataMil comece à meia noite do primeiro dia do mês
        dataMil.setDate(1)
        dataMil.setHours(0, 0, 0)

        while (dataMil.getMonth() + 1 == elMes) {


            for (let i = 0; i < arrayLindo.length; i++) {
                if (arrayLindo[i].data[0] != undefined) {

                    if (arrayLindo[i].data[0].split(';')[0].split('-')[1] == (dataMil.getMonth() + 1) && arrayLindo[i].data[0].split(';')[0].split('-')[2] == dataMil.getDate()) {
                        arrayDevolver.push(arrayLindo[i])
                    }
                }
            }

            dataMil.setDate(dataMil.getDate() + 1) //Incrementar a data, até chegar ao fim do Mês 
        }
    }



    console.log(arrayDevolver) //Este array mesmo sem dar refresh à página não devia acumular se, porque caralhos o faz

    return arrayDevolver
}
//Função que vai devolver o dia e o mes, para auxiliar a função de cima
function devolverDiaMes(elDia) {

    let dia = 0, mes = 0, ano = 0;

    if (elDia.data.length > 0) {
        let dia = elDia.data[0]
            .split(';')[0]
            .split('-')[2]

        let mes = elDia.data[0]
            .split(';')[0]
            .split('-')[1]

        let ano = elDia.data[0]
            .split(';')[0]
            .split('-')[0]

        let date = mes + '/' + dia + '/' + ano
        //console.log("mama qui na pila")



        let horache = ""
        if (elDia.data[0].split(';')[1] != "") {
            let horas = elDia.data[0]
                .split(';')[1]
                .split(':')[0]

            let minutes = elDia.data[0]
                .split(';')[1]
                .split(':')[1]

            horache = ',' + horas + ':' + minutes
            //console.log(horache)
        }

        if (horache != "") {
            date += horache
        }

        return dia + ";" + mes
    }
}

//Função para saber os fins de semana em principio
let proximaSegunda = 0; //Vai ser esta variável que vai dizer a partir de que dia se vai filtrar eventos ao ser escolhido "Próxima Semana"

function bibi() { //Mudar de nome e ver se resulta quando se está no fim de semana

    let data = new Date()

    let mesito = data.getMonth() + 1

    let primeiroFds = 0;

    let FimDeSemana = []

    let segundaFeira = false;

    while (data.getMonth() + 1 == mesito) {

        //console.log(data.getDate())


        data.setDate(data.getDate() + 1)

        let fds = data

        if ((data.toString().split(' ')[0] == 'Sun' || data.toString().split(' ')[0] == 'Sat') && primeiroFds < 2) {
            //console.log(data.getDate())
            FimDeSemana.push(data.getDate())
            // console.log(FimDeSemana)
            console.log(primeiroFds)
            primeiroFds++
        }

        if (primeiroFds == 2 && segundaFeira == false) {
            console.log(data.getDate() + 1) //Aceder a este valor

            let aux = data.getMonth() + 1
            proximaSegunda = data.getDate() + 1 + ";" + aux
            segundaFeira = true;

        }
    }

    return FimDeSemana
}

//Back-office###############################################################################################

//Função para preencher as tabelas de utilizadores e parcerias
function preencherTabelaUtiPar(nome, notNome, LeId, parceria = false) { //Vai receber o nome e o mail ou o link consoante a tabela a preencher
    //A variavel parceria vai ser um bolleano que se for true vai preencher a tabela de parcerias, caso contrário, a tabela de utilizdores
    //VAi ter o valor default false, ou seja, não preciso de dar valor a isto no caso de ser para preencher a tabela de utilizadores

    let corpo = ""

    if (!parceria) corpo = document.getElementById('bodyUtilizadores') //Anexar as merdas aqui
    else corpo = document.getElementById('corpoParcerias')

    let linha = document.createElement('tr')

    //1º Coluna
    let badanas = document.createElement('th')
    badanas.setAttribute('scope', 'row')

    //1º Coluna - Botão
    let btni = document.createElement('button')
    btni.setAttribute('class', 'btn btn-secundary ' + LeId)

    let conteudoBtni = document.createElement('i')
    conteudoBtni.setAttribute('class', 'fas fa-user-times ' + LeId)

    if (!parceria) btni.addEventListener('click', LeFuncone)
    else btni.addEventListener('click', LeFunconeParcerias) //Ainda por fazer a função

    btni.appendChild(conteudoBtni)
    badanas.appendChild(btni)
    linha.appendChild(badanas)

    //2ºColuna
    let pipi = document.createElement('td')
    pipi.textContent = nome

    linha.appendChild(pipi)

    //3º Coluna
    let pipi2 = document.createElement('td')
    pipi2.textContent = notNome

    linha.appendChild(pipi2)

    //4º Coluna, para o caso de se estar a preencher a tabela de parcerias
    if (parceria) {
        let pipi3 = document.createElement('tr') //coluna
        let leBtn = document.createElement('button') //Botão
        let leBtnConteudo = document.createElement('i') //Conteudo do Botão


        leBtnConteudo.setAttribute('class', 'fas fa-pencil-alt ' + LeId)
        leBtn.setAttribute('class', 'btn btn-secundary ' + LeId)
        leBtn.setAttribute('data-toggle', 'modal')
        leBtn.setAttribute('data-target', '#ModalAlterarParceria')
        leBtn.addEventListener('click', editarParceria) //por Fazer

        leBtn.appendChild(leBtnConteudo)
        pipi3.appendChild(leBtn)
        linha.appendChild(pipi3)
    }

    corpo.appendChild(linha)
}
//Função para editar as parcerias
function editarParceria(evento){

    console.log(evento.target.className)

    let laModaL = document.getElementById('ModalAlterarParceria')

    let atacarre = evento.target.className.split(' ')[2]

    let memoNaVirilha = parcerias.filter(function(leParceria){
        return leParceria.id == atacarre
    })

    console.log(memoNaVirilha)

    document.getElementById('nomePAlt').value = memoNaVirilha[0].nome
    document.getElementById('nomeLAlt').value = memoNaVirilha[0].localizacao
    document.getElementById('nomeLinkAlt').value = memoNaVirilha[0].link

    idDaParceriaModificar = memoNaVirilha[0].id
}
//Função para o botão de remover, talvez possa ser usada para o resto das tabelas, mas dificil
function LeFuncone(evento, utilizadori) { //Só falta "gravar" o novo array em local storage...
    //O utilizadori vai servir para saber se o array é de Utilizadores ou Parcerias, mas para isso é preciso criar as parcerias, nah, criei outra função

    console.log(evento.target.className)


    let atacar = evento.target.className.split(' ')[2]
    let msg = confirm("Vai remover o Utilizador\nContinuar?")

    if (msg) {
        for (let i = 0; i < utilizadores.length; i++) {
            if (utilizadores[i].id == atacar) {
                let d = utilizadores.splice(i, 1)
                console.log("Utilizador Removido = " + d[0].nome) //Porque não funcemina o d.nome?

                let remov = 0

                console.log(evento.path.length)

                if(evento.path.length == 11) remov = evento.path[2].rowIndex -1
                else if(evento.path.length == 12) remov = evento.path[3].rowIndex-1

                console.log(remov)
                document.getElementById('bodyUtilizadores').deleteRow(remov)
            }
        }
    }
}

function LeFunconeParcerias(events) {

    console.log(events.target.className)


    let atacar = events.target.className.split(' ')[2]
    console.log(atacar)
    let msg = confirm("Vai remover o Utilizador\nContinuar?")

    if (msg) {
        for (let i = 0; i < parcerias.length; i++) {
            console.log(parcerias[i].id)
            if (parcerias[i].id == atacar) {
                
                let remov = 0

                console.log(events.path.length)

                if(events.path.length == 11) remov = events.path[2].rowIndex -1
                else if(events.path.length == 12) remov = events.path[3].rowIndex-1

                console.log("Remove " + remov)
                document.getElementById('corpoParcerias').deleteRow(remov)

                let d = parcerias.splice(i, 1)
                console.log("Utilizador Removido = " + d[0].nome) //Porque não funcemina o d.nome?, porque o splice cria um array
            }
        }
    }

}

//Função para preencher a tabela dos Eventos
function preencherTabelaEventos(nomeE, dataE, loId) {

    let corpo = document.getElementById('corpoEventos')

    //Criar elementos


    let linha = document.createElement('tr')


    //1º Coluna 
    let btnRemover = document.createElement('th')
    btnRemover.setAttribute('scope', 'row')

    let btnbtn = document.createElement('button')
    btnbtn.setAttribute('class', 'btn btn-secondary ' + loId)
    btnbtn.addEventListener('click', maisLixoEventos)

    let Izito = document.createElement('i')
    Izito.setAttribute('class', 'fas fa-trash ' + loId) //Falta criar uma função para isto

    btnbtn.appendChild(Izito)
    btnRemover.appendChild(btnbtn)
    linha.appendChild(btnRemover)

    //2º Coluna
    let leNome = document.createElement('td')
    leNome.textContent = nomeE

    linha.appendChild(leNome)

    //3º Coluna
    let leData = document.createElement('td')
    leData.textContent = dataE

    linha.appendChild(leData)

    //4º Coluna
    let leBotones = document.createElement('td')

    let btn1 = document.createElement('button')
    btn1.setAttribute('class', 'btn btn-primary ' + loId)
    let btn1Conteudo = document.createElement('i')
    btn1Conteudo.setAttribute('class', 'fas fa-pencil-alt ' + loId)

    btn1.appendChild(btn1Conteudo)
    btn1.addEventListener('click', editarEvento)
    btn1.setAttribute('data-toggle', 'modal')
    btn1.setAttribute('data-target', '#ModalAdicionnarEventosAlt')
    leBotones.appendChild(btn1)

    let btn2 = document.createElement('button')
    btn2.setAttribute('class', 'btn btn-primary ' + loId)
    let btn2Conteudo = document.createElement('i')
    btn2Conteudo.setAttribute('class', 'fas fa-eye ' + loId)

    btn2.appendChild(btn2Conteudo)
    leBotones.appendChild(btn2)

    linha.appendChild(leBotones)

    corpo.appendChild(linha)
}
//Função para editar uma evento
function editarEvento(e){

    let atacare = e.target.className.split(' ')[2]
    console.log(atacare)

    let caLinda = eventos.filter(function(evento){
        return evento.id == atacare
    }) 

    caLinda = caLinda[0]
    console.log(caLinda.data[0].split(';'))

    //Código Chato
    //Nome
    document.getElementById('NomeEventoAlt').value = caLinda.nome
    //Data
    if(caLinda.data[0].split(';')[0] != "") document.getElementById('DataEventoAlt').value = caLinda.data[0].split(';')[0]
    //Hora, para estas cenas funcionarem bem, tenho que limpar a modal sempre que esta fechar
    if(caLinda.data[0].split(';')[1] != "") document.getElementById('HoraEventoAlt').value = caLinda.data[0].split(';')[1]
    //Descrição
    document.getElementById('DescriçãoEventoAlt').value = caLinda.descricao
    //Imagem
    document.getElementById('FotografiaEventoAlt').value = caLinda.fotografia
    //Responsavel
    document.getElementById('ResponsavelEventoAlt').value = caLinda.responsavel

}

function auxiliarData(datita){ //Não é preciso esta merda, bennhe
    let leData = ""

    console.log(datita)

    let cenas = datita.split('-')

    leData = cenas[2] + '-'+ cenas[1] + '-' + cenas[0]

    return leData
}


let categoriasUnicas = []

function categoriasUnicasFunc(laCategoria) {
    //Verificar se a categoria é unica e secalhar por todas as categoriass unicas para um array e depois preencher o div com esse array
    //A função pode só devolver o array caso um dos parametros da função seja true, mé....
    let unica = true

    //Cenas a sério

    //console.log(laCategoria)
    //A Funçaõ vai receber uma categoria que vai ser "avaliada", para ver se  nome já existe ou não
    if (categorias.length > 0 && laCategoria != undefined) {
        for (let i = 0; i < categorias.length; i++) {
            if (categorias[i].nome.toUpperCase() == laCategoria.toUpperCase()) unica = false
            // if (unica == true) categorias.push(laCategoria)
        }
    }
    // else {
    //     categorias.push(laCategoria)
    // }

    //O que está comentado acima não é preciso, porque se esta função retornar true então significa
    //que a categoria é unica e que pode ser guardada no array categorias, que acontece ao criar o evento
    // e que deve também acontecer ao acrescentar categorias (pelo admin)
    return unica;
}

//Criar uma função para preencher um div com as categorias todas
function apresentarCategorias() {

    let containerTags = document.getElementById('containerTags')

    for (let i = 0; i < categorias.length; i++) {
        let tag = document.createElement('a')
        let butoneParaRemover = document.createElement('button')
        butoneParaRemover.setAttribute('class', 'btn lixinho ' + categorias[i].id)
        let pilasMaximus = document.createElement('i')
        pilasMaximus.setAttribute('class', 'fas fa-trash pilasMaximus ' + categorias[i].id)

        butoneParaRemover.appendChild(pilasMaximus)
        butoneParaRemover.addEventListener('click', maisUmaFuncione)


        tag.textContent = categorias[i].nome
        tag.appendChild(butoneParaRemover)
        containerTags.appendChild(tag)
    }
}

//Função para encher o array de categorias ao inicio
function mamaAquiNaPila() {

    let a = ""

    for (let i = 0; i < eventos.length; i++) {
        for (let k = 0; k < eventos[i].categoria.length; k++)

            if (categorias.length == 0) {
                console.log(eventos[i].categoria[k])
                a = new Categoria(eventos[i].categoria[k])
                categorias.push(a)
            }
            else if (categoriasUnicasFunc(eventos[i].categoria[k])) {
                //console.log('ata')
                a = new Categoria(eventos[i].categoria[k])
                categorias.push(a)
            }

        //console.log(eventos[i].categoria)
    }
}

//Função para 'apagar' um evento
function maisLixoEventos(event) {

    console.log(event.target.className)

    let idAtacar = event.target.className.split(' ')[2]

    let conf = confirm('Vai apagar o evento, continuar?')

    if (conf) { //Falta gravar o array 
        document.getElementById('corpoEventos').deleteRow(event.rowIndex)        

        for (let i = 0; i < eventos.length; i++) {
            if (idAtacar == eventos[i].id) eventos.splice(i, 1)
        }

        document.getElementById('corpoEventos').innerHTML = ""
        let datatatata = ""
        for (let i = 0; i < eventos.length; i++) {
            if (eventos[i].data[0] != undefined) datatatata = eventos[i].data[0].split(';')[0]
            preencherTabelaEventos(eventos[i].nome, datatatata, eventos[i].id)
        }
    }

}

function maisUmaFuncione(event){

    //console.log(event.target.className)
    let atacare = event.target.className.split(' ')[3]
    console.log(atacare)

    for(let i = 0 ; i<categorias.length; i++){
        if(categorias[i].id == atacare){
            let a = categorias.splice(i, 1)
            console.log(a[0].nome)
        }
    }

    document.getElementById('containerTags').innerHTML = ""
    apresentarCategorias()    
}

//##########################################################################################################

//-----------------------------------------------------------------------------------------------------------------------------------------------

//Por este tipo de merdas num outro ficheiro secalhar
//Tem que estar fora do window.onload
function Mapa() {
    let location = new google.maps.LatLng(41.366858, -8.738309);

    // Posicionar o mapa
    let map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 14
    });

    // Ponto no mapa....
    let mark = new google.maps.Marker({
        position: location,
        map: map
    });



    //var map = new google.maps.Map(document.getElementById("mapa"), mapProp);
}

//CArrosel
// Carousel Auto-Cycle
if (document.getElementById('myCarousel') != undefined) {
    $(document).ready(function () {
        $('.carousel').carousel({
            interval: 6000
        })
    });
}





//CArrosel
// $('.carousel[data-type="multi"] .item').each(function () {
//     var next = $(this).next();
//     if (!next.length) {
//         next = $(this).siblings(':first');
//     }
//     next.children(':first-child').clone().appendTo($(this));

//     for (var i = 0; i < 2; i++) {
//         next = next.next();
//         if (!next.length) {
//             next = $(this).siblings(':first');
//         }

//         next.children(':first-child').clone().appendTo($(this));
//     }
// });

//Clockpicker
// var input = $('#input-a');
// input.clockpicker({
//     autoclose: true
// });

// // Manual operations
// $('#button-a').click(function(e){
//     // Have to stop propagation here
//     e.stopPropagation();
//     input.clockpicker('show')
//             .clockpicker('toggleView', 'minutes');
// });
// $('#button-b').click(function(e){
//     // Have to stop propagation here
//     e.stopPropagation();
//     input.clockpicker('show')
//             .clockpicker('toggleView', 'hours');
// });


/* <div class="carousel-item col-md-4 active">
                    <div class="card">
                        <img class="card-img-top img-fixed" src="http://placehold.it/800x600/f44242/fff" alt="Card image cap">
                        <div class="card-body">
                            <h4 class="card-title">Nome do Evento 1</h4>
                            <p class="card-text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut harum culpa ab quia voluptatum
                                quod sed veniam, commodi illo corrupti nulla velit et.</p>
                            <a class="btn btn-primary">+</a>
                            <p class="card-text">
                                <small class="text-muted">Data - Pontuação</small>
                            </p>
                        </div>
                    </div>
                </div> */