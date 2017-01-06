<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
           prefix="decorator"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <title><decorator:title default="Portal Efika"/></title>
        <meta charset="utf-8">

        <!-- import CSS -->
        <link href="${pageContext.request.contextPath}/resources/bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="${pageContext.request.contextPath}/resources/bootstrap-3.3.7-dist/css/bootstrap-theme.min.css" rel="stylesheet" />
        <link href="${pageContext.request.contextPath}/resources/custom/custom.css" rel="stylesheet" />
        <link href="${pageContext.request.contextPath}/resources/custom/lightslider.min.css" rel="stylesheet" />

        <!-- import JavaScript -->
        <script src="${pageContext.request.contextPath}/resources/jquery-3.1.1/jquery-3.1.1.min.js"></script>
        <script src="${pageContext.request.contextPath}/resources/node_modules/vue/dist/vue.js"></script>
        <script src="${pageContext.request.contextPath}/resources/moment/moment.js"></script>
        <script src="${pageContext.request.contextPath}/resources/lodash/lodash.js"></script>
        <script src="${pageContext.request.contextPath}/resources/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
        <script src="${pageContext.request.contextPath}/resources/custom/custom.js"></script>
        <script src="${pageContext.request.contextPath}/resources/custom/lightslider.min.js"></script>

        <style>

            .navbar-telefonica{

                width: 100% !important;
                height: 100% !important;
                background-image:url('${pageContext.request.contextPath}/resources/images/header.jpg');

            }

        </style>

        <decorator:head/>
    </head>
    <body>

        <nav class="navbar-telefonica">
            <img class="telefonicaLogo" src="${pageContext.request.contextPath}/resources/images/logo.png"/>
        </nav>

        <c:if test="${sessionUsuarioEfika.logado}">

            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                    </div>

                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="menu-dinam" v-cloak>
                        <ul class="nav navbar-nav">
                            <li><a href="${linkTo[HomeController].index()}">Home <span class="sr-only">(current)</span></a></li>
                            <li><a href="${linkTo[SimuladorController].index()}">Simulador PIV</a></li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Funcionalidades <span class="caret"></span></a>
                                <ul class="dropdown-menu">
                                    <li class="dropdown-header">Adm</li>
                                    <li><a href="${linkTo[EditorController].create()}">Editor</a></li>
                                    <li><a href="${linkTo[EnqueteController].create()}">Gerenciar Enquete</a></li>
                                    <li><a href="${linkTo[ConteudoController].create()}">Gerenciar Conteúdo</a></li>
                                    <li><a href="${linkTo[ConteudoCategoriaController].create()}">Gerenciar Categoria</a></li>
                                    <li><a href="${linkTo[BannerController].create()}">Gerenciar Banner</a></li>
                                    <li><a href="${linkTo[NotificacaoController].create()}">Gerenciar Notificações</a></li>
                                    <li role="separator" class="divider"></li>
                                    <li class="dropdown-header">Usr</li>
                                    <li><a href="${linkTo[EnqueteController].list()}">Responder Enquete</a></li>
                                    <li><a href="${linkTo[ConteudoController].exibir()}">Conteúdos </a></li>
                                    <li role="separator" class="divider"></li>
                                    <li><a href="#">One more separated link</a></li>
                                </ul>
                            </li>
                        
                            <leabas v-for="aba in abas" v-bind:titulo="aba.titulo" v-bind:sub-abas="aba.subAbas"></leabas>
                       </ul>
                        <ul class="nav navbar-nav navbar-right">
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-user"></span>Perfil <span class="caret"></span></a>
                                <ul class="dropdown-menu">

                                    <li>
                                        <div class="navbar-login">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <p class="text-center">
                                                        <span class="glyphicon glyphicon-user icon-size"></span>
                                                    </p>
                                                </div>
                                                <div class="col-lg-7">
                                                    <p class="text-left"><strong>Nome</strong></p>
                                                    <p class="text-left small">nome.sobrenome@telefonica.com</p>
                                                    <p class="text-left">
                                                        <a href="#" class="btn btn-primary btn-block btn-sm">Meu Perfil</a>
                                                    </p>
                                                </div>
                                                <div class="col-lg-1"></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="divider"></li>
                                    <li>
                                        <div class="navbar-login navbar-login-session">
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <p>
                                                        <a href="${linkTo[UsuarioController].logout()}" class="btn btn-danger btn-block">Sair</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div><!-- /.navbar-collapse -->
                </div><!-- /.container-fluid -->
            </nav>

        </c:if>

        <div>
            <decorator:body/>
        </div>
        <!-- /container -->        
        <script src="${pageContext.request.contextPath}/resources/vue-components/notificationTemplate.js"></script>        
    </body>
</html>
<script src="${pageContext.request.contextPath}/resources/vue-components/menu_dinam.js"></script>
