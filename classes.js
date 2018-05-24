//---------------------------------------------- Classes ----------------------------------------------------------------------------------------
//Isto mal possa vai para um ficheiro à parte, Done alalalalalalalalalalalalalala
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
        this._categoria = []

        this.nome = nome
        this.data = data
        this.pontuacao = pontuacao
        this.inscritos = inscritos
        this.descricao = descricao
        this.categoria = categoria
        this.imagem = imagem
        this.responsavel = responsavel
        this.userId = userId
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
        if (this._categoria != undefined) {
            for (let i = 0; i < this._categoria.length; i++) {
                if (valor.toUpperCase() == this._categoria[i].toUpperCase()) {
                    return //Isto faz com que se saia imediatamente do set, sem fazer push do valor
                }
            }
        } else {
            this._categoria.push(valor)
        }

        this._categoria.push(valor)
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

    static confirmarCategorias() {

    }
}


//Another One
class Parceria {
    constructor(nome, localizacao, link) {
        this.nome = nome
        this.localizacao = localizacao
        this.link = link

        this._id = Parceria.getLastId() + 1
    }

    get nome() {
        return this._nome
    }

    set nome(valor) {
        this._nome = valor
    }

    get localizacao() {
        return this._localizacao
    }

    set localizacao(valor) {
        this._localizacao = valor
    }

    get link() {
        return this._link
    }

    set link(valor) {
        this._link = valor
    }

    get id() {
        return this._id
    }

    // Get the last ID
    static getLastId() {
        let lastId = 0
        if (parcerias.length > 0) {
            lastId = parcerias[parcerias.length - 1].id
            //console.log('O lastId do utilizador é = ' + lastId)
        }

        return lastId
    }
}

//Another another one
class Categoria {
    constructor(nome) {
        this.nome = nome

        this._id = Categoria.getLastId() + 1;
    }

    get nome() {
        return this._nome
    }

    set nome(valor) {
        this._nome = valor
    }

    get id() {
        return this._id
    }

    // Get the last ID
    static getLastId() {
        let lastId = 0
        if (categorias.length > 0) {
            lastId = categorias[categorias.length - 1].id
            //console.log('O lastId do utilizador é = ' + lastId)
        }

        return lastId
    }
}