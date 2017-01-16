

/* global _, moment, obj, Vue */

var pivURL = "http://localhost:8080/pivAPI/operador/simulador/";
var pivURL2 = "http://localhost:8080/pivAPI/operador/simulador/change/";
var equipeURL = "http://localhost:8080/pivAPI/operador/simulador/equipes/";
var pivManualURL = "http://localhost:8080/pivAPI/operador/simulador/manual/";
var sessionURL = "/simuladorpiv/session/";
// CLASSES
var Indicador = function(json) {
    if (json) {
        //
        this.nome = json.nome;
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

        console.log(json.regua)

        this.regua = json.regua;

    } else {
        this.realizado = 0;
    }
};
Indicador.prototype.metaToRealizado = function()
{
    this.meta = this.realizado;
};
Indicador.prototype.getRealizado = function() {
    if (this.nome != 'TMA') {
        return (this.realizado * 0.01).toFixed(5);
    } else {
        return moment.duration(this.realizado, "HH:mm:ss").asSeconds();
    }
}


var data = {
    equipes: {},
    currentViewForm: 'dados-form',
    show: false,
    vm: {
        fcr: new Indicador(),
        tma: new Indicador(),
        monitoria: new Indicador(),
        adr: new Indicador(),
        faltas: 0,
        piv: {
            "op": {
                "loginOperador": "",
                "nome": "",
                "nomeSupervisor": "",
                "equipe": "",
                "faltas": 0
            },
            "indicadores": [
                new Indicador({
                    "realizado": 0.97,
                    "meta": 0,
                    "peso": 0,
                    "atingimento": 2,
                    "pontos": 0.6,
                    "nome": "FCR",
                    "regua": []
                }),
                new Indicador({
                    "realizado": 343,
                    "meta": 360,
                    "peso": 0.25,
                    "atingimento": 1,
                    "pontos": 0.25,
                    "nome": "TMA",
                    "regua": []
                }),
                new Indicador({
                    "realizado": 0,
                    "meta": 0.89,
                    "peso": 0.2,
                    "atingimento": 0,
                    "pontos": 0,
                    "nome": "MONITORIA",
                    "regua": []
                }),
                new Indicador({
                    "realizado": 0.9203007518796992,
                    "meta": 0.89,
                    "peso": 0.25,
                    "atingimento": 2,
                    "pontos": 0.5,
                    "nome": "ADERENCIA",
                    "regua": []
                }
                )],
            "mensagens": [],
            "pontos": 1.35,
            "pesos": 1,
            "target": 0
        }
    }
};

Vue.config.silent = true;

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
        piv: Object
    },
    template: '<indicadores-form v-bind:target="piv.target"></indicadores-form>',
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
    props: ['regua', 'indicador', 'atingimento'],
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
Vue.component('indicadores-form', {
    props: {
        target: {
            type: Number,
            default: function() {
                return 0;
            }
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
            instance.$emit('getTarget');
        },
        getIndicador: function(nome) {
            var self = this;
            var _ind = self.vm.piv.indicadores;
            for (i = 0; i < _ind.length; i++) {
                if (_ind[i].nome === nome) {
                    return _ind[i];
                }
            }
        }
    },
    template: '#indicadores-form',
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
    props: ['show'],
    template: '<div><br>\n\
                    <button type="button" v-show="show" class="btn btn-default btn-xs" @click="loadIndicadoresAcao()">\n\<span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span> Carregar Indicadores</button>\n\
                    <button type="button" v-show="!show" class="btn btn-primary btn-xs" @click="getMetaAcao()"><span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span> Carregar Metas</button>\n\
                </div>',
    methods: {
        getMetaAcao: _.debounce(function() {
            instance.$emit('getMeta');
            instance.$emit('getTarget');

        }, 1000),
        loadIndicadoresAcao: function() {
            instance.$emit('loadIndicadores');
        }
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
        getIndicadorPorNome: function(nome, inds) {
            for (i = 0; i < inds.length; i++) {
                if (inds[i].nome === nome) {
                    return inds[i];
                }
            }
        },
        getMeta: function() {
            var self = this;
            _metaPiv = self.vm.piv;
            for (i = 0; i < _metaPiv.indicadores.length; i++) {
                _metaPiv.indicadores[i].realizado = _metaPiv.indicadores[i].meta;
            }
            _metaPiv.op.faltas = 0;
            self.setIndicadores(_metaPiv);
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
            // FCR
            var _fcr = new Indicador(self.getIndicadorPorNome("FCR", piv.indicadores));
            if (_fcr) {
                self.vm.fcr = _fcr;
            } else {
                self.vm.fcr.realizado = 0;
                self.vm.fcr.meta = "Falha ao carregar";
            }

            // MONITORIA
            var _monitoria = new Indicador(self.getIndicadorPorNome("MONITORIA", piv.indicadores));
            if (_monitoria) {
                self.vm.monitoria = _monitoria;
            } else {
                self.vm.monitoria.realizado = 0;
                self.vm.monitoria.meta = "Falha ao carregar";
            }

            // ADERENCIA
            var _adr = new Indicador(self.getIndicadorPorNome("ADERENCIA", piv.indicadores));
            if (_adr) {
                self.vm.adr = _adr;
            } else {
                self.vm.adr.realizado = 0;
                self.vm.adr.meta = "Falha ao carregar";
            }

            // TMA
            var _tma = new Indicador(self.getIndicadorPorNome("TMA", piv.indicadores));
            if (_tma) {
                self.vm.tma = _tma;
            } else {
                self.vm.tma.realizado = "00:00:00";
                self.vm.tma.meta = "Falha ao carregar";
            }


            // FALTAS
            var _faltas = piv.op.faltas;
            if (_faltas) {
                self.vm.faltas = _faltas;
            } else {
                self.vm.faltas = 0;
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
        getTarget:
                function() {
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
instance.$on('getMeta', function() {
    instance.getMeta();
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



