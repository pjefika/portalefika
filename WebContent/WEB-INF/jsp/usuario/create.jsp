<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
           prefix="decorator"%>


<div id="formAuth" class="container" style="margin-top: 3%;">

    <form action="${linkTo[UsuarioController].login}" method="post">

        <div class="page-header">
            <h1>Simulador PIV</h1>
        </div>

        <div class="mainbox center">
            <c:if test="${not empty mensagemFalha}">
                <span class="alert alert-danger" role="alert">
                    <label class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></label>
                    ${mensagemFalha}
                </span>
            </c:if>
        </div>

        <div id="loginbox" style="margin-top:50px;" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <div class="panel panel-default" >
                <div class="panel-heading">
                    <div class="panel-title">Credenciais Efika</div>
                </div>

                <div style="padding-top:30px" class="panel-body" >

                    <div style="display:none" id="login-alert" class="alert alert-danger col-sm-12"></div>

                    <form id="loginform" class="form-horizontal" role="form">

                        <div style="margin-bottom: 25px" class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                            <input
                                type="text" class="form-control" id="login" name="u.login"
                                placeholder="Login">
                        </div>

                        <div style="margin-bottom: 25px" class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            <input
                                type="password" placeholder="Senha" class="form-control" id="senha" name="u.senha">
                        </div>

                        <div style="margin-top:10px" class="form-group">
                            <!-- Button -->
                            <div class="col-sm-12 controls">
                                <button type="submit" class="btn btn-primary">Entrar</button>                            </div>
                        </div>
                </div>
            </div>
        </div>
    </form>
</div>
