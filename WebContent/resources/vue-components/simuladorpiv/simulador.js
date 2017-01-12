

/* global _, moment, obj, Vue */

var pivURL = "http://localhost:8080/pivAPI/operador/simulador/";
var pivURL2 = "http://localhost:8080/pivAPI/operador/simulador/change/";
var equipeURL = "http://localhost:8080/pivAPI/operador/simulador/equipes/";
var pivManualURL = "http://localhost:8080/pivAPI/operador/simulador/manual/";
var sessionURL = "/simuladorpiv/session/";

var data =
        {
            equipes: {},
            currentViewForm: 'dados-form',
            show: false,
            vm: {
                piv: {
                    fcr: 0,
                    tma: 0,
                    monitoria: 0,
                    adr: 0,
                    faltas: 0,
                    op: {equipe: ""},
                    "indicadores": [{"realizado": 0.97, "meta": 0.765, "peso": 0.3, "atingimento": 2.0, "pontos": 0.6, "nome": "FCR", "regua": [{"realizado": 0.635, "atingimento": 0.0}, {"realizado": 0.645, "atingimento": 0.3}, {"realizado": 0.655, "atingimento": 0.35}, {"realizado": 0.665, "atingimento": 0.4}, {"realizado": 0.675, "atingimento": 0.45}, {"realizado": 0.685, "atingimento": 0.5}, {"realizado": 0.695, "atingimento": 0.55}, {"realizado": 0.705, "atingimento": 0.6}, {"realizado": 0.715, "atingimento": 0.65}, {"realizado": 0.725, "atingimento": 0.7}, {"realizado": 0.735, "atingimento": 0.75}, {"realizado": 0.745, "atingimento": 0.8}, {"realizado": 0.755, "atingimento": 0.85}, {"realizado": 0.765, "atingimento": 1.0}, {"realizado": 0.775, "atingimento": 1.05}, {"realizado": 0.785, "atingimento": 1.1}, {"realizado": 0.795, "atingimento": 1.2}, {"realizado": 0.805, "atingimento": 1.25}, {"realizado": 0.815, "atingimento": 1.3}, {"realizado": 0.825, "atingimento": 1.5}, {"realizado": 0.835, "atingimento": 2.0}]}, {"realizado": 343.0, "meta": 360.0, "peso": 0.25, "atingimento": 1.0, "pontos": 0.25, "nome": "TMA", "regua": [{"realizado": 120.0, "atingimento": 0.0}, {"realizado": 300.0, "atingimento": 2.0}, {"realizado": 330.0, "atingimento": 1.5}, {"realizado": 360.0, "atingimento": 1.0}, {"realizado": 390.0, "atingimento": 0.7}, {"realizado": 420.0, "atingimento": 0.3}, {"realizado": 1000359.0, "atingimento": 0.0}]}, {"realizado": 0.0, "meta": 0.89, "peso": 0.2, "atingimento": 0.0, "pontos": 0.0, "nome": "MONITORIA", "regua": [{"realizado": 0.84, "atingimento": 0.0}, {"realizado": 0.85, "atingimento": 0.8}, {"realizado": 0.89, "atingimento": 1.0}, {"realizado": 0.92, "atingimento": 1.5}, {"realizado": 0.95, "atingimento": 2.0}]}, {"realizado": 0.9203007518796992, "meta": 0.89, "peso": 0.25, "atingimento": 2.0, "pontos": 0.5, "nome": "ADERENCIA", "regua": [{"realizado": 0.84, "atingimento": 0.0}, {"realizado": 0.85, "atingimento": 0.8}, {"realizado": 0.89, "atingimento": 1.0}, {"realizado": 0.92, "atingimento": 1.5}, {"realizado": 0.95, "atingimento": 2.0}]}],
                    "pontos": 0.0,
                    "pesos": 0.0,
                    "target": 0}
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
        piv: Object
    },
    template: '<indicadores-form v-bind:target="piv.target"></indicadores-form>',
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
            instance.$emit('getMeta');
        }
    },
    data: function() {
        return data;
    }
});

Vue.component('botoes-acao', {
    props: ['show'],
    template: '<div>\n\
                    <button type="button" v-show="show" class="btn btn-default btn-xs" @click="loadIndicadoresAcao()">\n\<span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span> Carregar Indicadores</button>\n\
                    <button type="button" class="btn btn-primary btn-xs" @click="getMetaAcao()"><span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span> Carregar Metas</button>\n\
                </div>',
    methods: {
        getMetaAcao: function() {
            instance.$emit('getMeta');
        },
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


// INDISPONIVEL FORM
Vue.component('indisponivel-form', {
    template: '<div>Funcionalidade indisponível no momento.</div>',
    data: function() {
        return data
    }
})

Vue.component('mensagem-piv', {
    template: '<div class="alert alert-warning small" role="alert">{{texto}}</div>',
    props: {
        texto: {
            type: String,
            default: function() {
                return ""
            }
        }
    },
    data: function() {
        return data
    }
})



var instance = new Vue({
    el: '#piv',
    data: data,
    created: function() {
        var self = this;
        self.loadSession();
    },
    methods: {
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

            // MONITORIA
            var _monitoria = (self.getIndicadorPorNome("MONITORIA", piv.indicadores).realizado) * 100;
            self.vm.monitoria = _monitoria.toFixed(2);


            // ADERENCIA
            var _adr = (self.getIndicadorPorNome("ADERENCIA", piv.indicadores).realizado) * 100;
            if (_adr) {
                self.vm.adr = _adr.toFixed(2);
            }

            // FALTAS
            var _faltas = piv.op.faltas;
            if (_faltas) {
                self.vm.faltas = _faltas;
            } else {
                self.vm.faltas = 0;
            }

            // FCR
            var _fcr = (self.getIndicadorPorNome("FCR", piv.indicadores).realizado) * 100;
            if (_fcr) {
                self.vm.fcr = _fcr.toFixed(2);
            }

            // TMA
            var _tma = secondsToTime(self.getIndicadorPorNome("TMA", piv.indicadores).realizado);
            if (_tma) {
                self.vm.tma = _tma;
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
                _.debounce(function() {
                    var self = this;

                    var simulator =
                            {"s": {
                                    "fcr": {realizado: (self.vm.fcr / 100)},
                                    "adr": {realizado: (self.vm.adr / 100)},
                                    "tma": {realizado: moment.duration(self.vm.tma, "HH:mm:ss").asSeconds()},
                                    "monitoria": {realizado: (self.vm.monitoria / 100)},
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
                            self.vm.piv = data.calculoPivFacade;
                        }
                    });
                }, 1000)
    }
});





// Events
instance.$on('loadIndicadores', function() {
    this.loadIndicadores();
});

instance.$on('getMeta', function() {
    this.getMeta();
    this.getTarget();
});

instance.$on('setIndicadores', function(ind) {
    this.setIndicadores(ind);
});

instance.$on('getTarget', function() {
    this.getTarget();
});




