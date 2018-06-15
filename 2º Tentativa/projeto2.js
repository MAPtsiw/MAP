//Variáveis Globais:
let utilizadores = []

let eventos = []

let parcerias = []

let categorias = []

let comentarios = []

let testemunhos = []

let recomendados = []

let eventosParticipados = []

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

//Mesma coisa que em cima para os eventos
let ideventoModificar = 0

//Mostrar ou não a opção de editar o perfil
let editarPerfil = true

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

    if (document.getElementById('container-Calendario') != null) {
        this.console.log('ata Calendario')
        calendarioFixe(datinha.getMonth() + 1, datinha.getFullYear())
    }


    //Isto deve ser a primeira cena a fazer em principio
    //Local Storage, encher os arrays, utilizadores e eventos
    if (localStorage.getItem('utilizadores')) {
        let a = JSON.parse(localStorage.getItem('utilizadores'))

        //Maneira de encher o array sem ter que mexer nas variáceis internas
        for (let i = 0; i < a.length; i++) {
            let b = new Utilizador(a[i]._nome, a[i]._password, a[i]._mail, a[i]._fotografia, a[i]._tipo, a[i]._cv, a[i]._aulas, a[i]._formacao, a[i]._pontoou)
            utilizadores.push(b)
        }

        console.log(utilizadores)

        //Tou a fazer isto porque ao fazer utilizadores.nome aos utilizadores que ficaram no localstorage, isto devolve undefined
        //mas se criar um novo objeto que não estava guardado já funciona, mas se fizer utilizadores._nome, já me dá o valor direito
        //e tenho as coisas bem na class....
        //Não funcionou...

        // for(let i = 0; i<meninos.length; i++){
        //     utilizadores.push(meninos[i])
        // }
    }

    if (localStorage.getItem('eventos')) {
        let a = JSON.parse(localStorage.getItem('eventos'))

        //nome, dataEhora, descricao, categoria, foto, responsavel, utilizadores[indexUtilizador]._id
        for (let i = 0; i < a.length; i++) {
            let b = new Evento(a[i]._nome, a[i]._data, a[i]._descricao, a[i]._categoria, a[i]._imagem, a[i]._responsavel, a[i]._userId, a[i]._pontuacao, a[i]._inscritos)
            this.console.log("Inicio - " + b.pontuacao)
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

    //Preencher a lista de Parcerias
    preencherListaDeParcerias()

    if (this.localStorage.getItem('comentarios')) {
        let a = JSON.parse(localStorage.getItem('comentarios'))

        for (let i = 0; i < a.length; i++) {
            let b = new Comentario(a[i]._comentario, a[i]._userId, a[i]._eventoId)
            comentarios.push(b)
        }
        console.log(comentarios)
    }

    if (this.localStorage.getItem('testemunhos')) {
        let a = JSON.parse(localStorage.getItem('testemunhos'))

        for (let i = 0; i < a.length; i++) {
            let b = new Testemunho(a[i]._testemunho, a[i]._userId)
            testemunhos.push(b)
        }
        console.log(testemunhos)
    }
    // for (let i = 0; i < utilizadores.length; i++) { //porque coisa se
    //     utilizadores[i].tipoUtilizador = "Docente"
    // }

    // utilizadores[4].tipoUtilizador = "Administrador"

    //localStorage.setItem("utilizadores", JSON.stringify(utilizadores))
    //Espero que não seja preciso usar isto outra vez, a parte de cima


    //só para ter um caraho de um administrador
    // let r = new Utilizador("El Admin", "123", "adminFixi@gmail.com", "", "Adminstrador")
    // utilizadores.push(r)


    if (this.localStorage.getItem('recomendados')) {
        let a = JSON.parse(localStorage.getItem('recomendados'))

        for (let i = 0; i < a.length; i++) {
            let b = new Recomendado(a[i]._eventoId, a[i]._userId)
            recomendados.push(b)
        }
        console.log(recomendados)
    }

    //Iniciar o indexUtilizador como estava antes
    indexUtilizador = JSON.parse(localStorage.getItem('indexUtilizador'))


    //Adminhe
    if (adminzito != null) {
        if (utilizadores[indexUtilizador].tipoUtilizador == "Administrador") {
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

        //Função para adicionar a opção de ver o perfil do utilizador, se esta coisa fosse com windows forms.....
        if (utilizadores[indexUtilizador].tipoUtilizador != 'Administrador') verPerfil(true);

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
    anoCalendario();

    //Marcar os dias que têm eventos, tem que estar aqui po que senão o array ainda não está preenchido
    marcarDias(datinha.getMonth() + 1);

    //Preencher o array de categorias
    EncherCategoriasInicio()


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
        categoriasUnicasFunc() //Tenho mesmo que mexer nisto, em principio isto não é preciso
        apresentarCategorias()

        //Vai ficar aqui porque sim e por agora
        cardsDoAdmin()
    }




    //Para o caso de o utilizador estar logado e entrar na página Inicial sem fazer login
    if (btnAdicionar != null && logged == true && utilizadores[indexUtilizador].tipoUtilizador != "Estudante")
        btnAdicionar.style.display = 'inline-block'

    //Preencher o catálogo com eventos
    if (document.getElementById('containerCardsCarrosel') != null) {

        for (let i = 0; i < 6; i++) {

            if (eventos[i] != undefined) {
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
                        eventos[i].pontuacao //Fazer alguma coisa quando a pontuação não estiver definida
                        , i)
                }
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

            let conf = confirm("Não introduziu uma foto \nContinuar sem mostrar as beiças?") //Dá para editar o texto desta coisa?

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
            let novoUtilizador = new Utilizador(nome, password, eMail, foto, tipo, "", "", "", false) //Porque   me está a por o tipo de utilizador na foto????

            //Mais umas
            if (novoUtilizador.tipoUtilizador == "Docente") {
                let formacao = document.getElementById('formacao').value
                let aulitas = document.getElementById('unidadesCurriculares').value
                let shortCv = document.getElementById('shortCV').value

                // if(formacao == "" || aulitas == "" || shortCv == ""){
                // msgErro.innerHTML = "\n Tens Campos Importantes por preencher", criar uma msg de Erro jeitosa

                novoUtilizador.formacao = formacao
                novoUtilizador.cv = shortCv
                novoUtilizador.aulas = aulitas
                // }
            }

            // console.log(novoUtilizador)

            //Mete-lo no array
            utilizadores.push(novoUtilizador)

            //Devem faltar coisas

            //1º coisa
            //Avisar que se registou ou fez login com sucesso

            msgErro.innerHTML = "Registado com sucesso!!!!"

            //2º coisa 
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
            logged = true; //Vai servir para várias coisas a seguir
            localStorage.setItem('logged', JSON.stringify(logged))


            //Mostrar o botão de log-off e esconder o de log-in
            let btnLogin = document.getElementById('Login')
            btnLogin.style.display = "none"

            let btnLogoff = document.getElementById('Logoff')
            btnLogoff.style.display = "inline-block"

            //Mostrar na navbar o item para o adminstrador
            if (utilizadores[indexUtilizador].tipoUtilizador == "Administrador") {
                adminzito.style.display = 'inline-block'
            }

            //Botão de registar disabled, não me parece a melhor opção, mas de outra maneira daria trabalho a mais para agora
            let btnRegistar = document.getElementById('Registar')
            btnRegistar.disabled = true

            if (btnAdicionar != null && utilizadores[indexUtilizador].tipoUtilizador != "Estudante") //Está fotografia, mas tá mal, só não sei porque
                btnAdicionar.style.display = 'inline-block'

            msgErro.innerHTML = "Bem vindo, " + utilizadores[indexUtilizador].nome + " !!!"

            if (utilizadores[indexUtilizador].tipoUtilizador == 'Docente' && btnAdicionar != null) { //A variavel interna é _tipo e não tipoUtilizador
                btnAdicionar.style.display = 'inline-block'
            }

            //Função para adicionar a opção de ver o perfil do utilizador, se esta coisa fosse com windows forms.....
            if (utilizadores[indexUtilizador].tipoUtilizador != 'Administrador') verPerfil(true);
            // editarPerfil = true;
            // localStorage.setItem('editarPerfil', JSON.stringify(editarPerfil))

            location.reload() //Por alguma razºao esta coisa não está a fazer reload
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
        if (adminzito != null) adminzito.style.display = 'none' //Por isto em todas as navbars

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

    //Meter coisas para o botão de adcionar Eventos (Modal Eventos)
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
                let conf = confirm("Continuar sem explicar o que é o evento???")

                if (!conf) {
                    document.getElementById('DescriçãoEvento').focus()
                    continuar = false;
                } //Deve faltar cenas aqui
            }

            //Fotografia
            if (foto == "") {

                let conf = confirm("Não introduziu uma foto \nContinuar sem mostrar as beiças?") //Dá para editar o texto desta coisa?

                if (conf == false) {
                    continuar = false
                }

            }


            if (continuar == true) {
                //O que vai ficar no evento.Categoria vai ser o id de uma categoria, ou não

                let categoriasVarias = categoria.split(' ')
                if (categoriasVarias[categoriasVarias.length - 1] == " ") categoriasVarias.pop() //Tirar o ultimo valor do array, porque este é ' '

                for (let i = 0; i < categoriasVarias.length; i++) {
                    console.log(categoriasVarias[i])
                }

                if (categoriasUnicasFunc(categoria) == true) {
                    //Fazer esta coisa

                    categorias.push(categoria)
                }

                let novoEvento = new Evento(nome, dataEhora, descricao, categoriasVarias[0], foto, responsavel, utilizadores[indexUtilizador].id, 0, 0)
                for (let i = 1; i < categoriasVarias.length; i++) {
                    novoEvento.categoria = categoriasVarias[i]
                }

                eventos.push(novoEvento)

                localStorage.setItem('eventos', JSON.stringify(eventos))

                console.log(eventos)
                console.log("O formato da data é = " + novoEvento._data[0])

                msgErro.innerHTML = "Belo ebento :)"
            }
            else {
                msgErro.innerHTML += "Está qualquer coisa male" //Esta coisa está a entrar aqui quando não devia
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
                                    i, mostrar, 'ohPaEle')
                            }
                            else if (losDiasOcupados[i].data != undefined && losDiasOcupados[i].data[0] == undefined) {
                                preencherCatalogo(losDiasOcupados[i].nome,
                                    losDiasOcupados[i].imagem,
                                    losDiasOcupados[i].descricao,
                                    "Por Anunciar",
                                    "Por Anunciar",
                                    losDiasOcupados[i].pontuacao,
                                    i, mostrar, 'ohPaEle')
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
                        return evento.categoria[0]
                            .toUpperCase()
                            .includes(searchGenero.toUpperCase())
                    })
                    msgErroCatalogo(filtraditos.length)
                }
                else {
                    filtraditos = filtraditos.filter(function (evento) {
                        return evento.categoria[0]
                            .toUpperCase()
                            .includes(searchGenero.toUpperCase())
                    })
                    msgErroCatalogo(filtraditos.length)
                }
            } //Tenho que ver o que esta coisa vai dar e depois fazer alterações em principio

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
                                , i, chicharrito, 'ohPaEle')
                        }
                        else if (filtraditos[i].data[0] == undefined) {
                            preencherCatalogo(filtraditos[i].nome,
                                filtraditos[i].imagem,
                                filtraditos[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                filtraditos[i].pontuacao //Fazer alguma coisa quando a pontuação não estiver definida
                                , i, chicharrito, 'ohPaEle')
                        }
                    }
                }
            }
            else if (filtraditos.length == 0) {
                document.getElementById('ohPaEle').innerHTML = "Não há eventos que correspondam à pesquisa!!!"
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
                                i, mostrar, 'ohPaEle')
                        }
                        else if (realizados[i].data != undefined && realizados[i].data[0] == undefined) {
                            preencherCatalogo(realizados[i].nome,
                                realizados[i].imagem,
                                realizados[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                realizados[i].pontuacao,
                                i, mostrar, 'ohPaEle')
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
                                i, mostrar, 'ohPaEle')
                        }
                        else if (notRealizados[i].data != undefined && notRealizados[i].data[0] == undefined) {
                            preencherCatalogo(notRealizados[i].nome,
                                notRealizados[i].imagem,
                                notRealizados[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                notRealizados[i].pontuacao,
                                i, mostrar, 'ohPaEle')
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
    if (formAltParceria != undefined) {
        formAltParceria.addEventListener('submit', function (e) {
            e.preventDefault()

            let sinhe = true

            let nome = document.getElementById('nomePAlt').value
            let localizacao = document.getElementById('nomeLAlt').value
            let link = document.getElementById('nomeLinkAlt').value


            if (localizacao == "" || link == "") {
                let conf = confirm("Tem campos por preencher, continuar?")

                if (!conf) sinhe = false
            }

            if (sinhe) {
                for (let i = 0; i < parcerias.length; i++) {
                    if (idDaParceriaModificar == parcerias[i].id) {
                        parcerias[i].nome = nome
                        parcerias[i].localizacao = localizacao
                        parcerias[i].link = link

                        document.getElementById('MensagemMamaAquiNaPila').innerHTML = "Be mudado, És Ganda cena"
                    }
                }


                document.getElementById('corpoParcerias').innerHTML = ""
                for (let i = 0; i < parcerias.length; i++) {
                    preencherTabelaUtiPar(parcerias[i].nome, parcerias[i].link, parcerias[i].id, true)
                }
                //Gravar o novo array
                localStorage.setItem('parcerias', JSON.stringify(parcerias))
            }
        })

    }

    let forminhaModificarEvento = document.getElementById('FormRegistarEventoAlt')
    if (forminhaModificarEvento != undefined) {
        forminhaModificarEvento.addEventListener('submit', function (e) {
            e.preventDefault()

            let continuar = true

            let nomi = document.getElementById('NomeEventoAlt').value //required
            let dataEve = document.getElementById('DataEventoAlt').value //required
            let horaEve = document.getElementById('HoraEventoAlt').value
            let descricaoEve = document.getElementById('DescriçãoEventoAlt').value
            let categoriaEve = document.getElementById('CategoriaEventoAlt').value.trim().split(' ') //required
            let fotoEve = document.getElementById('FotografiaEventoAlt').value
            let responsavelEve = document.getElementById('ResponsavelEventoAlt').value //required

            console.log("Verificar como está a cena das categorias - " + categoriaEve[0]) //Está bem
            if (horaEve == "" || descricaoEve == "" || fotoEve == "") {
                let confirmar = confirm("Tem campos por preencher, continuar?")

                if (!confirmar) continuar = false
            }

            if (continuar) {

                let a = ideventoModificar //Porque é que isto está aqui...

                for (let i = 0; i < eventos.length; i++) {
                    if (eventos[i].id == a) {
                        eventos[i].nome = nomi

                        let dataPlim = dataEve + ';' + horaEve
                        eventos[i].data[0] = dataPlim //Ver se fazer push disto faz sentido ou nem por isso

                        eventos[i].descricao = descricaoEve

                        if (categoriaEve.length == 1) eventos[i].categoria = descricaoEve[0]
                        else {
                            for (let k = 0; k < categoriaEve.length; k++) {
                                console.log(categoriaEve[k])
                                eventos[i].categoria = categoriaEve[k]
                            }
                        }

                        eventos[i].fotografia = fotoEve

                        eventos[i].responsavel = responsavelEve
                    }
                }
            }
        })
    }



    //Página do Evento 
    if (document.getElementById('paginaEvento') != null) {
        if (localStorage.getItem('EventoMostrar')) { //FAzer tudo aqui dentro? Por agora sim, sim porque se não vai estar a comentar o quê....
            let a = JSON.parse(localStorage.getItem('EventoMostrar'))
            this.console.log('Mais uma pontuação - ' + a._pontuacao)
            let eventoLindo = new Evento(a._nome, a._data, a._descricao, a._categoria, a._imagem, a._responsavel, a._userId, a._pontuacao, a._inscritos)
            eventoLindo._id = a._id
            //this.alert(eventoLindo.nome)

            let leData = ""
            if (eventoLindo.data[0] |= null) leData = eventoLindo.data[0].split(';')[0]

            console.log(a)
            let ajuda = new Date(leData)
            this.console.log(ajuda)
            if (leData != "") document.getElementById('diaMes').innerHTML = "Data:<br>" + ajuda.toString().split(' ')[2] + "  " + ajuda.toString().split(' ')[1] //Transformar isto para aparecer o mes por extenso
            else document.getElementById('diaMes').innerHTML = "Data: <br>Por definir"

            document.getElementById('nomeEvento').innerHTML = eventoLindo.nome
            document.getElementById('leResponsavel').innerHTML = "por: " + eventoLindo.responsavel
            document.getElementById('LaDescricao').innerHTML = eventoLindo.descricao
            console.log("O caralho da pontuação - " + eventoLindo.pontuacao)
            if (eventoLindo.pontuacao != undefined) {
                this.console.log('ata')
                this.document.getElementById('pontuacaoMedia').innerHTML = eventoLindo.pontuacao + " /5";}
            else document.getElementById('pontuacaoMedia').innerHTML = "Por definir"

            if (eventoLindo.localizacao != null) document.getElementById('localizacao').innerHTML = "Localização:<br>" + eventoLindo.localizacao
            else document.getElementById('localizacao').innerHTML = "Localização:<br> Por Definir..."
            //Categorias, não é preciso fazer como em cima, porque já está feito na função
            apresentarCategorias(false)
            mostrarLosComentarios(eventoLindo.id)

            //Criar um array para ver a malta que est+a inscita no evento
            let maltaInscrita = []
            for (let i = 0; i < eventoLindo.inscritos.length; i++) {
                for (let j = 0; j < utilizadores.length; j++) {
                    if (eventoLindo.inscritos[i] == utilizadores[j].id) maltaInscrita.push(utilizadores[i])
                }
            }

            cabeconas(maltaInscrita);


            if (!logged) document.getElementById('btnInscrever').disabled = true //Confirmar se está a funcionar  

            //Fazer cenaas para o botão de comentar
            let btnComentar = document.getElementById('btnComentar')
            btnComentar.addEventListener('click', function () {
                if (logged) {
                    let caixaComentário = document.getElementById('message').value


                    if (caixaComentário != "") {

                        let novoComentario = new Comentario(caixaComentário, utilizadores[indexUtilizador].id, eventoLindo.id)

                        console.log(novoComentario)
                        comentarios.push(novoComentario)

                        localStorage.setItem('comentarios', JSON.stringify(comentarios))
                        caixaComentário.value = "" //Não sei se vai resultar
                    }
                    else {
                        alert("Que comentário interessante, Bem miudo")
                    }

                    //Função para mandar Eventos
                    if (comentarios.length > 0) {
                        mostrarLosComentarios(eventoLindo.id, utilizadores[indexUtilizador].id)
                    }
                    else {
                        document.getElementById('containerComentarios').innerHTML = "Não há comentarios ainda"
                    }
                }
                else {
                    alert('Tens que estar logado para comentar')
                }
            })

            //Fazer mais coisas para o botão de Increver se
            let btnInscrever = document.getElementById('btnInscrever')
            btnInscrever.addEventListener('click', function () {
                let botaAtacar = eventoLindo.id

                let loIndexi = 0
                let tamanhoNot = 0;
                for (let i = 0; i < eventos.length; i++) {
                    if (eventos[i].id == botaAtacar) {
                        loIndexi = i
                        tamanhoNot = eventos[i].inscritos.length
                        eventos[i].inscritos = utilizadores[indexUtilizador].id //Done coisa

                        //console.log("ata")
                    }
                }

                if (tamanhoNot == eventos[loIndexi].inscritos.length) {
                    alert('Já tas inscrito oh burra')
                }
                else {
                    localStorage.setItem('eventos', JSON.stringify(eventos))
                    alert('Tás inscritos')
                }
            })
            //Pontuar o   do evento
            //if (logged == true) { //Fazer esta confirmação no evento, e assim aviso que tem que estar logado para pontuar
            let estrelasPontuar = document.getElementsByClassName('btn btn-default btn-grey btn-sm')
            //console.log(estrelasPontuar)
            for (let i = 0; i < estrelasPontuar.length; i++) {
                //this.console.log(estrelasPontuar[i])
                estrelasPontuar[i].addEventListener('click', botaoPontuar)
            }
            //}

            const btnRecomendar = document.getElementById('btnRecomendar')
            if (logged) {
                btnRecomendar.addEventListener('click', function () {
                    let recomendar = ""
                    if (recomendados.length == 0) {
                        recomendar = new Recomendado(eventoLindo.id, utilizadores[indexUtilizador].id)
                        recomendados.push(recomendar)
                    }
                    else {
                        let seguir = true, indexi = 0;
                        for (let i = 0; i < recomendados.length; i++) {
                            if (recomendados[i].eventoId == eventoLindo.id) {
                                seguir = false
                                indexi = i;
                            }
                        }
                        let seguir2 = true;
                        if (!seguir) {

                            for (let i = 0; i < recomendados[indexi].userId.length; i++) {
                                if (recomendados[indexi].userId[i] == utilizadores[indexUtilizador].id) {
                                    seguir2 = false
                                }
                            }
                        }
                        else {
                            recomendar = new Recomendado(eventoLindo.id, utilizadores[indexUtilizador].id)
                            recomendados.push(recomendar)
                        }

                        if (seguir2) {
                            recomendados[indexi].userId = utilizadores[indexUtilizador].id
                        }
                    }
                    localStorage.setItem('recomendados', JSON.stringify(recomendados))
                    console.log(recomendados)
                })
            }
            else {
                alert('Tens que estar logado para recomendar o evento')
            }
        }
    }

    let botaoTestemunhar = document.getElementById('aPilaDoMiguel')
    if (botaoTestemunhar != null) {

        //Preencher os testemunhos, caso já tenham sido criados
        if (testemunhos.length > 0) preencherTestemunhos()
        // else document.getElementById('containerTestemunhos').innerHTML = "Ainda não há testemunhos"

        let elTestemunho = document.getElementById('LeTestemunho') //TextArea
        let jaExiste = false
        let loIndex = 0
        let texto = ""
        botaoTestemunhar.addEventListener('click', function () {

            let somaESegue = true


            for (let i = 0; i < testemunhos.length; i++) {
                if (testemunhos[i].userId == utilizadores[indexUtilizador].id) {
                    loIndex = i
                    texto = testemunhos[i].testemunho
                    somaESegue = false
                }
            }

            if (logged) {
                botaoTestemunhar.setAttribute('data-target', '#ModalTestemunho')
                botaoTestemunhar.setAttribute('data-toggle', 'modal')
            }
            else if (!logged) {
                botaoTestemunhar.removeAttribute('data-target')
                botaoTestemunhar.removeAttribute('data-toggle')
                alert('Tens que estar logado ó macaco')
            }

            if (somaESegue == false && logged == true) {
                let continuar = confirm("Já testemunhas te uma vez\nQueres editar o teu Testemunho?")

                if (continuar) {
                    document.getElementById('TituloTestemunho').innerHTML = "Alterar Testemunho do " + utilizadores[indexUtilizador].nome
                    texto = elTestemunho.value
                    jaExiste = true
                }
                else {
                    botaoTestemunhar.removeAttribute('data-target')
                    botaoTestemunhar.removeAttribute('data-toggle')
                }
            }
        })

        let submitTestemunho = document.getElementById('submitTestemunho')
        submitTestemunho.addEventListener('click', function () {

            if (!jaExiste) {
                let novoTestamento = new Testemunho(elTestemunho.value, utilizadores[indexUtilizador].id)
                console.log('aata')
                testemunhos.push(novoTestamento)
            }
            else {
                testemunhos[loIndex].testemunho = elTestemunho.value
                console.log(testemunhos[loIndex].testemunho)
            }

            console.log(testemunhos, loIndex)
            console.log(jaExiste)

            localStorage.setItem('testemunhos', JSON.stringify(testemunhos))

            //Acho que tem que ser aqui
            preencherTestemunhos()

        })
    }

    //Mostrar ou não as cenas para um docente se Registar´
    //Depois ao fechar o modal tirar também os campos que são só para o docente
    const selectTipoUtilizador = document.getElementById('tipoUtilizador')
    if (selectTipoUtilizador != null) {
        selectTipoUtilizador.addEventListener('change', function () {
            let leMer = selectTipoUtilizador.options[selectTipoUtilizador.selectedIndex].value
            let merdinhasDeDocente = document.getElementById('caLeindo')
            console.log(leMer)
            if (leMer == "Docente") merdinhasDeDocente.style.display = "block"
            else if (leMer == "Estudante") merdinhasDeDocente.style.display = "none"
        })
    }

    //Filtrar os utilizadores que correspondem à pesquisa, de cada vez que o utilizador insere uma letra
    let pesquisarUtilizador = document.getElementById('pesquisarUtilizador')
    if (pesquisarUtilizador != null) {
        pesquisarUtilizador.addEventListener('keyup', function (e) {
            // console.log(pesquisarUtilizador.value)
            let procurar = pesquisarUtilizador.value
            console.log(procurar)

            //Criar o dropdown à medida que o utilizador vai escrevendo
            let utilizadoresFiltrados = utilizadores.filter(function (eles) {
                return eles.nome
                    .toUpperCase()
                    .includes(procurar.toUpperCase())
            })

            console.log(utilizadoresFiltrados) //Até aqui está bem, mas depois coisa

            let drop = document.getElementById('Cenas')
            drop.innerHTML = ""

            if (procurar != "") {
                for (let i = 0; i < utilizadoresFiltrados.length; i++) {
                    let a = document.createElement('a')
                    let li = document.createElement('li')
                    li.setAttribute('class', utilizadoresFiltrados[i].id)
                    li.appendChild(a)
                    // a.setAttribute('href', 'projeto2_Perfil.html')
                    a.setAttribute('class', utilizadoresFiltrados[i].id)
                    a.setAttribute('href', 'projeto2_Perfil.html')
                    a.textContent = utilizadoresFiltrados[i].nome
                    li.addEventListener('click', guardarUtilizador)
                    //Isto vai ter que levar para a página do utilizador
                    drop.appendChild(li)
                }
            }
        })
    }


    //Preencher a página de Utilizador 
    if (document.getElementById('paginaPerfil') != null) {
        if (this.localStorage.getItem('UtilizadorMostrar')) {
            let loUtilizador = ""

            editarPerfil = JSON.parse(localStorage.getItem('editarPerfil'))
            console.log(editarPerfil)
            if (editarPerfil) loUtilizador = utilizadores[indexUtilizador]
            else loUtilizador = JSON.parse(this.localStorage.getItem('UtilizadorMostrar'))

            let laImagem = ""
            let imagemUtil = document.getElementById('ImagemUtilizador')
            if (loUtilizador._fotografia == "") laImagem = 'https://drwfxyu78e9uq.cloudfront.net/usercontent/olhafrutafresca/media/images/95082ab-batata-doce.jpg'
            else laImagem = loUtilizador._fotografia

            imagemUtil.setAttribute('src', laImagem)

            // let imagemUtilFundo = this.document.getElementById('notSideBar')
            // imagemUtilFundo.style.backgroundImage = `url(${laImagem})`
            // imagemUtilFundo.setAttribute('class', 'imagem-fundo-utilizador')

            this.console.log(laImagem)

            let nomeUtilizador = document.getElementById('NomeUtilizador')
            nomeUtilizador.innerHTML = loUtilizador._nome
            let tipoDeUtil = this.document.getElementById('tipoDeUtilizador')
            tipoDeUtil.innerHTML = `Tipo De Utilizador     (${loUtilizador._tipo})`

            //Para o caso de ser Docente mostrar os campos deste
            let divDocente = document.getElementById('docente-div')
            if (loUtilizador._tipo == "Docente") {
                divDocente.style.display = "inline-block"

                if (loUtilizador._cv != null) document.getElementById('shortCv').innerHTML = loUtilizador._cv //VEr se isto está a funcionar
                else document.getElementById('shortCv').innerHTML = "Por preencher"

                if (loUtilizador._aulas != null) this.document.getElementById('lecionadas').innerHTML = loUtilizador._aulas
                else this.document.getElementById('lecionadas').innerHTML = "Por preencher"

                if (loUtilizador._formacao != null) document.getElementById('Formacao').innerHTML = loUtilizador._formacao
                else document.getElementById('Formacao').innerHTML = "Por preencher..."
            }
            else divDocente.style.display = 'none'

            //Mostrar ou não o botão de mostrar o perfil, consoante o sitio onde se foi para o perfil
            if (this.localStorage.getItem('editarPerfil')) {
                let editar = JSON.parse(this.localStorage.getItem('editarPerfil'))
                // console.log('Editar Perfil = ' + editar)

                if (!editar) {
                    let editarOPerfil = document.getElementById('ButoneEditar')
                    editarOPerfil.style.display = 'none'
                }
            }

            //Preencher os eventos participados
            // eventosParticipados = []

            document.getElementById("eventosParticipados").innerHTML = ""
            let contadori = 0;
            for (let i = 0; i < eventos.length; i++) {
                for (let k = 0; k < eventos[i].inscritos.length; k++) {
                    if (eventos[i].inscritos[k] == loUtilizador._id) {
                        this.console.log('ata ata')
                        contadori++;
                        if (logged == true) mostrar = paNaoSei(eventos[i].userId)

                        if (eventos[i].data[0] != undefined) {
                            preencherCatalogo(eventos[i].nome,
                                eventos[i].imagem,
                                eventos[i].descricao,
                                eventos[i].data[0].split(';')[0],
                                eventos[i].data[0].split(';')[1],
                                eventos[i].pontuacao
                                , i, mostrar, 'eventosParticipados')
                        }
                        else if (eventos[i].data[0] == undefined) {
                            preencherCatalogo(eventos[i].nome,
                                eventos[i].imagem,
                                eventos[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                eventos[i].pontuacao //Fazer alguma coisa quando a pontuação não estiver definida
                                , i, mostrar, 'eventosParticipados')
                        }
                    }
                }
            }

            if (contadori == 0) document.getElementById("eventosParticipados").innerHTML = "Ainda não participou em nenhum evento"

            let arrayRecomendados = recomendadosFunc(loUtilizador._id)
            document.getElementById('eventosRecomendados').innerHTML = ""
            let contadorii = 0;
            for (let i = 0; i < eventos.length; i++) {
                for (let k = 0; k < arrayRecomendados.length; k++) {
                    console.log(arrayRecomendados[k])
                    if (eventos[i].id == arrayRecomendados[k]) {
                        console.log('ata')
                        contadorii++;
                        if (logged == true) mostrar = paNaoSei(eventos[i].userId)

                        if (eventos[i].data[0] != undefined) {
                            preencherCatalogo(eventos[i].nome,
                                eventos[i].imagem,
                                eventos[i].descricao,
                                eventos[i].data[0].split(';')[0],
                                eventos[i].data[0].split(';')[1],
                                eventos[i].pontuacao
                                , i, mostrar, 'eventosRecomendados')
                        }
                        else if (eventos[i].data[0] == undefined) {
                            preencherCatalogo(eventos[i].nome,
                                eventos[i].imagem,
                                eventos[i].descricao,
                                "Por Anunciar",
                                "Por Anunciar",
                                eventos[i].pontuacao //Fazer alguma coisa quando a pontuação não estiver definida
                                , i, mostrar, 'eventosRecomendados')
                        }
                    }
                }
            }
            if (contadorii == 0) document.getElementById("eventosRecomendados").innerHTML = "Ainda não recomendou em nenhum evento"

            let cv = document.getElementById('shortCv')
            let lecionadas = document.getElementById('lecionadas')
            let formacao = document.getElementById('Formacao')
            let nome = this.document.getElementById('NomeUtilizador')
            let divDoNome = document.getElementById('divDoNome')

            //Botão gravar alterações
            const btnGravar = document.getElementById('gravarAlterações')
            const btnCancelar = document.getElementById('cancelarAlterações')
            //Botão de Editar
            const btnEditar = document.getElementById('ButoneEditar')
            btnEditar.addEventListener('click', function () {
                btnGravar.style.display = "inline-block"
                btnCancelar.style.display = 'inline-block'

                const textareaCV = document.createElement('div')
                const textareaLecionadas = document.createElement('div')
                const textareaFormacao = document.createElement('div')
                const textareaNome = document.createElement('div')



                //Limpar os campos de docente
                nome.innerHTML = ""
                cv.innerHTML = ""
                lecionadas.innerHTML = ""
                formacao.innerHTML = ""

                //Formatar as textareas
                textareaCV.setAttribute('contenteditable', 'true')
                textareaCV.setAttribute('class', 'campos-docente')
                textareaLecionadas.setAttribute('contenteditable', 'true')
                textareaLecionadas.setAttribute('class', 'campos-docente')
                textareaFormacao.setAttribute('contenteditable', 'true')
                textareaFormacao.setAttribute('class', 'campos-docente')
                textareaNome.setAttribute('contenteditable', 'true')
                textareaNome.setAttribute('class', 'campos-docente')

                // document.getElementsByClassName('campos-docente')[0].focus()
                //Dar Valores ás textareas
                textareaNome.innerHTML = loUtilizador._nome
                textareaCV.innerHTML = loUtilizador._cv
                textareaLecionadas.innerHTML = loUtilizador._aulas
                textareaFormacao.innerHTML = loUtilizador._formacao

                //Mostrar as textareas
                cv.appendChild(textareaCV)
                lecionadas.appendChild(textareaLecionadas)
                formacao.appendChild(textareaFormacao)
                nome.appendChild(textareaNome)
            })

            let camposDocente = document.getElementsByClassName('campos-docente')
            let cancelar = false;

            btnCancelar.addEventListener('click', function () {

                for (let i = 0; i < camposDocente.length; i++) {
                    console.log(camposDocente[i])
                }

                nome.innerHTML = utilizadores[indexUtilizador].nome
                cv.innerHTML = utilizadores[indexUtilizador].cv
                lecionadas.innerHTML = utilizadores[indexUtilizador].aulas
                formacao.innerHTML = utilizadores[indexUtilizador].formacao

                btnGravar.style.display = "none"
                btnCancelar.style.display = 'none'
            })
            btnGravar.addEventListener('click', function () {

                utilizadores[indexUtilizador].nome = camposDocente[0].innerHTML
                utilizadores[indexUtilizador].cv = camposDocente[1].innerHTML
                utilizadores[indexUtilizador].aulas = camposDocente[2].innerHTML
                utilizadores[indexUtilizador].formacao = camposDocente[3].innerHTML

                nome.innerHTML = utilizadores[indexUtilizador].nome
                cv.innerHTML = utilizadores[indexUtilizador].cv
                lecionadas.innerHTML = utilizadores[indexUtilizador].aulas
                formacao.innerHTML = utilizadores[indexUtilizador].formacao

                //Gravar o array outra vez
                localStorage.setItem('utilizadores', JSON.stringify(utilizadores))

                //Esconder o botão de Gravar Alterações
                btnGravar.style.display = "none"
                btnCancelar.style.display = 'none'
            })
        }
    }

    //Vai servir para dizer que é para mostrar o Editar no perfil de utilizador
    if (this.document.getElementById('Perfil') != null) {
        document.getElementById('Perfil').addEventListener('click', function () {
            editarPerfil = true;
            localStorage.setItem('editarPerfil', JSON.stringify(editarPerfil))
        })
    }

    //Selecionar e mudar o tipo de utilizador na página de admin
    let selecionarTipoUtilizador = document.getElementById('MudarOTipoDeUtilizador')
    if (selecionarTipoUtilizador != null) {
        selecionarTipoUtilizador.addEventListener('click', function (e) {
            console.log(e.target.outerHTML)
            let oTipo = selecionarTipoUtilizador.options[selecionarTipoUtilizador.selectedIndex].value
            console.log("Tipo de Utilizador" + oTipo)
        })
    }

}
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################

//---------------------------------------------- Funções ----------------------------------------------------------------------------------------
//Função para saber os eventos que um utilizador recomendou
function recomendadosFunc(idUtilizador) {
    let arrayFiltrado = []

    for (let i = 0; i < recomendados.length; i++) {
        for (let k = 0; k < recomendados[i].userId.length; k++) {
            console.log(recomendados[i].userId[k])
            if (recomendados[i].userId[k] == idUtilizador) {
                arrayFiltrado.push(recomendados[i].eventoId)
            }
        }
    }

    return arrayFiltrado //Vai devolver um array com o id dos eventos que o utilizador recomendou
}

//Função para preencher o catálogo com uma mensagem de "erro", para o caso de não existir nenhum evneto à medida que se vai procurando o evento
function msgErroCatalogo(tamanhoArray) { //Nome de coisa

    // let seguir = true
    if (tamanhoArray == 0) { //Ver como isto fica
        document.getElementById('ohPaEle').innerHTML = "Não foi encontrado nenhum evento que corresponda com a pesquisa..." //Como centrar o texto diretamente por aqui
        //seguir = false //Vai retornar false para ajudar, por agora não
    }
}

//Função para saber se se vai mostrar o menu nos eventos ou não
function paNaoSei(eventoUserId) {

    let mostrar = false;

    if (logged == true && utilizadores[indexUtilizador].tipoUtilizador == "Administrador") {
        mostrar = true
    }
    else if (logged == true && utilizadores[indexUtilizador].tipoUtilizador == "Docente") { //Isto está como fotografia poorque mim ser estupido, é para ficar em tipoUtilizador
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
    if (indice == 0) div1.setAttribute('class', 'carousel-item col-sm-4 active');
    else div1.setAttribute('class', 'carousel-item col-sm-4')
    //Cartão
    let div2 = document.createElement('div')
    div2.setAttribute('class', 'card')

    //Meter o cartão dentro do seu container
    div1.appendChild(div2)

    //Imagem
    let divImg = document.createElement('img') //As imagens não estão a aparecer
    if (indice == 0) divImg.setAttribute('class', 'card-img-top h img-fixed');
    else divImg.setAttribute('class', 'card-img-top h img-fluid')

    divImg.setAttribute('src', "images/evento3.jpg")

    div2.appendChild(divImg)

    //Corpo do Card
    let cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body h')

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
    btnDetalhes.setAttribute('class', 'btn btn-primary ' + eventos[indice].id)
    btnDetalhes.setAttribute('href', 'projeto2_Evento.html')
    btnDetalhes.addEventListener('click', verEvento)
    btnDetalhes.innerHTML = 'Saber Mais'
    //Adicionar uma funçao que provavelmente já existe a este botao

    cardBody.appendChild(btnDetalhes)

    //Detalhes do Evento
    if (cardPontuacao == undefined) cardPontuacao = "Por Pontuar"
    let detalhes = document.createElement('p')
    detalhes.setAttribute('class', 'card-text desricao-card-carrosel') //Por esta coisa em letras mais pequenas
    detalhes.style.marginBottom = "0px"
    detalhes.innerHTML = `Data: ${cardData} ||  
                        Hora: ${cardHora}
                        <br>
                        Pontuação ${cardPontuacao}` //Fica melhor com 3,5 / 5

    // let detalhes2 = document.createElement('p')
    // detalhes2.setAttribute('class', 'card-text desricao-card-carrosel')
    // if(cardPontuacao == undefined) cardPontuacao = "Por Pontuar"
    // detalhes2.innerHTML = `Pontuação ${cardPontuacao}`
    div2.appendChild(detalhes)
    // div2.appendChild(detalhes2)

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
                    , i, mostrar, 'ohPaEle')
            }
            else if (eventos[i].data[0] == undefined) {
                preencherCatalogo(eventos[i].nome,
                    eventos[i].imagem,
                    eventos[i].descricao,
                    "Por Anunciar",
                    "Por Anunciar",
                    eventos[i].pontuacao //Fazer alguma coisa quando a pontuação não estiver definida
                    , i, mostrar, 'ohPaEle')
            }
        }
    }
}

