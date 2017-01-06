// URL - REST Controllers

var abaURL = "/comunicacao/aba/listAtivos";


var data = {
    abas: [
        {
            titulo: 'String',
            subAbas: [{"titulo":'oi'}, {"titulo":'tchau'}]
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
                            <a href="#">{{sub.titulo}}</a>\n\
                    </li>\n\
                </ul></li>',
    data: function () {
        return data;
    }
}
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
            $.get(abaURL, function(data) {
                self.abas = data.list;
                console.log(data.list);
                console.log(self.abas);
            })
        }
    }
})