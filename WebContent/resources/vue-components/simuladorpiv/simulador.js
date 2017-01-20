

/* global _, moment, obj, Vue */

Vue.config.devtools = true
Vue.config.silent = true;

// DATA SOURCES
var pivURL = "http://localhost:8080/pivAPI/operador/simulador/";
var pivURL2 = "http://localhost:8080/pivAPI/operador/simulador/change/";
var equipeURL = "http://localhost:8080/pivAPI/operador/simulador/equipes/";
var sessionURL = "/simuladorpiv/session/";

//
//var Regua = function(json) {
//    if (json) {
//        this.linhas = [];
//
//        for (var i in json) {
//            this.linhas.push(new LinhaRegua(json[i]));
//        }
//
//
//    }
//}
//
//var LinhaRegua = function(json) {
//    if (json) {
//        this.atingimento = json.atingimento;
//        this.realizado = json.realizado;
//    }
//};
//
//LinhaRegua.prototype.getRealizadoFormat = function() {
//
//    if (this.nome === 'TMA') {
//        return secondsToTime(this.realizado);
//    } else {
//        return (this.realizado * 100).toFixed(1);
//    }
//
//
//};
//LinhaRegua.prototype.getAtingimentoFormat = function() {
//
//    if (this.nome === 'TMA') {
//        return (this.atingimento * 100).toFixed(0);
//    } else {
//        return this.atingimento + "%";
//    }
//
//};



// CLASSES
var Indicador = function(json) {
    if (json) {

        this.nome = json.nome;

        if (json.realizado || json.realizado === 0) {

            // TMA
            if (this.nome !== 'TMA') {
                this.realizado = Number((json.realizado * 100).toFixed(2));
                this.meta = json.meta * 100;
            } else {
                this.realizado = secondsToTime(json.realizado);
                this.meta = secondsToTime(json.meta);
            }

            this.atingimento = json.atingimento;
            //
            this.peso = json.peso;

            if (json.regua) {
                this.regua = json.regua;
                this.procReguaMeta();
            }

        } else {

            if (this.nome !== 'TMA') {
                this.realizado = 0;
            } else {
                this.realizado = "00:00:00";
            }

        }

    } else {
        this.realizado = 0;
    }



};

// METHODS
Indicador.prototype.metaToRealizado = function() {
    this.realizado = this.meta;
    this.atingimento = 1;
};
Indicador.prototype.procReguaMeta = function() {
    var _list = this.regua;

    var i = 0;

    for (var r in _list) {
        if (Number(_list[r].atingimento) === Number(this.atingimento)) {
            // TRATATIVA PARA NÃO COLORIR MAIS DE UMA LINHA
            if (this.nome === "TMA") {
                if (this.getRealizado() > 120) {
                    i++;
                }
                if (i == 2) {
                    _list[r].flagged = true;
                }

            } else {
                _list[r].flagged = true;
                return;
            }

        } else {
            _list[r].flagged = false;
        }
    }
};
Indicador.prototype.getRealizado = function() {
    if (!this.realizado) {
        return 0;
    }

    if (this.nome !== 'TMA') {
        return (this.realizado * 0.01).toFixed(5);
    } else {
        return moment.duration(this.realizado, "HH:mm:ss").asSeconds();
    }
};


// DATA
var data = {
    equipes: {},
    currentViewForm: 'dados-form',
    show: false,
    meta: {
        fcr: new Indicador({"nome": "FCR"}),
        tma: new Indicador({"nome": "TMA"}),
        monitoria: new Indicador({"nome": "MONITORIA"}),
        adr: new Indicador({"nome": "ADERENCIA"}),
        faltas: 0,
        target: 0,
        mensagens: []
    },
    simulador: {
        fcr: new Indicador({"nome": "FCR"}),
        tma: new Indicador({"nome": "TMA"}),
        monitoria: new Indicador({"nome": "MONITORIA"}),
        adr: new Indicador({"nome": "ADERENCIA"}),
        faltas: 0,
        target: 0,
        mensagens: []
    },
    vm: {
        fcr: new Indicador({"nome": "FCR"}),
        tma: new Indicador({"nome": "TMA"}),
        monitoria: new Indicador({"nome": "MONITORIA"}),
        adr: new Indicador({"nome": "ADERENCIA"}),
        faltas: 0,
        mensagens: [],
        piv: {
            "op": {
                "loginOperador": "",
                "nome": "",
                "nomeSupervisor": "",
                "equipe": "",
                "faltas": 0
            },
            "mensagens": [],
            "pontos": 1.35,
            "pesos": 1,
            "target": 0
        }
    }
};


// FUNCTIONS
function secondsToTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var seconds = Math.floor(seconds % 60);
    return (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);
}