//Função para preencher o catálogo, Navegação para cima deles

let linhaContainer = ""

function preencherCatalogo(cardName, cardImage, cardDescricao, cardData, cardHora, cardPontuacao, indice, mostrarMenu/* = false*/, idDoContainer) { //A parte de filtrar é feita antes, esta função só preenche

    //Container principal
    let bossContainer = document.getElementById(idDoContainer) //Meter tudo aqui


    //Botão hamburguer para dropdown
    console.log(idDoContainer)

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

    divPequena.appendChild(btn1)
    divPequena.appendChild(btn2)



    //O cartão em si
    let cartao = document.createElement('div')
    cartao.setAttribute('class', 'card col-lg-4 ' + eventos[indice].id) //Em vez de lg, secalhar fica md

    //Div Imagem / Imagem 
    let divHeader = document.createElement('div')
    divHeader.setAttribute('class', 'card-header')

    let imagem = document.createElement('img')
    imagem.setAttribute('class', 'card-img-top c') //Pode ter que ser card-img-top, só com o card-img é que a imagem see adapta ao tamanho do card
    if (cardImage != "") imagem.setAttribute('src', cardImage)
    else imagem.setAttribute('src', "https://fotos.web.sapo.io/i/G001374c0/19709608_sHKZc.png")

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

    let hr = document.createElement('hr')
    corpitoJeitoso.appendChild(hr)

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


    let hr1 = document.createElement('hr')
    corpitoJeitoso.appendChild(hr1)

    let botaoVer = document.createElement('a')
    botaoVer.setAttribute('href', 'projeto2_Evento.html')
    botaoVer.setAttribute('class', 'btn btn-orange ' + eventos[indice].id)
    botaoVer.textContent = "Saber Mais"
    botaoVer.addEventListener('click', verEvento)
    corpitoJeitoso.appendChild(botaoVer)

    //Meter o corpo no cartão... Eu daqui a uns anos, get it, sem abrigo eheh
    cartao.appendChild(corpitoJeitoso)


    //Esta div leva 4 cards, fazer um if aqui para dizer se ficam na linha ou é criada outra, como   fazer esta filha da putice
    if (indice % 3 == 0 || indice == 0) {
        linhaContainer = document.createElement('div')
        linhaContainer.setAttribute('class', 'row linha-cards')
        linhaContainer.style.width = "100%"
    }

    //Mats
    // contador += indice
    // if (contador > 3) contador = 0; //Confirmar se é =4 ou >4

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
                dias[k].style.background = "green"
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

    //Estes if's são para quando não existir certo elemento numa página, para não dar erros
    if (cal != null)
        cal.setAttribute('min', datinha)
}

