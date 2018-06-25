//vai ser usada para procurar por tags iguais no resto dos eventos
let tagAnalisar = ""

//vai contar as vezes que a tag em cima aparece, de cada vez que a tag mudar este contador vai ter que voltar a zero
let contadorAssociado = 0

//As tags mais usadas vêm para este 
let tagsMaisUsadas = []

//Array que vai guardar as tags todas para depois serem filtradas
let todasAsTags = []

//Guardar o id do utilizador loggado
let idDoUtilizadorLog = 0

/*Evetos em que o utilizador está inscrito, vai servir para facilitar a vida ao ver
se o utilizador participou em algum dos eventos que recomendou*/
// let idDosEventosParicipados = [], em principio não vai ser preciso
//Array com os objetos Tag
let tags = []

//Este array vai guardar as tags que vão seer procuradas para sugerir eventos
let tagsProcurar = []

//Vai ser preciso este array principalmente para não deixar que a lista de recomendados tenha eventos repetidos
let eventosFiltrados = []

class Tag {
    constructor(nome, contador) {
        this.nome = nome
        this.contador = contador
    }

    set nome(valor) {
        this._nome = valor
    }

    get nome() {
        return this._nome
    }

    set contador(valor) {
        this._contador = valor
    }

    get contador() {
        return this._contador
    }
}

// analisarEventos() //Tem que se chamar a função para correr isto em Node

function eventsToRecomend() {

    idDoUtilizadorLog = utilizadores[indexUtilizador].id

    analisarEventos()
    console.log(todasAsTags)

    contarTags()
    console.log(tags)

    tagsMaisVistas()
    console.log(tagsProcurar)

    eventosRecomendados()
    console.log(eventosFiltrados)

    finalFiltration()
    console.log(eventosFiltrados)

    if (eventosFiltrados.length > 0) {
        preencherModalNotificacao(eventosFiltrados, 'containerlosRecomendados')
        // document.getElementById('exampleModalLongTitle').innerHTML = 'Recomendados'
    }
    else {
        document.getElementById('containerEventos2Dias').innerHTML = 'Ainda não há eventos'
    }
}

//Manda um evento para ser analisado
function analisarEventos() {
    // console.log('atatatatatatatatatatatatatata')


    // console.log(idDoUtilizadorLog)
    //Saber quais são os eventos em que o utilizador está inscrito
    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].inscritos.length > 0) {
            for (let k = 0; k < eventos[i].inscritos.length; k++) {
                /*Os eventos que vão ser passados para a funcção analisarTags, vão ser aqueles em
                que o utilizador logado está inscrito*/
                if (eventos[i].inscritos[k] == idDoUtilizadorLog) {
                    // console.log(eventos[i])
                    InserirTagsNoArray(eventos[i])
                }
            }
        }
    }

    //Vou ter que fazer a mesma cena para os recomendados
    //aqui vai

    for (let i = 0; i < recomendados.length; i++) {
        if (verificarRecomendado(recomendados[i])) {
            let oEvento = eventos.filter(function (eve) {
                return eve.id == recomendados[i].eventoId
            })
            InserirTagsNoArray(oEvento[0])
        }
    }

}

//Analisar as tags de um evento
function InserirTagsNoArray(evento) {

    for (let i = 0; i < evento.categoria.length; i++) {
        todasAsTags.push(evento.categoria[i])
    }

    // console.log(todasAsTags)
}

/*Saber se o utilizador se inscreveu e recomendou o evento, caso o tenha feito, devolve false e
as tags do evento recomendado não são contabilizadas */
function verificarRecomendado(recomendado) {
    let inscrito = false
    // console.log('id a atacar - ' + idDoUtilizadorLog)
    for (let j = 0; j < recomendado.userId.length; j++) {
        if (recomendado.userId[j] == idDoUtilizadorLog) inscrito = true
    }

    return inscrito
}

//Até Aqui parece estar a funcionar como quero

//Saber quais são as categorias que são 'vistos' mais vezes
function contarTags() {
    for (let i = 0; i < todasAsTags.length; i++) {
        contarECriar(todasAsTags[i])
    }
}