// COMPONENTS
Vue.component('simulador-form', {
    props: {
        vm: Object
    },
    computed: {
        exibir: function() {
            return data.currentViewForm === 'dados-form';
        }
    },
    template: '<div v-show="vm.piv.op.equipe">\n\
                    <indicadores-form header="Meta" show="true" disabled="true" v-bind:fcr="meta.fcr" v-bind:adr="meta.adr" v-bind:monitoria="meta.monitoria" v-bind:tma="meta.tma" v-bind:faltas="meta.faltas" v-bind:target="meta.target"></indicadores-form>\n\
                    <indicadores-form header="Realizado" show-regua="true"  v-bind:mensagens="vm.piv.mensagens" disabled="true" v-bind:show="exibir" v-bind:fcr="vm.fcr" v-bind:adr="vm.adr" v-bind:monitoria="vm.monitoria" v-bind:tma="vm.tma" v-bind:faltas="vm.faltas" v-bind:target="vm.piv.target"></indicadores-form>\n\
                    <indicadores-form header="Simulador" show-botoes="true" v-bind:mensagens="simulador.mensagens" show="true" v-bind:fcr="simulador.fcr" v-bind:adr="simulador.adr" v-bind:monitoria="simulador.monitoria" v-bind:tma="simulador.tma" v-bind:faltas="simulador.faltas" v-bind:target="simulador.target"></indicadores-form>\n\
                \n\
                <!-- <h4>VM: </h4> {{vm}}\n\
    <h4>SIMULADOR: </h4> {{simulador}}\n\
    <h4>META: </h4> {{meta}}--></div>',
    data: function() {
        return data;
    }
});
Vue.component('indicadores-form', {
    props: {
        header: {
            type: String,
            default: function() {
                return "Indicadores";
            }
        },
        showRegua: {
            type: Boolean,
            default: function() {
                return false;
            }

        },
        show: {
            type: Boolean,
            default: function() {
                return false;
            }

        },
        showBotoes: {
            type: Boolean,
            default: function() {
                return false;
            }

        },
        disabled: {
            type: Boolean,
            default: function() {
                return false;
            }

        },
        target: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        fcr: {
            type: Indicador,
            default: function() {
                return 0;
            },
        },
        adr: {
            type: Indicador
        },
        monitoria: {
            type: Indicador
        },
        tma: {
            type: Indicador
        },
        faltas: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        mensagens: {
            type: Array
        }
    },
    computed: {
        normalizedTarget: function() {
            var _target = this.target * 100;
            _target = _target.toFixed(1);
            return _target;
        }
    },
    methods: {
        getTarget: function() {
            var self = this;

            if (!this.faltas) {
                this.faltas = 0;
            }

            var simulator = {"s": {
                    "fcr": {realizado: this.fcr.getRealizado()},
                    "adr": {realizado: this.adr.getRealizado()},
                    "tma": {realizado: this.tma.getRealizado()},
                    "monitoria": {realizado: this.monitoria.getRealizado()},
                    "faltas": this.faltas,
                    op: self.vm.piv.op}
            };

            $.ajax({
                type: "POST",
                data: JSON.stringify(simulator),
                url: pivURL2,
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                error: function() {
                    self.currentViewForm = 'indisponivel-form';
                },
                success: function(data) {
                    self.simulador.target = data.calculoPivFacade.target;
                    self.simulador.faltas = self.faltas;
                    self.simulador.mensagens = data.calculoPivFacade.mensagens;
                }
            });

        }
    },
    template: '#indicadores-form',
    data: function() {
        return data;
    }
});
Vue.component('tabela-meta', {
    props: ['meta'],
    template: '#tabela-meta',
    data: function() {
        return data;
    }
});
Vue.component('tabela-regua', {
    props: {
        indicador: {
            type: Indicador
        }
    },
    template: '#tabela-regua',
    methods: {
        secondsToTime: function(seconds) {
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            var seconds = Math.floor(seconds % 60);
            return (hours < 10 ? "0" + hours : hours) + ":" +
                    (minutes < 10 ? "0" + minutes : minutes) + ":" +
                    (seconds < 10 ? "0" + seconds : seconds);
        }
    },
    data: function() {
        return data;
    }
});
Vue.component('celula-form', {
    template: '#celula-form',
    methods: {
        getTarget: function() {
            instance.$emit('getTarget');
        }
    },
    data: function() {
        return data;
    }
});
Vue.component('botoes-acao', {
    props: ['show', 'option', 'dados'],
    template: '<div v-show="show">\
                    <button type="button" v-show="dados" class="btn btn-default btn-xs" @click="getRealizado()">\n\<span class="glyphicon glyphicon-circle-arrow-down" aria-hidden="true"></span> Carregar Indicadores</button>\n\
                    <button type="button" class="btn btn-primary btn-xs" @click="getMeta()"><span class="glyphicon glyphicon-circle-arrow-down" aria-hidden="true"></span> Carregar Metas</button>\n\
                </div>',
    methods: {
        getMeta: _.debounce(function() {
            data.simulador = data.meta;
        }, 1000),
        getRealizado: _.debounce(function() {
            data.simulador = data.vm;
            data.simulador.target = data.vm.piv.target;
        }, 1000),
    }
});
Vue.component('dados-form', {
    template: '#dados-form',
    props: {
        op: Object
    },
    data: function() {
        return data;
    }
});
Vue.component('indisponivel-form', {
    template: '<div>Funcionalidade indisponível no momento.</div>',
    data: function() {
        return data;
    }
});
Vue.component('mensagem-piv', {
    template: '<div class="alert alert-warning small" role="alert">{{texto}}</div>',
    props: {
        texto: {
            type: String,
            default: function() {
                return "";
            }
        }
    },
    data: function() {
        return data;
    }
});