//Por o ano no calendário
function anoCalendario() {
    if (document.getElementById('DataCalendário') != null) //Isto devia ser feito com try catch
        document.getElementById('DataCalendário').innerHTML = mesNoCalendario
}

//Função para preencher o catálogo, esta função deve também ser usada quando as setas para mexer no mês forem clicadas, nah, hmmmm +-
function brincadeirasCalendário(mesito = "") { //Em principio não vai voltar a ser usado, foi para testes

    let dias = document.getElementsByClassName('Dias')

    //Inicial por ser a variavel que vai ter a data sem usar nenhuma função
    //Vai ficar deste género: Tue May 08 2018 18:34:27 GMT+0100 (Hora de Verão de GMT)

    // if(mesito != ""){ Fazer esta coisa 

    // }
    // else{

    // }

    let dataInicial = new Date()
    console.log("dataInicial - " + dataInicial)

    //coisas auxiliares
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

    if (mes == 1) { //Melhorar este código de coisa
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
        //console.log('coisa')
    }

    return frase;
}

//Função para preecher o calendário com um mes qualquer
function calendarioFixe(mes, ano) { //TEm que ser o numero do mês

    //Assinalar no calendário o dia em que estamos
    let diaDeHoje = new Date()
    diaDeHoje = diaDeHoje.toString().split(' ')[2]
    console.log('Dia de Hoje = ' + diaDeHoje)
    //############################################
    let dias = document.getElementsByClassName('Dias')

    let diaUm = mes + "/01/" + ano

    let data = new Date(diaUm) //Inicio do mês

    let data1 = data.toString().split(' ') //[0]- Dia da semana, [1]- Mês, [2]- Dia, [3]- Ano, etc...

    let fimMes = fimDoMes(mes)
    let fimDoMesAnterior = fimDoMes(mes - 1)

    //console.log(fimDoMesAnterior)
    let indici = inicioDoMes(data1[0])
    //console.log("O indice devolvido é - " + indici)

    let contadorDiasQueFaltam = fimDoMesAnterior - indici
    // console.log(contadorDiasQueFaltam)
    // console.log(indici)


    let contadorDias = 1
    let contadorDiasUltimos = 1

    if (indici > 5) dias[5].removeAttribute('style')
    else dias[5].style.display = 'none'

    for (let i = 0; i < dias.length; i++) {
        for (let k = 0; k < dias[i].children.length; k++) {

            if (contadorDias <= fimMes) {

                contadorDiasQueFaltam++
                if (k < indici && i == 0) dias[i].children[k].innerHTML = `<i style="color:grey">${contadorDiasQueFaltam}<i>`
                else {
                    dias[i].children[k].innerHTML = contadorDias
                    if (contadorDias == diaDeHoje) {
                        dias[i].children[k].style.background = "#ff950b"
                    }
                    else {
                        dias[i].children[k].removeAttribute('style') //Acho que é preciso, porque senão vai pintando todos os dias à medida que o tempo passa
                    }
                    //console.log("indice - " + k + "|| dias - " + contadorDias)
                    contadorDias++;
                }
            }
            else {
                dias[i].children[k].innerHTML = `<i style="color:green">${contadorDiasUltimos}<i>`
                contadorDiasUltimos++;
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
                        , i, mostrar, 'ohPaEle')
                }
                else if (eventos[k].data[0] == undefined) {
                    preencherCatalogo(eventos[k].nome,
                        eventos[k].imagem,
                        eventos[k].descricao,
                        "Por Anunciar",
                        "Por Anunciar",
                        eventos[k].pontuacao //Fazer alguma coisa quando a pontuação não estiver definida
                        , i, mostrar, 'ohPaEle')
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



    console.log(arrayDevolver) //Este array mesmo sem dar refresh à página não devia acumular se, porque   o faz

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

    if (!parceria) corpo = document.getElementById('bodyUtilizadores') //Anexar as coisas aqui
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
    else {
        let divDropdown = document.createElement('div')
        divDropdown.setAttribute('id', 'caiBaixo')
        divDropdown.setAttribute('class', 'dropdown')
        let leTipo = document.createElement('td')


        let target = utilizadores.filter(function (esse) {
            return esse.id == LeId
        })
        leTipo.setAttribute('class', LeId + ' passarRato dropdown-toggle')
        leTipo.setAttribute('data-toggle', 'dropdown')
        leTipo.innerHTML = target[0].tipoUtilizador
        leTipo.addEventListener('click', mudarTipoUtilizador)

        divDropdown.appendChild(leTipo)
        linha.appendChild(divDropdown)
    }

    corpo.appendChild(linha)
}

//Função para editar o tipo de utilizador
function mudarTipoUtilizador(evento) { //Secalhar isto fica um dropdown em vez de ser um select
    let idAtacar = evento.target.className.split(' ')[0]
    // console.log(idAtacar)
    let dropdownTipoUtilizador = document.getElementById('caiBaixo')

    let selectTipo = document.createElement('div')
    selectTipo.setAttribute('id', 'MudarOTipoDeUtilizador')
    selectTipo.setAttribute('class', 'dropdown-menu')
    // let tipo1 = document.createElement('li')
    // tipo1.setAttribute('class', idAtacar)
    // tipo1.addEventListener('click', AlterarTipoUtilizador)
    let a1 = document.createElement('a')
    a1.setAttribute('class', idAtacar + ' dropdown-item')
    a1.textContent = 'Admnistrador'
    a1.addEventListener('click', AlterarTipoUtilizador)

    // let tipo2 = document.createElement('li')
    // tipo2.setAttribute('class', idAtacar)
    // tipo2.addEventListener('click', AlterarTipoUtilizador)
    let a2 = document.createElement('a')
    a2.setAttribute('class', idAtacar + ' dropdown-item')
    a2.textContent = "Docente"
    a2.addEventListener('click', AlterarTipoUtilizador)

    // let tipo3 = document.createElement('li')
    // tipo3.setAttribute('class', idAtacar)
    // tipo3.addEventListener('click', AlterarTipoUtilizador)
    let a3 = document.createElement('a')
    a3.setAttribute('class', idAtacar + ' dropdown-item')
    a3.textContent = "Estudante"
    a3.addEventListener('click', AlterarTipoUtilizador)

    dropdownTipoUtilizador.appendChild(selectTipo)
    selectTipo.appendChild(a1)
    selectTipo.appendChild(a2)
    selectTipo.appendChild(a3)

    evento.target.appendChild(selectTipo)
    // evento.target.appendChild(document.createElement('p'))
}
//Função para alterar o tipo de utilizador 
function AlterarTipoUtilizador(e) {
    console.log(e.target.className.split(' ')[0])

    let u = utilizadores.filter(function (ev) {
        return ev.id == e.target.className.split(' ')[0]
    })

    let msg = confirm(`Quer mudar o tipo de utilizdor do ${u[0].nome}?`)
    if (msg) {
        for (let i = 0; i < utilizadores.length; i++) {
            if (utilizadores[i].id == e.target.className.split(' ')[0]) {
                utilizadores[i].tipoUtilizador = e.target.textContent
            }
        }

        if (document.getElementById('bodyUtilizadores') != null) {
            document.getElementById('bodyUtilizadores').innerHTML = ""
            for (let i = 0; i < utilizadores.length; i++) {
                preencherTabelaUtiPar(utilizadores[i].nome, utilizadores[i].mail, utilizadores[i].id)
            }
        }
        localStorage.setItem('utilizadores', JSON.stringify(utilizadores))
    }
}

//Função para editar as parcerias
function editarParceria(evento) {

    console.log(evento.target.className)

    let laModaL = document.getElementById('ModalAlterarParceria')

    let atacarre = evento.target.className.split(' ')[2]

    let memoNaVirilha = parcerias.filter(function (leParceria) {
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

                if (evento.path.length == 11) remov = evento.path[2].rowIndex - 1
                else if (evento.path.length == 12) remov = evento.path[3].rowIndex - 1

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

                if (events.path.length == 11) remov = events.path[2].rowIndex - 1
                else if (events.path.length == 12) remov = events.path[3].rowIndex - 1

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
    let azito = document.createElement('a')
    azito.setAttribute('href', 'projeto2_Evento.html')
    azito.setAttribute('target', '_blank')

    azito.appendChild(btn2)
    btn2.appendChild(btn2Conteudo)
    btn2.addEventListener("click", verEvento)

    leBotones.appendChild(azito)

    linha.appendChild(leBotones)

    corpo.appendChild(linha)
}
//Função para editar uma evento
function editarEvento(e) {

    let atacare = e.target.className.split(' ')[2]
    console.log(atacare)

    let caLinda = eventos.filter(function (evento) {
        return evento.id == atacare
    })


    caLinda = caLinda[0]
    if (caLinda.data[0] != undefined) console.log(caLinda.data[0].split(';'))

    ideventoModificar = caLinda.id
    //Código Chato
    //Nome
    document.getElementById('NomeEventoAlt').value = caLinda.nome
    //Data
    if (caLinda.data[0] != undefined) document.getElementById('DataEventoAlt').value = caLinda.data[0].split(';')[0]
    //Hora, para estas cenas funcionarem bem, tenho que limpar a modal sempre que esta fechar
    if (caLinda.data[0] != undefined) document.getElementById('HoraEventoAlt').value = caLinda.data[0].split(';')[1]
    //Descrição
    document.getElementById('DescriçãoEventoAlt').value = caLinda.descricao
    //CAtegoria
    if (caLinda.categoria.length == 1) document.getElementById('CategoriaEventoAlt').value = caLinda.categoria[0] //Isto vai ter que passar para um ciclo for.....
    else {
        let categoriasTodas = ""
        for (let i = 0; i < caLinda.categoria.length; i++) {
            if (i == caLinda.categoria.length - 1) categoriasTodas += caLinda.categoria[i]
            else categoriasTodas += caLinda.categoria[i] + " "
        }
    }
    //Imagem
    if (caLinda.imagem != undefined) document.getElementById('FotografiaEventoAlt').value = caLinda.imagem
    else document.getElementById('FotografiaEventoAlt').value = ""
    //Responsavel
    document.getElementById('ResponsavelEventoAlt').value = caLinda.responsavel

}

function auxiliarData(datita) { //Não é preciso esta  , bennhe
    let leData = ""

    console.log(datita)

    let cenas = datita.split('-')

    leData = cenas[2] + '-' + cenas[1] + '-' + cenas[0]

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
            //console.log(categorias[i].nome[0].toString())
            if (categorias[i].nome[0].toString().toUpperCase() == laCategoria[0].toString().toUpperCase()) unica = false
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
function apresentarCategorias(mostrarLixo = true) { //Para apresentar as categorias também na página dos eventos

    let containerTags = ""

    if (mostrarLixo) containerTags = document.getElementById('containerTags')
    else containerTags = document.getElementById('categoriasEvento')

    let tamanho = 0
    let eventito = ""

    if (mostrarLixo) tamanho = categorias.length
    else {
        eventito = JSON.parse(localStorage.getItem('EventoMostrar'))

        tamanho = eventito._categoria.length
        console.log(eventito._categoria)
    }

    for (let i = 0; i < tamanho; i++) {
        let tag = document.createElement('a')

        //Botão para remover o evento
        let butoneParaRemover = document.createElement('button')
        butoneParaRemover.setAttribute('class', 'btn lixinho ' + categorias[i].id)
        let Maximus = document.createElement('i')
        Maximus.setAttribute('class', 'fas fa-trash Maximus ' + categorias[i].id)

        butoneParaRemover.appendChild(Maximus)
        butoneParaRemover.addEventListener('click', maisUmaFuncione)

        let conteudoTags = ""

        if (mostrarLixo) conteudoTags = categorias[i].nome
        else conteudoTags = eventito._categoria[i]

        tag.textContent = conteudoTags
        if (mostrarLixo == true) tag.appendChild(butoneParaRemover)
        containerTags.appendChild(tag)
    }
}


//Função para encher o array de categorias ao inicio
function EncherCategoriasInicio() {

    let a = ""

    for (let i = 0; i < eventos.length; i++) {
        for (let k = 0; k < eventos[i].categoria.length; k++)

            if (categorias.length == 0) {
                //console.log(eventos[i].categoria[k]) //é um array porque pode haver mais que uma categoria associada ao evento
                a = new Categoria(eventos[i].categoria[k])
                categorias.push(a)
            }
            else if (categoriasUnicasFunc(eventos[i].categoria[k]) == true) {
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

function maisUmaFuncione(event) {

    //console.log(event.target.className)
    let atacare = event.target.className.split(' ')[3]
    console.log(atacare)

    let categoriaElminar = ""
    for (let i = 0; i < categorias.length; i++) {
        if (categorias[i].id == atacare) {
            categoriaElminar = categorias[i].nome
            let a = categorias.splice(i, 1)
            console.log(a[0].nome)
        }
    }

    //Vai eliminar a categoria que foi eliminada dos eventos
    elimnarCategoriasDosEventos(categoriaElminar)

    //Não é preciso gravar o array porque este é preenchido sempre ao inicio

    //FAzer uma função que procure em todos os eventos pela categoria elimada, e a remova do evento
    document.getElementById('containerTags').innerHTML = ""
    apresentarCategorias()
}

//Função para procurar as categorias nos eventos e elimina-las
function elimnarCategoriasDosEventos(categoriaRemover) {

    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].categoria.indexOf(categoriaRemover) != -1) {
            let jajao = eventos[i].categoria.indexOf(categoriaRemover)
            console.log(jajao)
            let eliminada = eventos[i].categoria.splice(jajao, 1)
            alert(`A categoria ${eliminada} foi removida com sucesso`)
        }
    }
    localStorage.setItem('eventos', JSON.stringify(eventos))
}

//Função para guardar os valores para depois usar los na página dos eventos
function verEvento(e) {

    let atacari = e.target.className.split(' ')[2]
    console.log(atacari)

    let pimba = eventos.filter(function (event) {
        return event.id == atacari
    })

    pimba = pimba[0]
    console.log(pimba.pontuacao)

    localStorage.setItem("EventoMostrar", JSON.stringify(pimba))
}

//Função para mostrar os comentários
function mostrarLosComentarios(eventoId, utilizadorId = 0) { //Depois tenho que passar pelos utilizadores e pelos utilizadores e pelos eventos????

    let magicoUtilizador = ""

    if (utilizadorId != 0) {
        magicoUtilizador = utilizadores.filter(function (util) {
            return util.id == utilizadorId
        })
        magicoUtilizador = magicoUtilizador[0]
    }

    let gracasADeusNaoNasciEvento = eventos.filter(function (eve) {
        return eve.id == eventoId
    })


    gracasADeusNaoNasciEvento = gracasADeusNaoNasciEvento[0]
    //console.log(magicoUtilizador, aindaBemQueNaoNasciEvento)

    let comentariosDoEvento = comentarios.filter(function (comentario) {
        return comentario.eventoId == gracasADeusNaoNasciEvento.id
    })

    console.log(comentariosDoEvento)

    let masterDiv = document.getElementById('containerComentarios')
    if (utilizadorId == 0) masterDiv.innerHTML = ""

    let tamanho = 0
    if (utilizadorId != 0) tamanho = 1
    else tamanho = comentariosDoEvento.length

    for (let i = 0; i < tamanho; i++) { //Ou fazer mais filters para ir adaptando os utilizadores... 

        if (utilizadorId == 0) {
            magicoUtilizador = utilizadores.filter(function (util) {
                return util.id == comentariosDoEvento[i].userId
            })
            magicoUtilizador = magicoUtilizador[0]
        }

        //Criar a caixa de comentário
        let caixaGrande = document.createElement('div')
        caixaGrande.setAttribute('class', 'media comment-box')

        let caixaComImagem = document.createElement('div')  //Fazer appened
        caixaComImagem.setAttribute('class', 'media-left')

        let referenciaParaPaginaUtilizador = document.createElement('a')
        referenciaParaPaginaUtilizador.setAttribute('href', 'projeto2_Perfil.html')

        //Adicionar o eventoListener à imagem
        let imagem = document.createElement('img')
        let conteudoImagem = ""
        if (magicoUtilizador.fotografia != "") conteudoImagem = magicoUtilizador.fotografia //Posso ter que mudar isto visto que os utilizadores estão a ficar mal, feito, já está bem em principio
        else conteudoImagem = "https://drwfxyu78e9uq.cloudfront.net/usercontent/olhafrutafresca/media/images/95082ab-batata-doce.jpg"

        imagem.setAttribute('src', conteudoImagem)

        referenciaParaPaginaUtilizador.appendChild(imagem)
        caixaComImagem.appendChild(referenciaParaPaginaUtilizador)
        caixaGrande.appendChild(caixaComImagem)

        let divComentario = document.createElement('div')
        divComentario.setAttribute('class', 'media-body')

        let nomeComentario = document.createElement('h4')
        nomeComentario.setAttribute('class', 'media-heading')
        nomeComentario.textContent = magicoUtilizador.nome

        //console.log(magicoUtilizador)
        divComentario.appendChild(nomeComentario)

        let textoComentario = document.createElement('p')
        if (utilizadorId == 0) textoComentario.textContent = comentariosDoEvento[i].comentario
        else {
            if (comentariosDoEvento[comentariosDoEvento.length - 1].comentario != undefined) {
                textoComentario.textContent = comentariosDoEvento[comentariosDoEvento.length - 1].comentario //Para ir buscar só o ultimio comentário feito
            }
        }

        divComentario.appendChild(textoComentario)
        caixaGrande.appendChild(divComentario)
        masterDiv.appendChild(caixaGrande)
    }

}

let valorDeMercado = 0; //Valor que vai seer adicionado à pontuação

function botaoPontuar(e) { //Isto vai abrir um botão para deixar pontuar, cada utilizador só vai pontuar o evento 1 vez, secalhar adicionar um bolleano para dizer se já pontoou ou não

    if (logged && utilizadores[indexUtilizador].pontoou == false) {
        let botaozao = document.getElementById('botaoPontuar')
        let estrelasPontuar = document.getElementsByClassName('btn btn-default btn-grey btn-sm')

        botaozao.style.display = 'inline-block'


        if (e.target.id == "") valorDeMercado = parseInt(e.target.parentNode.id)
        else valorDeMercado = parseInt(e.target.id)
        let botone = document.getElementById('botaoPontuar')
        botone.addEventListener('click', realmentePontuar)

        //Agora, pintar as estrelas




        console.log(valorDeMercado)

        for (let i = 0; i < estrelasPontuar.length; i++) {
            if (estrelasPontuar[i].id <= valorDeMercado) {
                estrelasPontuar[i].style.background = "rgb(255,193,7)"
            }
            else {
                estrelasPontuar[i].style.background = "grey"
            }//class="fa fa-star"
        }
    }
    else {
        if(utilizadores[indexUtilizador].pontoou == false) alert('Já pontuaste este evento')
        else alert("Tens que estar logado para pontuar")
    }

}

function realmentePontuar() { //Em principio as matemáticas vão ser feitas na classe
    let a = ""
    if (localStorage.getItem('EventoMostrar')) {
        a = JSON.parse(localStorage.getItem('EventoMostrar'))
    }

    let elIndex = 0;
    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].id == a._id) {
            elIndex = i
        }
    }

    //Matemáticas
    console.log(eventos[elIndex].nome) //Dá o que quero
    console.log(valorDeMercado)
    eventos[elIndex].pontuacao = valorDeMercado
    document.getElementById('pontuacaoMedia').innerHTML = `${eventos[elIndex].pontuacao} <small style="font-size:20px">/5</small>`
    localStorage.setItem('eventos', JSON.stringify(eventos))
    //Fazer com que o utilizador não possa voltar a pontuar
    utilizadores[indexUtilizador].pontoou = true
    localStorage.setItem('utilizadores', JSON.stringify(utilizadores))
    
    localStorage.setItem('eventoMostrar', JSON.stringify(eventos[elIndex]))
}

//Função para verificar os inscritos
function inscritosEvento(idDoEvento) { //recebe o id do evento e corre o array de inscritos nesse e devolve os num novo array

    let novoArray = []

    let elEvento = eventos.filter(function (evento) {
        return evento.id == idDoEvento
    })

    for (let i = 0; i < elEvento[0].inscritos.length; i++) {
        for (let k = 0; k < utilizadores.length; k++) {
            if (elEvento[0].inscritos[i] == utilizadores[k].id) novoArray.push(utilizadores[i]) //Assim é só passar a foto destes utilizadores em vez de estar a fazer match de id's   
        }
    }

    return novoArray
}


//Função para preencher a cena com a cabeçorra dos utilizadores
function cabeconas(arrayPassar) { //Este array deve ser o array que é devolvido na função inscritosEvento()

    let leContainer = document.getElementById('containerInscritos')
    console.log(arrayPassar.length)
    leContainer.innerHTML = ""

    let divMaximus = document.createElement('div')
    divMaximus.setAttribute('class', 'row')

    leContainer.appendChild(divMaximus)
    for (let i = 0; i < 4; i++) { //arrayPassar.length, não vai ser este o tamanho, porque vão aparecer no máximo 3 caras + 1 (+) 
        let div = document.createElement('div')
        div.setAttribute('class', 'col-sm-3')

        divMaximus.appendChild(div)

        let maisUmDiv = document.createElement('div')

        div.appendChild(maisUmDiv)

        let figureTag = document.createElement('figure')

        maisUmDiv.appendChild(figureTag)

        let leImagem = document.createElement('img')
        leImagem.setAttribute('class', 'pessoas-inscritas')

        let imagemLinda = ""
        if (i == 3) imagemLinda = "images/+.png"
        else if (arrayPassar[i] == undefined) imagemLinda = "images/6.jpg"
        else if (arrayPassar[i].fotografia == "") imagemLinda = "https://drwfxyu78e9uq.cloudfront.net/usercontent/olhafrutafresca/media/images/95082ab-batata-doce.jpg"
        else imagemLinda = arrayPassar[i].fotografia

        leImagem.setAttribute('src', imagemLinda)
        leImagem.setAttribute('alt', 'Inscritos') //Porque user friendly é FIXI

        figureTag.appendChild(leImagem)

        //Em principio tá
        //Falta só criar uma função para as carinhas que faça a ligação para a página desse utilizador
        //preciso de por os id's dos utilizadores nas caras para isso...
    }
}

function preencherTestemunhos() {

    let leDiv = document.getElementById('containerTestemunhos')
    leDiv.innerHTML = ""

    let srcImagem = ""
    let nomeUtilizador = ""
    for (let i = 0; i < testemunhos.length; i++) {

        let div1 = document.createElement('div')

        if (i == 0 || i % 3 == 0) {
            let DivDosDivs = document.createElement('div')
            DivDosDivs.setAttribute('class', 'row')
            DivDosDivs.appendChild(div1)
            leDiv.appendChild(DivDosDivs)
            if (i != 0) {
                let br = document.createElement('br')
                leDiv.appendChild(br)
            }
        }


        div1.setAttribute('class', 'col-xs-12 col-sm-6 col-md-4 leTestamento')

        let div2 = document.createElement('div')
        div1.appendChild(div2)

        let div3 = document.createElement('div')
        div3.setAttribute('class', 'testemunho')
        div2.appendChild(div3)

        let div4 = document.createElement('div')
        div4.setAttribute('class', 'card')
        div3.appendChild(div4)

        let div5 = document.createElement('div')
        div5.setAttribute('class', 'card-body text-center')
        div4.appendChild(div5)

        let figure = document.createElement('figure')
        div5.appendChild(figure)

        //Imagem
        let img = document.createElement('img')
        img.setAttribute('class', 'img-testemunho')
        img.setAttribute('alt', 'Cara Do Gajo/a')

        for (let k = 0; k < utilizadores.length; k++) {
            if (testemunhos[i].userId == utilizadores[k].id) {

                //Imagem
                if (utilizadores[k].fotografia == "") srcImagem = "https://drwfxyu78e9uq.cloudfront.net/usercontent/olhafrutafresca/media/images/95082ab-batata-doce.jpg"
                else srcImagem = utilizadores[k].fotografia

                //Nome de Utilizador
                nomeUtilizador = utilizadores[k].nome
            }
        }

        img.setAttribute('src', srcImagem)
        figure.appendChild(img)
        //---------------------------------------------------

        let h5 = document.createElement('h5')
        h5.setAttribute('class', 'nome-testemunho')
        h5.textContent = nomeUtilizador

        div5.appendChild(h5)

        let p = document.createElement('p')
        p.setAttribute('class', 'texto-testemunho')
        p.textContent = testemunhos[i].testemunho
        console.log(testemunhos[i].testemunho)

        div5.appendChild(p)
    }
}

//Função para dar os valores aos cardsna página do Admin
function cardsDoAdmin() {
    let contEventos = document.getElementById('contadorEventos')
    let contParcerias = document.getElementById('contadorParcerias')
    let contCategorias = document.getElementById('contadorCategorias')
    let contEstudantes = document.getElementById('contadorEstudantes')
    let contDocentes = document.getElementById('contadorDocentes')

    let a = 0, b = 0;
    for (let i = 0; i < utilizadores.length; i++) {
        if (utilizadores[i].tipoUtilizador == "Docente") a++
        else if (utilizadores[i].tipoUtilizador == 'Estudante') b++
    }

    contEstudantes.innerHTML = "Estudantes: " + b; contDocentes.innerHTML = "Docentes: " + a;

    contEventos.innerHTML = eventos.length
    contParcerias.innerHTML = parcerias.length
    contCategorias.innerHTML = categorias.length;
}

//Função para guardar o utilizador escolhido para ver a página de perfil, em local storage
function guardarUtilizador(e) {

    let idAtacar = e.target.className

    let elUtilizador = utilizadores.filter(function (utilizadore) {
        return utilizadore.id == idAtacar
    })

    console.log(elUtilizador[0])

    editarPerfil = false
    localStorage.setItem("editarPerfil", JSON.stringify(editarPerfil))
    localStorage.setItem("UtilizadorMostrar", JSON.stringify(elUtilizador[0]))
}

//Função para preencher as parcerias
function preencherListaDeParcerias() {
    if (document.getElementById('parcerias') != null) {

        let fazerAppenedAqui = document.getElementById('asParcerias')
        fazerAppenedAqui.innerHTML = ""

        for (let i = 0; i < parcerias.length; i++) {
            let li = document.createElement('li')
            let div = document.createElement('div')
            div.setAttribute('class', 'parc')

            li.appendChild(div)

            let h2 = document.createElement('h2')
            h2.setAttribute('class', 'title')
            h2.textContent = parcerias[i].nome

            div.appendChild(h2)

            let p = document.createElement('p')
            p.setAttribute('class', 'loc')
            p.textContent = parcerias[i].localizacao

            div.appendChild(p)

            let ul = document.createElement('ul')

            div.appendChild(ul)

            let li2 = document.createElement('li')

            ul.appendChild(li2)



            let a = document.createElement('a')
            a.setAttribute('href', parcerias[i].link)

            console.log(parcerias[i].link)
            if (parcerias[i].link != "") a.innerHTML = parcerias[i].link
            else a.innerHTML = "Está mal"

            li2.appendChild(a)

            fazerAppenedAqui.appendChild(li)
        }
    }
}

//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################
//#######################################################################################################################

//-----------------------------------------------------------------------------------------------------------------------------------------------

//Por este tipo de coisas num outro ficheiro secalhar
//Tem que estar fora do window.onload
function Mapa() {
    let location = new google.maps.LatLng(41.366858, -8.738309);

    // Posicionar o mapa
    let map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 14,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#1d2c4d"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8ec3b9"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1a3646"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#4b6878"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#64779e"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#4b6878"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#334e87"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#023e58"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#283d6a"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6f9ba5"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1d2c4d"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#023e58"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3C7680"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#304a7d"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#98a5be"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1d2c4d"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2c6675"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#255763"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#b0d5ce"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#023e58"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#98a5be"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1d2c4d"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#283d6a"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3a4762"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#0e1626"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#4e6d70"
                    }
                ]
            }
        ]
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
