#Notas:
    - [ ] = Não feito, - [x] = Feito.

#Cenas  
- [ ] Cabeçalho
    * - [ ] Log-In/Registar/Log-off
    * - [ ] Search Bar
- [ ] Back-Office/Adminstrador
- [ ] Eventos
- [x] Mapa
- [ ] Carrosel
- [ ] About Us
- [ ] Footer
- [ ] Página catálogo/agenda
    - [x] Calendário (+-)
    - [ ] Catálogo
- [ ] Página Admin
- [ ] Página Testemunho dos Estudantes
- [ ] Página Perfil Utilizador
- #Código
- #Links 
- #Merdas a Fazer Atualizado


#Cabeçalho

* ##Log-In / Registar
    Tem que haver alguma restrição para a opção de adminstrador, se é que ela deve existir (Registar)

* ##Log-off
    Fazer com que antes de terminar a sessão confirme se o utilizador quer mesmo sair

* ##Search Bar
    Decidir se por e onde por

* Mudar o nome das cenas no cabeçalho e por tudo para a direita

* "Pintar" no cabeçalho o "sitio" onde o utilizador estiver.

* Adicionar a opção de ver o perfil do utilizador ao fazer login, isto se for docente ou estudante, e para Admin???????

* Fazer com que alguma janela seja aberta num separador diferente?


#Back-Office/Adminstrador



#Eventos
*Temos que ter uma merda que diga aonde se pode comprar os bilhetes.....

    - * Formulário:
        Hora:
        * tentar alterar o input da hora para algo de jeito
        * Deixar com que a hora não se defina ao preencher o formulário, dar a opção de alterar ou preencher a hora depois... (Aondes caralhes????), fazer o mesmo para a data??????

    -* Erros
        Mudar a maneira como se diz que o evento não foi submetido, porque algum campo foi mal preenchido



#Mapa
*Google maps project:
    -O ID do seu projeto será projeto-1-202316
    chave: AIzaSyDWwaEDkLeJWWeW2VzjqxXCJsqXuzqPLRc


#Carrossel
*Esta merda é impossivel de ficar direito
    -Link do segundo carrosel:
    https://www.bootply.com/bootstraptor/64680



#About Us
*Falta fazer tudo


#Fotter
*Alterar os pontos da lista com os nomes

#Página Catálog/Agenda

##Calendário
*Fazer com que o rato ao passar pelo calendário não mude
*Arranjar maneira de o calendário não esticar tanto, ir só até uma certa largura

*Antes de filtrar o catálogo ao clicar num dia secalhar pergunta se se o utilizador quer mesmo filtrar o catálogo

*Preencher o calendário automaticamente e dar a opurtunidade de navegar por mais seis meses


##Catálogo
*Por o botão para ver o evento (+) no meio
*Decidir se fica 3 ou 4 por linha
*Melhorar o design dos cards

    * A search bar secalhar devia ser igual à search bar da página Inicial, com aquelas opções todas

*Não sei se é preciso a descrição, pontuação e data precisam de ter a class = "card-text"
*FAzer com que os cards não passem de um certo comprimento, a descrição é o elemento que pode não ser todo apresentado,
esta parte pode ser feita secalhar em javaScript, se a descrição tiver mais de X letras então a parte final são reticencias.
    Fazer uma função para esta merda.

*Adicionar secalhar uma tooltip aos cards


#Página Testemunho dos Estudantes
*Fazer uma modal que possa aparecer em qualquer lugar e uma página só para isto, que vai ter mais opções e vai dar para ler melhor as 
merdas.


