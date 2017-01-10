<%-- 
    Document   : create
    Created on : 08/12/2016, 17:50:36
    Author     : G0034481
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
           prefix="decorator"%>
<div class="container">

    <div class="page-header">
        <h1>Conteúdo</h1>
    </div>

    <div id="contenido" v-cloak>
            
        <div>
            <table class="table table-bordered">                    
                <thead>                        
                    <tr>                            
                        <th>Titulo</th>
                        <th>Ativo</th>
                        <th>Data Criação</th>
                        <th>Categoria</th>
                        <th>Imagem</th>
                        <th>Ações</th>                        
                    </tr>                        
                </thead>                    
                <tbody>                                                    
                    <tr is="letr" v-for="conteudo in conteudos" :key="conteudo.id" v-bind:conteudo="conteudo"></tr>
                </tbody>                    
            </table>
            <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#criaConteudo" data-backdrop="static" @click="resetObjects()">Criar Conteudo</button>
            <a class="btn btn-primary btn-sm" href="${linkTo[ConteudoCategoriaController].create()}">Criar categoria</a>
        </div>        
        <!-- Modal Cria conteudo-->
        <div class="modal fade" id="criaConteudo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Cria Conteudo</h4>
                    </div>
                    <div class="modal-body">

                        <div class="form-group">
                            <label >Titulo</label>
                            <input type="text" class="form-control" placeholder="Titulo" v-model="addconteudo.conteudo.titulo">
                        </div>
                        <div class="form-group">
                            <label>Ativo</label>
                            <input type="checkbox" v-model="addconteudo.conteudo.ativo"/>
                        </div>
                        <div class="form-group">
                            <label>Texto</label>     
                            <textarea class="form-control" rows="3" v-model="addconteudo.conteudo.texto" placeholder="Texto"></textarea>
                        </div>
                        <div class="form-group">
                            <label >Conteudo categoria</label>
                            <select class="form-control" v-model="categoriaselec">
                                <option v-for="categoria in categorias" v-bind:value="categoria">
                                    {{categoria.titulo}}
                                </option>
                            </select>
                        </div>
                        <div v-if="!image">
                            <h4>Selecione uma imagem</h4>
                            <span class="btn btn-default">
                                <input type="file" @change="onFileChange">
                            </span>
                        </div>
                        <div v-else>
                            <img :src="image" style="width: 450px"/>
                            <br>
                            <br>
                            <button type="button" class="btn btn-default" type="file" @click="removeImage">
                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" @click="addConteudo()">Cadastrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal modifica conteudo-->
        <div class="modal fade" id="modConteudo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Modificar Conteudo</h4>
                    </div>
                    <div class="modal-body">

                        <div class="form-group">
                            <label>Titulo</label>
                            <input type="text" class="form-control" placeholder="Titulo" v-model="modconteudo.conteudo.titulo">
                        </div>
                        <div class="form-group">
                            <label>Ativo</label>
                            <input type="checkbox" v-model="modconteudo.conteudo.ativo"/>
                        </div>
                        <div class="form-group">
                            <label>Texto</label>     
                            <textarea class="form-control" rows="3" v-model="modconteudo.conteudo.texto" placeholder="Texto"></textarea>
                        </div>

                        <div class="form-group">
                            <label >Conteudo categoria</label>
                            <select class="form-control" v-model="modconteudo.conteudo.categoria.id">
                                <option v-for="categoria in categorias" v-bind:value="categoria.id">
                                    {{categoria.titulo}}
                                </option>
                            </select>
                        </div>

                        <div v-if="!image">
                            <h4>Selecione uma imagem</h4>
                            <span class="btn btn-default">
                                <input type="file" @change="onFileChange">
                            </span>
                        </div>
                        <div v-else>
                            <img :src="image" style="width: 450px"/>
                            <br>
                            <br>
                            <button type="button" class="btn btn-default" type="file" @click="removeImage">
                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal" @click="fetchConteudo()">Fechar</button>
                        <button type="button" class="btn btn-primary" @click="updateConteudo()">Modificar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Exclui conteudo-->
        <div class="modal fade" id="delConteudo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Excluir Conteudo</h4>
                    </div>
                    <div class="modal-body">

                        Deseja realmente excluir este conteudo?

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-danger" @click="delConteudo()">Excluir</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script src="${pageContext.request.contextPath}/resources/vue-components/conteudo.js"></script>

</div>