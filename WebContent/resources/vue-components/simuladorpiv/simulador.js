

/* global _, moment, obj, Vue */


// DATA SOURCES
var pivURL = "http://localhost:8080/pivAPI/operador/simulador/";
var pivURL2 = "http://localhost:8080/pivAPI/operador/simulador/change/";
var equipeURL = "http://localhost:8080/pivAPI/operador/simulador/equipes/";
var sessionURL = "/simuladorpiv/session/";


// CLASSES
var Indicador = function(json) {
    if (json) {
        //
        this.nome = json.nome;

        if (json.realizado) {
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
            this.regua = json.regua;

        } else {
            this.realizado = 0;
        }

    } else {
        this.realizado = 0;
    }
};

// METHODS
Indicador.prototype.metaToRealizado = function()
{
    this.realizado = this.meta;
};
Indicador.prototype.getRealizado = function() {
    if (this.nome !== 'TMA') {
        return (this.realizado * 0.01).toFixed(5);
    } else {
        return moment.duration(this.realizado, "HH:mm:ss").asSeconds();
    }
}


// DATA
var data = {
    equipes: {},
    currentViewForm: 'dados-form',
    show: false,
    meta: {
        fcr: new Indicador(),
        tma: new Indicador(),
        monitoria: new Indicador(),
        adr: new Indicador(),
        faltas: 0,
        target: 0
    },
    simulador: {
        fcr: new Indicador({"nome": "FCR"}),
        tma: new Indicador({"nome": "TMA"}),
        monitoria: new Indicador({"nome": "MONITORIA"}),
        adr: new Indicador({"nome": "ADERENCIA"}),
        faltas: 0,
        target: 0
    },
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
            "indicadores":
                    [
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
        vm: Object
    },
    computed: {
        exibir: function() {
            return data.currentViewForm === 'dados-form';
        }
    },
    template: '<div v-show="vm.piv.op.equipe">\n\
                    <indicadores-form header="Meta" show="true" disabled="true" v-bind:fcr="meta.fcr" v-bind:adr="meta.adr"v-bind:monitoria="meta.monitoria" v-bind:tma="meta.tma" v-bind:faltas="meta.faltas" v-bind:target="meta.target"></indicadores-form>\n\
                    <indicadores-form header="Realizado" disabled="true" v-bind:show="exibir" v-bind:fcr="vm.fcr" v-bind:adr="vm.adr" v-bind:monitoria="vm.monitoria" v-bind:tma="vm.tma" v-bind:faltas="vm.faltas" v-bind:target="vm.piv.target"></indicadores-form>\n\
                    <indicadores-form header="Simulador" show="true" v-bind:fcr="simulador.fcr" v-bind:adr="simulador.adr" v-bind:monitoria="simulador.monitoria" v-bind:tma="simulador.tma" v-bind:faltas="simulador.faltas" v-bind:target="simulador.target"></indicadores-form>\n\
                \n\
                <h4>Homologação: </h4> {{simulador}}</div>',
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
        show: {
            type: Boolean,
            default: function() {
                return false;
            }

        },
        showBotoesAcao: {
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
            type: Indicador
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
            type: String
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
    props: ['show', 'option'],
    template: '<div v-show="show">\
                    <button type="button"  v-show="option" class="btn btn-default btn-xs" @click="loadIndicadoresAcao()">\n\<span class="glyphicon glyphicon-circle-arrow-down" aria-hidden="true"></span> Carregar Indicadores</button>\n\
                    <button type="button"  v-show="!option" class="btn btn-primary btn-xs" @click="getMetaAcao()"><span class="glyphicon glyphicon-circle-arrow-down" aria-hidden="true"></span> Carregar Metas</button>\n\
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
            var _fcr = self.getIndicadorPorNome("FCR", piv.indicadores);
            var _fcrRealizado = new Indicador(_fcr);
            var _fcrMeta = new Indicador(_fcr);
            _fcrMeta.metaToRealizado();
            if (_fcr) {
                self.vm.fcr = _fcrRealizado;
                self.meta.fcr = _fcrMeta;
            }

            // MONITORIA
            var _monitoria = self.getIndicadorPorNome("MONITORIA", piv.indicadores);
            var _monitoriaRealizado = new Indicador(_monitoria);
            var _monitoriaMeta = new Indicador(_monitoria);
            _monitoriaMeta.metaToRealizado();
            if (_monitoria) {
                self.vm.monitoria = _monitoriaRealizado;
                self.meta.monitoria = _monitoriaMeta;
            }

            // ADERENCIA
            var _adr = self.getIndicadorPorNome("ADERENCIA", piv.indicadores);
            var _adrRealizado = new Indicador(_adr);
            var _adrMeta = new Indicador(_adr);
            _adrMeta.metaToRealizado();
            if (_adr) {
                self.vm.adr = _adrRealizado;
                self.meta.adr = _adrMeta;
            }
            // TMA
            var _tma = self.getIndicadorPorNome("TMA", piv.indicadores);
            var _tmaRealizado = new Indicador(_tma);
            var _tmaMeta = new Indicador(_tma);
            _tmaMeta.metaToRealizado();
            if (_tma) {
                self.vm.tma = _tmaRealizado;
                self.meta.tma = _tmaMeta;
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
        },
        calculaTarget: function(h) {
            var self = this;

            var simulator = {"s": {
                    "fcr": {realizado: h.fcr.getRealizado()},
                    "adr": {realizado: h.adr.getRealizado()},
                    "tma": {realizado: h.tma.getRealizado()},
                    "monitoria": {realizado: h.monitoria.getRealizado()},
                    "faltas": h.faltas,
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
                    console.log(data);
                    h.target = data.calculoPivFacade.target;
                    return h;
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