#Código....
    * As variáveis indexUtilizadir e logged estão em alguns casos dependentes uma da outra
    * Rever o _id, acho que é para cagar, ou seja, já está

    **Array Eventos, valores:
    *O valor da data e da hora não está benhe, continua na merda, e para "pintar" o calendário
        preciso dessa merda

    -------------------------------------------------------------------------------------------------------------------- 
    -Problema com os objetos e localStorage:

    *O id e o userId também não tão a funcionar, o id = NaN e o userId = undefined, tem a ver com o 

    *Não estou o "erro" que me está a dar ao fazer parse do que está no localstorage

    Nota: Os erros acima deve ter a ver com a cena das variaveis internas dos objetos, por causa da cena do localstorage
        que mesmo fazendo .parse das cenas não me está a dar bem, penso eu de que
    --------------------------------------------------------------------------------------------------------------------

    *Adicionar uma mensagem que confirme se o utilizador quer fechar a modal de registar o evento, porque vai perder os dados que introduziu

    -Calendário no Catálogo:

    *Indicar o mês no calendário pelo JS.
    *Tratar de marcar no calendário os dias com eventos marcados

    -Função diasComEventos():

    *Esta função pode fazer com que os eventos para serem filtrados por dia, sejam guardados num array... SEcalhar não....

    **Ao passar de uma página para outra o botão de login tem que atualizar se para o estado que estava na página anterior, para isto acontecer vai ter que se usar o 
    localstorage para de cada vez que se mudar de página se saber qual era o estado da variavel logged.... penso eu de que 

    *Em principio o código para ter o menu vrtical com três pontos é este:
 
    .navbar.navbar-6 .navbar-toggler-icon {
    background-image: url('https://mdbootstrap.com/img/svg/hamburger8.svg?color=000000'); Dá para mudar a cor em, color=cor a definir, mudei para preto
    }
    *Depois mudar isto de sitio, porque fica mal ao lado do titulo

#Links
    -Link do calendário: 
    https://bootsnipp.com/snippets/featured/even-better-calendar

###############################################################################################################################################################
###############################################################################################################################################################
###############################################################################################################################################################
###############################################################################################################################################################

#Merdas a Fazer Atualizado

##Eventos
   ###Categorias
    - Tratar de fazer com que se possa adicionar várias categorias metendo um espaço entre cada uma delas !Importante **Done**
    - Passar a mostrar as categorias dentro de um ciclo for() !Importante
   ###Nome do Evento
    -Ao alterar um evento, confirmar se o utilizdor alterou também o nome do evento, e caso o tenha feito, 
        confirmar se o mesmo ja não existe.
   ###Gravar Eventos
    -Não esquecer de gravar em localStorage as merdas depois de as alterar

##NavBar
Ao fazer logoff de admin sair da página !Important, dizer que se a página de admin estiver "ativa", ao fazer log-off, então vai para a Home

##Página de Eventos 
   ###Descrição
    - Fazer com que o texto da descrição se adapte ao container  **Done**, falta fazer o mesmo para o carrossel

   ###Inscritos no Evento
    - Não deixar que um utilizador que já esteja inscrito se volte a inscrever, já fiz isto na própria classe 
    Aparentemente está a funcionar - **DONE**

   ###Pontuar
    - Fazer o mesmo que para os inscritos, não deixar pontuar caso já o tenha feito, demasiado trabalho 
    mas dava para fazer com que ao pontuar pela segunda vez, não se acrescentasse à pontuação, mas o score que ele deu
    era alterado 
    - Só vale a pena mostrar a pontuação do evento ao abrir a página quando gravar o array em todos os sitios 
    que preciso - **Done**

##Página Testemunhos (O Mapa não está a funcionar)
   ###Modal Para 'Testemunhar'
    Não deixar escrever mais de X palavras, ainda a decidir

##Perfil Utilizador
   ###Eventos Participados
    - Diferenciar os eventos em que o utilizador está inscrito e os que já participou???



#window.location.replace(url a substituir)


<div class="row mx-auto">

                        <div class="col-md-11">
                            <div class="input-group searchbar-perfil">

                                <div class="input-group-append">
                                    <input id="pesquisarUtilizador" type="text" class="form-control" placeholder="Procurar utilizador">
                                    <button class="btn btn-orange" type="button">
                                        <i class="fa fa-search"></i>
                                    </button>


                                </div>
                                <ul id="Cenas"><li class="1"><a class="1" href="projeto2_Perfil.html">Admin</a></li><li class="3"><a class="3" href="projeto2_Perfil.html">Álvaro</a></li></ul>
                                <!--     -->

                            </div>
                        </div>
                        <div class="col-md-1"></div>
                    </div>