//Vai receber uma tag e vai ver quantas vezes esta aparece e criar um objeto com o nome e o numero de vezes que a tag aparecer
function contarECriar(leTag) {

    let contador = 0;
    for (let k = 0; k < todasAsTags.length; k++) {
        if (leTag.toUpperCase() == todasAsTags[k].toUpperCase()) {
            contador++
        }
    }

    let aTag = new Tag(leTag, contador)

    if (tags.length == 0) {
        tags.push(aTag)
    }
    else {
        let meter = true
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].nome.toUpperCase() == leTag.toUpperCase()) meter = false
        }

        if (meter) tags.push(aTag)
    }
}

//Filtrar as tags mais 'vistas', ou seja, ordenar por pontuação o array das tags e depois adicionar as três melhor pontuadas
//ao Array que vai ser usado para procurar pelas tags noutros eventos, a 4º tag vai ser sempre aleatória para 
//fazer com que o utilizador tenha mais eventos que lhe possam interessar à sua disponiblidade
function tagsMaisVistas() {
    tags = tags.sort(function (a, b) {
        return b.contador - a.contador
    });

    console.log(tags)
    let tamanho = tags.length
    // if (tamanho > 2) tamanho = 2

    let numeroAleatorio = Math.floor((Math.random() * tags.length) + tamanho);
    // console.log('Numero Aleatório - ' + numeroAleatorio)
    //Para não meter nenhuma das primeiras tags que já lá estão

    while (numeroAleatorio > tamanho) {
        numeroAleatorio = Math.floor((Math.random() * tags.length) + tamanho);
        console.log('Numero Aleatório - ' + numeroAleatorio)
    }
    // console.log(tamanho, numeroAleatorio)



    for (let i = 0; i < tamanho; i++) {
        // console.log('ala')
        tagsProcurar.push(tags[i])
    }


    
    if (tagsProcurar.length == 4) {
        // console.log(numeroAleatorio)
        tagsProcurar.push(tags[numeroAleatorio])
    }
    else if (tagsProcurar.length < 3 && tags.length >= 4) {
        // console.log('totototototototto')
        while (tagsProcurar.length <= 4) {

            tagsProcurar.push(tags[numeroAleatorio])
            numeroAleatorio = Math.floor((Math.random() * tags.length) + tamanho);
        }
    }
}

//Finalmente procurar pelos eventos a ser recomendados
function eventosRecomendados() { //Só se vai mostrar 10 eventos

    for (let i = 0; i < eventos.length; i++) {
        for (let k = 0; k < eventos[i].categoria.length; k++) {
            auxiliarEventosRecomendados(eventos[i].categoria[k], i)
        }
    }
}

//Encontrar categorias nos eventos
function auxiliarEventosRecomendados(categoria, indice) {
    let podeSeguir = false
    // console.log('atatatatatatatatatata')
    // console.log(tagsProcurar.length)
    for (let j = 0; j < tagsProcurar.length; j++) {
        console.log(tagsProcurar)
        if (tagsProcurar[j] != undefined && tagsProcurar[j].nome.toUpperCase() == categoria.toUpperCase()) {
            podeSeguir = true
            // console.log('sinhe')
        }
    }

    if (eventosFiltrados.length == 0 && podeSeguir == true) {
        // console.log('ata')
        eventosFiltrados.push(eventos[indice])
    }
    else if (eventosFiltrados.length > 0 && podeSeguir == true) {
        let confirmarEvento = eventosFiltrados.find(function (evento) {
            return evento.id == eventos[indice].id
        })

        if (confirmarEvento == undefined) eventosFiltrados.push(eventos[indice])
        // console.log('atatatatatatatatatata')
    }

    // console.log(eventosFiltrados)
}

//filtrar pela ultima vez os eventos já filtrados
function finalFiltration() {
    let array1 = eventosFiltrados.concat()
    eventosFiltrados = []

    let diaHoje = dataAtual.getDate()
    let mesHoje = dataAtual.getMonth() + 1

    let diaEvento = 0
    let mesEvento = 0

    // console.log(array1)
    for (let i = 0; i < array1.length; i++) {

        let podeIr = true
        if (array1[i].inscritos.length > 0) {
            for (let k = 0; k < array1[i].inscritos.length; k++) {
                if (array1[i].inscritos[k] == utilizadores[indexUtilizador].id) {
                    podeIr = false
                }
            }
        }



        if (podeIr) {
            diaEvento = array1[i].data[0].split(';')[0].split('-')[2]
            mesEvento = array1[i].data[0].split(';')[0].split('-')[1]

            if (mesEvento >= mesHoje && diaEvento >= diaHoje){
                eventosFiltrados.push(array1[i])
                console.log(array1[i])
            }
        }
    }
}