var instance = new Vue({
    el: '#piv',
    data: data,
    created: function() {
        var self = this;
        self.loadSession();
    },
    methods: {
        secondsToTime: function(seconds) {
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            var seconds = Math.floor(seconds % 60);
            return (hours < 10 ? "0" + hours : hours) + ":" +
                    (minutes < 10 ? "0" + minutes : minutes) + ":" +
                    (seconds < 10 ? "0" + seconds : seconds);
        },
        loadSession: function() {
            var self = this;
            $.ajax({
                type: "GET",
                dataType: "json",
                url: sessionURL,
                success: function(data) {
                    if (data.usuario) {
                        self.usuario = data.usuario;
                    } else {
                        location.reload();
                    }
                },
                complete: function() {
                    self.loadIndicadores();
                }
            });
        },
        getEquipes: function() {
            var self = this;
            $.ajax({
                type: "GET",
                dataType: "json",
                url: equipeURL,
                success: function(data) {
                    self.equipes = _.orderBy(data.list, ['equipe'], ['asc']);
                }
            });
        },
        setIndicadores: function(piv) {
            var self = this;
            self.vm.piv = piv;

            // Fixa target da Meta
            self.meta.target = 0.25;

            var _list = piv.indicadores;

            for (var ind in _list) {

                var _realizado = new Indicador(_list[ind]);
                var _meta = new Indicador(_list[ind]);

                _meta.metaToRealizado();

                if (_list[ind]) {

                    if (_list[ind].nome === 'FCR') {
                        self.vm.fcr = _realizado;
                        self.meta.fcr = _meta;
                    }

                    if (_list[ind].nome === 'MONITORIA') {
                        self.vm.monitoria = _realizado;
                        self.meta.monitoria = _meta;
                    }

                    if (_list[ind].nome === 'ADERENCIA') {
                        self.vm.adr = _realizado;
                        self.meta.adr = _meta;
                    }

                    if (_list[ind].nome === 'TMA') {
                        self.vm.tma = _realizado;
                        self.meta.tma = _meta;
                    }
                }
            }

            // FALTAS
            var _faltas = piv.op.faltas;
            if (_faltas) {
                self.vm.faltas = _faltas;
                self.meta.faltas = 0;
            }

        },
        loadIndicadores: function() {
            var self = this;
            $.ajax({
                type: "GET",
                dataType: "json",
                url: pivURL + self.usuario.login,
                success: function(data) {

                    var _piv = data.calculoPivFacade;
                    if (_piv) {
                        self.setIndicadores(_piv);
                    } else {
                        self.currentViewForm = 'celula-form';
                        self.getEquipes();
                    }
                },
                error: function() {
                    self.currentViewForm = 'indisponivel-form';
                },
                complete: function() {
                    self.show = true;
                }
            });
        },
        getTarget: function() {
            var self = this;
            var simulator = {"s": {
                    "fcr": {realizado: self.vm.fcr.getRealizado()},
                    "adr": {realizado: self.vm.adr.getRealizado()},
                    "tma": {realizado: self.vm.tma.getRealizado()},
                    "monitoria": {realizado: self.vm.monitoria.getRealizado()},
                    "faltas": self.vm.faltas,
                    op: self.vm.piv.op}
            };

            $.ajax({
                type: "POST",
                data: JSON.stringify(simulator),
                url: pivURL2,
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Content-Type", "application/json");
                },
                error: function() {
                    self.currentViewForm = 'indisponivel-form';
                },
                success: function(data) {
                    self.setIndicadores(data.calculoPivFacade)
                }
            });
        }
    }
});

// Events
instance.$on('loadIndicadores', function() {
    this.loadIndicadores();
});
instance.$on('setIndicadores', function(ind) {
    this.setIndicadores(ind);
});
instance.$on('getTarget', function() {
    this.getTarget();
});
instance.$on('getIndicadorPorNome', function(nome) {
    return this.getIndicadorPorNome(nome, this.vm.piv.indicadores)
});

// HTML TO POPOVER
$("[data-toggle=popover]").popover({
    html: true,
    content: function() {
        return $(this).children(".conteudoPopOver").html();
    }
});



