<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
           prefix="decorator"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <title><decorator:title default="Simulador PIV"/></title>
        <meta charset="utf-8">

        <!-- import CSS -->
        <link href="${pageContext.request.contextPath}/resources/bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="${pageContext.request.contextPath}/resources/bootstrap-3.3.7-dist/css/bootstrap-theme.min.css" rel="stylesheet" />
        <link href="${pageContext.request.contextPath}/resources/custom/custom.css" rel="stylesheet" />

        <!-- import JavaScript -->
        <script src="${pageContext.request.contextPath}/resources/jquery-3.1.1/jquery-3.1.1.min.js"></script>
        <script src="${pageContext.request.contextPath}/resources/node_modules/vue/dist/vue.js"></script>
        <script src="${pageContext.request.contextPath}/resources/jqueryMask/jquery.mask.min.js"></script>
        <script src="${pageContext.request.contextPath}/resources/moment/moment.js"></script>
        <script src="${pageContext.request.contextPath}/resources/lodash/lodash.js"></script>
        <script src="${pageContext.request.contextPath}/resources/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
        <script src="${pageContext.request.contextPath}/resources/custom/custom.js"></script>

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
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav">
                            <li><a href="${linkTo[SimuladorController].index()}">Simulador PIV<span class="sr-only">(current)</span></a></li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="${linkTo[UsuarioController].logout()}">Sair</a></li>
                        </ul>
                    </div><!-- /.navbar-collapse -->
                </div><!-- /.container-fluid -->
            </nav>

        </c:if>

        <div>
            <decorator:body/>
        </div>
        <!-- /container -->
    </body>
</html>
