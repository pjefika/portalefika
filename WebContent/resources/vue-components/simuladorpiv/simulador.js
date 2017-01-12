

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
                    "indicadores": {},
                    "pontos": 0.0,
                    "pesos": 0.0,
                    "target": 0}
            }
        };


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
    data: function() {
        return data;
    },
    methods: {
        getTarget: function() {
            instance.$emit('getTarget');
        }
    }
});

Vue.component('botoes-acao', {
    template: '<div>\n\
                    <button type="button" class="btn btn-default btn-xs" @click="loadIndicadoresAcao()">\n\<span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span> Carregar Indicadores</button>\n\
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
            console.log(self.vm.monitoria)

            // FALTAS
            var _faltas = piv.op.faltas;
            if (_faltas) {
                self.vm.faltas = _faltas;
            } else {
                self.vm.faltas = 0;
            }

            // FCR
            var _fcr = self.getIndicadorPorNome("FCR", piv.indicadores).realizado * 100;
            if (_fcr) {
                self.vm.fcr = _fcr.toFixed(2);
            }

            // TMA
            var _tma = moment("1900-01-01 00:00:00").add(self.getIndicadorPorNome("TMA", piv.indicadores).realizado, 'seconds').format("HH:mm:ss");
            if (_tma) {
                self.vm.tma = _tma;
            }

            // ADERENCIA
            var _adr = (self.getIndicadorPorNome("ADERENCIA", piv.indicadores).realizado * 100);
            if (_adr) {
                self.vm.adr = _adr.toFixed(2);
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
                        self.vm.tma = moment("1900-01-01 00:00:00").add(100, 'seconds').format("HH:mm:ss");
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
                    var _monitoria = self.vm.monitoria / 100;
                    if (!_monitoria) {
                        _monitoria = 0;
                    }

                    var simulator =
                            {"s": {
                                    "fcr": {realizado: (self.vm.fcr / 100)},
                                    "adr": {realizado: (self.vm.adr / 100)},
                                    "tma": {realizado: moment.duration(self.vm.tma, "HH:mm:ss").asSeconds()},
                                    "monitoria": {realizado: _monitoria},
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
    console.log("loadIndicadores");
    this.loadIndicadores();
});

instance.$on('getMeta', function() {
    console.log("getMeta");
    this.getMeta();
    this.getTarget();
});

instance.$on('setIndicadores', function(ind) {
    this.setIndicadores(ind);
});

instance.$on('getTarget', function() {
    this.getTarget();
});




