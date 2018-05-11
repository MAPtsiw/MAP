//Variáveis Globais:
let utilizadores = []

let eventos = []

//Vai servir para saber se há alguém com sessão iniciada ou não
let logged = false;

//Vai simplificar saber qual é o indice no array utilizadores do utilizador loggado
let indexUtilizador = 0;

//Vai ser usada para por o mês a atualizar se automaticamente no calendário
let mesNoCalendario = ""

//------------------------------------------


window.onload = function () {

    //TEstes com o calendário
    //brincadeirasCalendário(); Funciona

    let datinha = new Date() //VAi ser mais vezes usado

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
            let novoUtilizador = new Utilizador(nome, password, eMail, foto, tipo)

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

            //Botão de registar disabled, não me parece a melhor opção, mas de outra maneira daria trabalho a mais para agora
            let btnRegistar = document.getElementById('Registar')
            btnRegistar.disabled = true

            if (btnAdicionar != null)
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



    //Botão de LogOff
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

        //Esconder o botão de Adicionar Eventos
        if (btnAdicionar != null)
            btnAdicionar.style.display = 'none'

        indexUtilizador = 0

        logged = false; //Em principio vai ser esta variavel que vai dizer o que é que se mostra ou não nas páginas
        localStorage.setItem('logged', JSON.stringify(logged))

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
                        }
                    }
                }



                if (temEventos == true) {
                    document.getElementById('ohPaEle').innerHTML = ""
                    for (let i = 0; i < losDiasOcupados.length; i++) {
                        //Aqui vai ser a tal função que vai filtrar os eventos... Que vai sempre funcionar passando um evento de cada vez
                        if (document.getElementById('ohPaEle') != null) {
                            if (losDiasOcupados[i].data != undefined && losDiasOcupados[i].data[0] != undefined) {
                                preencherCatalogo(losDiasOcupados[i].nome,
                                    losDiasOcupados[i].imagem,
                                    losDiasOcupados[i].descricao,
                                    losDiasOcupados[i].data[0].split(';')[0],
                                    losDiasOcupados[i].data[0].split(';')[1],
                                    losDiasOcupados[i].pontuacao,
                                    i)
                            }
                            else if (losDiasOcupados[i].data != undefined && losDiasOcupados[i].data[0] == undefined) {
                                preencherCatalogo(losDiasOcupados[i].nome,
                                    losDiasOcupados[i].imagem,
                                    losDiasOcupados[i].descricao,
                                    "Por Anunciar",
                                    "Por Anunciar",
                                    losDiasOcupados[i].pontuacao,
                                    i)
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


    let btnPesquisar = document.getElementById('btnPesquisar')
    if (btnPesquisar != undefined) {

        btnPesquisar.addEventListener('click', function () {

            let seguir = true;

            let searchNome = document.getElementById('searchNome')
            let searchGenero = document.getElementById('searchGenero')
            let c = document.getElementById('searchData')

            let searchData = c.options[c.selectedIndex].value

            if (searchNome == "" && searchGenero == "" && searchData == -1) { //Acho que -1 é o valor para o caso de nada ser escolhido dentro da tag select
                seguir = false;
            }

            if (!seguir) {
                alert("Tem que selecionar pelo menos um campo a pesquisar!!!")
            }
            else {

                if (searchData == "Todos") {
                    encherCatalogo(); //Nah sei se isto pode ser feito assim, porque pode se dizer para filtrar todos e mesmo assim ter um nome e genero a filtrar

                } else {
                    let filtrados = filtrarEventos(searchNome, searchGenero, searchData); //Vai devolver um array com os eventos filtrados

                    for (let i = 0; i < filtrados.length; i++) {
                        if (document.getElementById('ohPaEle') != null) { //Isto secalhar vai para uma função
                            if (filtrados[i].data[0] != undefined) {
                                preencherCatalogo(filtrados[i].nome,
                                    filtrados[i].imagem,
                                    filtrados[i].descricao,
                                    filtrados[i].data[0].split(';')[0],
                                    filtrados[i].data[0].split(';')[1],
                                    filtrados[i].pontuacao
                                    , i)
                            }
                            else if (filtrados[i].data[0] == undefined) {
                                preencherCatalogo(filtrados[i].nome,
                                    filtrados[i].imagem,
                                    filtrados[i].descricao,
                                    "Por Anunciar",
                                    "Por Anunciar",
                                    filtrados[i].pontuacao //Fazer alguma merda quando a pontuação não estiver definida
                                    , i)
                            }
                        }
                    }
                }
            }

        })
    }
}


//---------------------------------------------- Classes ----------------------------------------------------------------------------------------
//Isto mal possa vai para um ficheiro à parte
class Utilizador {
    constructor(nome, pass, mail, foto, tipo) { //Por agora vai ficar assim, não é dificil de acrescentar merdas
        this.nome = nome
        this.password = pass
        this.mail = mail
        this.fotografia = foto
        this.tipoUtilizador = tipo //Vai distinguir se o utilizador é Estudante ou docente

        this._id = Utilizador.getLastId() + 1
    }

    get nome() {
        return this._nome
    }

    set nome(valor) {
        this._nome = valor
    }

    get password() {
        return this._password
    }

    set password(valor) {
        this._password = valor
    }

    get mail() {
        return this._mail
    }

    set mail(valor) {
        this._mail = valor
    }

    get fotografia() {
        return this._fotografia
    }

    set fotografia(valor) {
        this._fotografia = valor
    }

    get tipoUtilizador() {
        return this._tipo
    }

    set tipoUtilizador(valor) {
        this._tipo = valor
    }

    get id() {
        return this._id
    }

    // Get the last ID
    static getLastId() {
        let lastId = 0
        if (utilizadores.length > 0) {
            lastId = utilizadores[utilizadores.length - 1].id
            //console.log('O lastId do utilizador é = ' + lastId)
        }

        return lastId
    }
}

class Evento {
    constructor(nome, data, descricao, categoria, imagem, responsavel, /*Fica em último, ou então não*/ userId, pontuacao, inscritos) { //Puta de grande
        this.nome = nome
        this.data = data
        this.pontuacao = pontuacao
        this.inscritos = inscritos
        this.descricao = descricao
        this.categoria = categoria
        this.imagem = imagem
        this.responsavel = responsavel

        this._id = Evento.getLastId() + 1
    }

    get nome() {
        return this._nome
    }

    set nome(valor) {
        this._nome = valor
    }

    get data() { //Isto vai ser um array que vai guardar data e hora, por esta ordem....
        return this._data
    }

    set data(valor) {
        this._data = valor
    }

    get pontuacao() {
        return this._pontuacao
    }

    set pontuacao(valor) {
        this._pontuacao = valor
    }

    get inscritos() {
        return this._inscritos
    }

    set inscritos(valor) {
        this._inscritos = valor
    }

    get descricao() {
        return this._descricao
    }

    set descricao(valor) {
        this._descricao = valor
    }

    get categoria() {
        return this._categoria
    }

    set categoria(valor) {
        this._categoria = valor
    }

    get imagem() {
        return this._imagem
    }

    set imagem(valor) {
        this._imagem = valor
    }

    get responsavel() {
        return this._responsavel
    }

    set responsavel(valor) {
        this._responsavel = valor
    }

    get id() {
        return this._id
    }

    get userId() {
        return this._userId
    }

    set userId(valor) {
        this._userId = valor
    }

    // Get the last ID
    static getLastId() {
        let lastId = 0
        if (eventos.length > 0) {
            lastId = eventos[eventos.length - 1].id
            //console.log('O lastId do utilizador é = ' + lastId)
        }

        return lastId
    }
}



//---------------------------------------------- Funções ----------------------------------------------------------------------------------------

//Filtrar os Eventos, voltar aqui e fazer duas funções auxiliares
function filtrarEventos(nome, genero, data) {

    let arrayMaiLindo = []


    if (nome != "" || genero != "") {

    }
    else if (nome == "" && genero == "") {
        //Só função para data
        if (data != ""){
            
        }
    }

}
//Função para preencher o carrosel 
function preencherCarrosel(cardName, cardImage, cardDescricao, cardData, cardHora, cardPontuacao, indice) {

    let container = document.getElementById('containerCardsCarrosel')

    //Div para por o cartão
    let div1 = document.createElement('div')
    div1.setAttribute('class', 'carousel-item col-md-4 active')

    //Cartão
    let div2 = document.createElement('div')
    div2.setAttribute('class', 'card')

    //Meter o cartão dentro do seu container
    div1.appendChild(div2)

    //Imagem
    let divImg = document.createElement('img') //As imagens nã estão a aparecer
    divImg.setAttribute('class', 'card-img-top img-fixed')
    divImg.setAttribute('src', "http://placehold.it/800x600/f44242/fff")

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

    descricao = ajustarDescricao(descricao)
    descricao.setAttribute('class', 'card-text')
    descricao.textContent = cardDescricao

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

//Função para preencher o catálogo ao entrar na página
function encherCatalogo() {
    contador = 0;
    for (let i = 0; i < eventos.length; i++) {
        if (document.getElementById('ohPaEle') != null) { //Isto secalhar vai para uma função
            if (eventos[i].data[0] != undefined) {
                preencherCatalogo(eventos[i].nome,
                    eventos[i].imagem,
                    eventos[i].descricao,
                    eventos[i].data[0].split(';')[0],
                    eventos[i].data[0].split(';')[1],
                    eventos[i].pontuacao
                    , i)
            }
            else if (eventos[i].data[0] == undefined) {
                preencherCatalogo(eventos[i].nome,
                    eventos[i].imagem,
                    eventos[i].descricao,
                    "Por Anunciar",
                    "Por Anunciar",
                    eventos[i].pontuacao //Fazer alguma merda quando a pontuação não estiver definida
                    , i)
            }
        }
    }
}

//Função para preencher o catálogo, Navegação para cima deles

let linhaContainer = ""

function preencherCatalogo(cardName, cardImage, cardDescricao, cardData, cardHora, cardPontuacao, indice) { //A parte de filtrar é feita antes, esta função só preenche

    //Container principal
    let bossContainer = document.getElementById('ohPaEle') //Meter tudo aqui

    //O cartão em si
    let cartao = document.createElement('div')
    cartao.setAttribute('class', 'card col-lg-3') //Em vez de lg, secalhar fica md

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
    corpitoJeitoso.appendChild(titulo)

    //Descrição
    let descricao = document.createElement('p')

    descricao = ajustarDescricao(descricao)
    descricao.setAttribute('class', 'mnac')
    descricao.textContent = cardDescricao
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

    if (desc.length > 50) {
        frase = desc.substr(0, 50) + "...";
        console.log(frase)
    }
    else {
        frase = desc
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