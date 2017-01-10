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
        <h1>Conteudo</h1>
    </div>

    <div id="conteudo" v-cloak>
        <table class="table table-bordered">                    
            <thead>
                <tr>
                    <th>Titulo</th>
                    <th>Ativo</th>
                    <th>Data Criação</th>
                    <th>Conteudo Categoria</th>
                    <th>Imagem</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="conteudo in conteudos" :key="conteudo.id">
                    <td>{{conteudo.titulo}}</td>
                    <td>
                        <label v-if="conteudo.ativo == true" >Ativo</label>
                        <label v-if="conteudo.ativo == false" >Inativo</label>
                    </td>
                    <td>{{dateFormat(conteudo.dataCriacao)}}</td>
                    <td>{{conteudo.categoria.titulo}}</td>
                    <td>
                        <img :src="conteudo.imagem.base64" style="width: 50px"/>
                    </td>
                    <td>
                        <a class="btn btn-success glyphicon glyphicon-list btn-sm" role="button" :href="'${pageContext.request.contextPath}/comunicacao/conteudo/list/' + conteudo.id"/>                       
                    </td>
                </tr>                        
            </tbody>                    
        </table>
    </div>
    <script src="${pageContext.request.contextPath}/resources/vue-components/exibeConteudo.js"></script>
</div>

