/**
 * Componente do Editor
 * @author G0042204
 * @example jsp/editor/create.jsp
 */


// URL - REST Controllers
var abaURL = "/comunicacao/aba/";
var subAbaURL = "/comunicacao/subAba/";
var conteudoURL = "/comunicacao/conteudo/";

var alert = new Vue({
    el: '#valert',
    template: '<div class="alert alert-danger" v-show="ativo" role="alert">\
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n\
                    <span aria-hidden="true">&times;</span>\n\
                    </button><strong>{{premsg}}</strong> {{ mensagem }}</div>',
    data: {
        ativo: false,
        premsg: "Erro!",
        mensagem: "Mensagem de Teste."
    },
    methods: {
        error: function(msg) {
            this.ativo = false;
            this.ativo = true;
            this.premsg = "Erro!"
            this.mensagem = msg
        },
        success: function(msg) {
            this.premsg = "Sucesso!"
            this.mensagem = msg
        },
        limpar: function() {
            this.ativo = false
            this.erro = false;
            this.mensagem = "";
        }
    },
})

// Instancia
var dev = new Vue({
    el: '#editor',
    data: {
        abas: null,
        // aba
        editedAba: null,
        activedAba: null,
        deletedAba: null,
        // subAbas
        editedSubAba: null,
        activedSubAba: {conteudo: {id: null}},
        deletedSubAba: null,
        // conteudo
        editedConteudo: null,
        activedConteudo: null,
        deletedConteudo: null,
        checkedconteudo: false,
        conteudos: null
    },
    components: {},
    created: function() {
        this.getAbas();
        this.getConteudos();
    },
    methods: {
        clearVars: function() {
            var self = this;
            self.activedAba_ = null;
            self.editedAba = null;
            self.deletedAba = null;
            self.editedSubAba = null;
            self.activedSubAba = {conteudo: {id: null}}
            self.deletedSubAba = null;
            self.editedConteudo = null;
            self.activedConteudo = null;
            self.deletedConteudo = null;
        },
        getConteudos: function() {
            var self = this;
            $.get(conteudoURL + "lista", function(data) {
                self.conteudos = data.list;
            });
        },
        getAbas: function() {
            var self = this;
            $.get(abaURL, function(data) {
                self.abas = data.list;
            })
        },
        fetchData: function() {
            var self = this;
            setTimeout(function() {
                self.getAbas()
            }, 600)
        },
        // Aba:
        novaAba: function() {
            var self = this;
            var _novaAba = {"abaPortal": {"titulo": "Nova Aba", "ativo": false}};
            self.adicionarAba(_novaAba);
        },
        editAba: function(h) {
            var self = this
            self.editedAba = h
        },
        clickDeleteAba: function(h) {
            var self = this
            self.deletedAba = h
        },
        doneDeleteAba: function() {
            var self = this

            if (!self.deletedAba) {
                return;
            }

            $.ajax({
                type: "POST",
                url: abaURL + "delete",
                data: JSON.stringify(self.deletedAba),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function(json) {
                    $('#modalAba').modal('hide');
                }
            });
            self.clearVars()
            self.fetchData()

        },
        selectAba: function(h) {
            var self = this
            self.buscaAbaPorId(h)
        },
        doneEditAba: function(h) {
            var self = this;
            if (!h.titulo) {
                self.fetchData()
                return;
            }

            self.updateAba(h)
            self.clearVars()
        },
        // Aba
        adicionarAba: function(h) {
            var self = this;
            $.ajax({
                type: "POST",
                url: abaURL,
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function(data) {
                    self.abas.push(data.abaPortal)
                    self.fetchData()
                }
            });
        },
        updateAba: function(h) {
            var self = this

            if (!h.titulo) {
                self.fetchData()
                return;
            }

            $.ajax({
                type: "POST",
                url: abaURL + "update",
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function() {
                    self.fetchData()
                }
            });
        },
        // SubAba
        novaSubAba: function() {
            var self = this;
            
            var _novaSubAba = {"subAbaPortal": {"titulo": "Nova SubAba",
                    "ativo": false,
                    "abaPortal": self.activedAba,
                    "conteudo": {
                        id: 7
                    }
                }};

            self.adicionarSubAba(_novaSubAba);
        },
        editSubAba: function(h) {
            var self = this
            self.editedSubAba = h;
        },
        doneEditSubAba: function(h) {
            var self = this;
            if (!h.titulo) {
                self.fetchData()
                return;
            }
            self.updateSubAba(h)

            setTimeout(function() {
                self.selectAba(h.abaPortal);
            }, 400)

        },
        clickDeleteSubAba: function(h) {
            var self = this
            self.deletedSubAba = h;
        },
        doneDeleteSubAba: function() {
            var self = this

            if (!self.deletedSubAba) {
                return;
            }

            var aba = self.activedAba;
            self.deleteSubAba(self.deletedSubAba)

            self.fetchData()

            setTimeout(function() {
                self.selectAba(aba);
            }, 400)
        },
        adicionarSubAba: function(h) {
            var self = this;
            $.ajax({
                type: "POST",
                url: subAbaURL,
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function(data) {
                    console.log(data)

                    if (data.persistenciaException) {
                        alert.error("Teste");
                        return;
                    } else {
                        self.activedAba.subAbas.push(data.subAbaPortal)
                        self.fetchData()
                    }

                }
            });
        },
        deleteSubAba: function(h) {
            $.ajax({
                type: "POST",
                url: subAbaURL + "delete",
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function() {
                    $('#modalAba').modal('hide');
                    self.activedAba.subAbas.pop(h)
                    self.fetchData()
                }
            });
        },
        updateSubAba: function(h) {
            var self = this

            // Resolver Circularidade nos Objetos
            self.activedAba.subAbas = null;
            h.abaPortal = self.activedAba;
            if (!h.titulo) {
                return;
            }

            $.ajax({
                type: "POST",
                url: subAbaURL + "update",
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function() {
                    self.fetchData()
                }
            });
        },
        selectSubAba: function(h) {
            var self = this
            self.buscaSubAbaPorId(h)
        },
        // Conteúdo
        clickConteudo: function(h) {
            var self = this
            self.editedConteudo = h
            self.buscaConteudoPorId(h)

        },
        novaConteudo: function() {
            var self = this;
            var _novoConteudo = {"conteudo": {"titulo": "Novo Conte�do", "ativo": false}};
            self.adicionarConteudo(_novoConteudo);
        },
        editConteudo: function(h) {
            var self = this
            self.editedSubAba = h;
        },
        doneEditConteudo: function(h) {
            var self = this;
            if (!h.titulo) {
                self.fetchData()
                return;
            }

            self.updateConteudo(h)

            self.fetchData()

            setTimeout(function() {
                self.selectSubAba(h.subAbaPortal)
            }, 400)

        },
        clickDeleteConteudo: function(h) {
            var self = this
            self.deletedConteudo = h;
        },
        doneDeleteConteudo: function() {
            var self = this

            if (!self.deletedConteudo) {
                return;
            }

            var subAba = self.activedSubAba;
            self.deleteConteudo(self.deletedConteudo)

            self.fetchData()

            setTimeout(function() {
                self.selectSubAba(subAba);
            }, 400)
        },
        adicionarConteudo: function(h) {
            var self = this;
            h.conteudo.subAbaPortal = self.activedSubAba;
            $.ajax({
                type: "POST",
                url: conteudoURL,
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function(data) {
                    self.activedConteudo = data;
                    self.fetchData()
                }
            });
        },
        deleteConteudo: function(h) {

            $.ajax({
                type: "POST",
                url: conteudoURL + "delete",
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function() {
                    $('#modalConteudo').modal('hide');
                    self.fetchData()
                }
            });
        },
        updateConteudo: function(h) {
            var self = this

            // Resolver Circularidade nos Objetos
            h.subAbaPortal = self.activedSubAba;
            if (!h.titulo) {
                return;
            }

            $.ajax({
                type: "POST",
                url: conteudoURL + "modificar",
                data: JSON.stringify(h),
                dataType: "json",
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                success: function() {
                    self.fetchData()
                }
            });
        },
        selectConteudo: function(h) {
            var self = this
            self.activedConteudo = h
            self.buscaConteudoPorId(h)
        },
        // Imagem Uploader




        // Util
        buscaAbaPorId: function(h) {
            var self = this;
            $.get(abaURL + h.id, function(data) {
                self.activedAba = data.abaPortal;
            })
        },
        buscaSubAbaPorId: function(h) {
            var self = this;
            $.get(subAbaURL + h.id, function(data) {
                self.activedSubAba = data.subAbaPortal;
            })
        },
        buscaConteudoPorId: function(h) {
            var self = this;
            $.get(conteudoURL + h.id, function(data) {
                self.editedConteudo = data.conteudo;
            })
        }
    }
})
