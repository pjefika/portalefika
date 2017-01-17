<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
           prefix="decorator"%>

<div class="container">
    <div class="page-header">
        <h1>Editor</h1>
    </div>

    <div id="valert"></div>
    <div id="editor" v-cloak>
        <div class="row">
            <div class="col-md-12">
                <h4>Abas</h4>
                <div>
                    <table class="table table-bordered small">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Ativa</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="aba in abas" v-bind:class="{ active: activedAba == aba}" :key="aba.id">

                                <td class="view" v-if="aba != editedAba" @dblclick="editAba(aba)">
                                    <label>{{ aba.titulo }}</label>
                                </td>

                                <td v-if="aba == editedAba">
                                    <input class="form-control" type="text"
                                           v-model="aba.titulo"
                                           @blur="doneEditAba(aba)">
                                </td>

                                <td>
                                    <input type="checkbox" v-model="aba.ativo" @change="doneEditAba(aba)"></input>
                                </td>

                                <td>
                                    <button class="btn btn-primary glyphicon glyphicon-th-list btn-sm" @click="selectAba(aba)"></button>
                                    <button class="btn btn-danger glyphicon glyphicon-trash btn-sm" @click="clickDeleteAba(aba)" data-toggle="modal" data-target="#modalAba"></button>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                    <button class="btn btn-success btn-xs" @click="novaAba">Adicionar</button>
                    <br>
                </div>
            </div>
            <div class="col-md-12"><p></p></div>
            <div class="col-md-12">
                <div v-if="activedAba">
                    <hr>
                    <h4>SubAbas <span v-text="activedAba.titulo"></span></h4>
                    <table class="table table-bordered small">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Ativa</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="subAba in activedAba.subAbas" v-bind:class="{ active: activedSubAba == subAba}" :key="subAba.id">

                                <td class="view" v-if="subAba != editedSubAba" @dblclick="editSubAba(subAba)" @click="selectSubAba(subAba)">
                                    <label>{{ subAba.titulo }}</label>
                                </td>

                                <td v-if="subAba == editedSubAba">
                                    <input class="form-control" type="text"
                                           v-model="subAba.titulo"
                                           @blur="doneEditSubAba(subAba)">
                                </td>

                                <td>
                                    <input type="checkbox" v-model="subAba.ativo" @change="doneEditSubAba(subAba)"></input>
                                </td>

                                <td>
                                    <button class="btn btn-primary glyphicon glyphicon-save-file btn-sm" @click="clickConteudo(subAba.conteudo)" data-toggle="modal" data-target="#modalInserirConteudo"></button>
                                    <button class="btn btn-danger glyphicon glyphicon-trash btn-sm" @click="clickDeleteSubAba(subAba)" data-toggle="modal" data-target="#modalSubAba"></button>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                    <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#modalNovaSubAba">Adicionar</button>
                    <br>
                </div>
            </div>
        </div>


        <!-- Modal -->
        <div class="modal fade" id="modalAba" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  v-if="deletedAba">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Excluir </h4>
                    </div>
                    <div class="modal-body">
                        Deseja excluir a Aba  <strong v-html="deletedAba.titulo"></strong> e suas respectivas SubAbas?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-danger" @click="doneDeleteAba" data-dismiss="modal">Excluir</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal SubAba -->
        <div class="modal fade" id="modalSubAba" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  v-if="deletedSubAba">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Excluir </h4>
                    </div>
                    <div class="modal-body">
                        Deseja excluir a SubAba  <strong v-html="deletedSubAba.titulo"></strong> e seus respectivos conteúdos?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-danger" @click="doneDeleteSubAba" data-dismiss="modal">Excluir</button>
                    </div>
                </div>
            </div>
        </div>



        <!-- Modal Conteudo -->
        <div class="modal fade" id="modalInserirConteudo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  v-if="editedConteudo">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Vincular Conteúdo</h4>
                    </div>
                    <div class="modal-body">

                        <div class="form-group">
                            <label>Conteúdo</label>
                            <select class="form-control" v-model="activedSubAba.conteudo.id">
                                <option v-for="conteudo in conteudos" v-bind:value="conteudo.id">
                                    {{conteudo.categoria.titulo}} - {{conteudo.titulo}}
                                </option>
                            </select>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-success" @click="updateSubAba(activedSubAba)" data-dismiss="modal">Alterar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <nova-subaba v-bind:sub-aba-portal="activedSubAba" v-bind:conteudoes="conteudos" v-bind:aba-portal="activedAba"></nova-subaba>
        <!-- Modal Nova SubAba -->
        <script type="text/html" id="novaSubAbaForm">
            <div class="modal fade" id="modalNovaSubAba" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">Nova SubAba</h4>
                        </div>
                        <div class="modal-body form">                        
                            <div class="form-group">
                                <label>Conteúdo</label>
                                <select class="form-control" v-model="subAbaPortal.conteudo">
                                    <option v-for="conteudo in conteudoes" v-bind:value="conteudo" v-html="conteudo.categoria.titulo + ' - ' + conteudo.titulo">
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Título</label>
                                <input type="text" class="form-control" v-model="subAbaPortal.titulo">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-success" data-dismiss="modal" v-on:click="criaSubAbaNova">Criar</button>
                        </div>
                    </div>
                </div>
            </div>  
        </script>
    </div>
    <script src="${pageContext.request.contextPath}/resources/vue-components/editor.js"></script>
