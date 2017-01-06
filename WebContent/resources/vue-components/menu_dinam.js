// URL - REST Controllers

var abaAtivosURL = "/comunicacao/aba/listAtivos/";
var leLink = "/comunicacao/conteudo/list/";

var data = {
    abas: [
        {
            titulo: 'String',
            subAbas: [{"titulo":'oi', conteudo:{id:3}}, {"titulo":'tchau', conteudo:{id:3}}]
        }
    ]};

var leabas = {
    props: [
        'titulo',
        'subAbas'
    ],
    template: '<li class="dropdown">\n\
                <a href="#"  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">\n\
                    {{titulo}}\n\
                    <span class="caret"></span>\n\
                </a>\n\
                <ul class="dropdown-menu">\n\
                    <li v-for="sub in subAbas">\n\
                            <a v-bind:idzin="sub.conteudo.id" href="#" class="subabadinam">{{sub.titulo}}</a>\n\
                    </li>\n\
                </ul></li>',
    data: function () {
        return data;
    }
}
$(document).ready(function(){
    $(".subabadinam").click(function(){
        var leId = $(this).attr('idzin');
        window.location.replace(leLink+leId);
    });    
})

new Vue({
    el: "#menu-dinam",
    components: {'leabas': leabas},
    data: data,
    created: function () {
        var self = this;
        self.getMenu();
    },
    methods: {
        getMenu: function () {
            var self = this;
            $.get(abaAtivosURL, function(data) {
                self.abas = data.list;
            })
        }
    }
})