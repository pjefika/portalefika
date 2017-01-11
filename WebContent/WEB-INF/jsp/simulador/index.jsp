<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
           prefix="decorator"%>

<div class="container">

    <div id="piv" v-cloak>

        <transition name="fade">
            <div>
                <div class="page-header">
                    <h1>Simulador PIV</h1>
                </div>
                <div v-show="show">
                    <component v-bind:is="currentViewForm"></component>
                    <hr>
                    <simulador-form v-bind:piv="vm.piv"></simulador-form>
                </div>
                <div v-show="!show">
                    <p> </p>
                    <img class="center-block" src="/simuladorpiv/resources/custom/gif/rolling.gif">
                </div>
            </div>
        </transition>

    </div>
</div>

<script type="text/html" id="dados-form">

    <div>
        <table class="table small table-bordered table-condensed">
            <tbody>
                <tr>
                    <th class="row"><label for="nome">Nome:</label></th>
                    <td><span id="nome" v-text="vm.piv.op.nome"></span></td>
                </tr>
                <tr>
                    <th class="row"><label for="super">Supervisão:</label></th>
                    <td><span id="super" v-text="vm.piv.op.nomeSupervisor"></span></td>
                </tr>
                <tr>
                    <th class="row"><label for="equipe">Equipe:</label></th>
                    <td><span id="equipe" v-text="vm.piv.op.equipe"></span></td>
                </tr>
            </tbody>
        </table>
        <hr>

        <mensagem-piv v-for="msg in vm.piv.mensagens" v-bind:texto="msg.texto"></mensagem-piv>
        <button type="button" class="btn btn-default btn-xs" @click="loadIndicadores()"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Carregar Indicadores</button>
        <button type="button" class="btn btn-primary btn-xs" @click="getMeta()"><span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span> Carregar Metas</button>

    </div>

</script>


<script type="text/html" id="celula-form">
    <div>
        <label>Selecione a Equipe</label>
        <select class="form-control" v-model="vm.piv.op.equipe" @change="getTarget()">
            <option value="" disabled>Selecione</option>
            <option v-for="eqp in equipes" v-bind:value="eqp.equipe">
                {{ eqp.nomeEquipe }}
            </option>

        </select>
    </div>
</script>

<script type="text/html" id="simulator">

    <div class="row" v-show="vm.piv.op.equipe">

        <div class="col-xs-1"></div>

        <div class="col-xs-2">
            <div class="form-group">
                <label for="fcr">FCR</label>
                <div class="input-group">
                    <input id="fcr" type="number" v-model="vm.fcr" min="0" @change="getTarget()" max="100" class="form-control" placeholder="FCR" aria-describedby="fcr-addon1">
                    <span class="input-group-addon" id="fcr-addon1">%</span>
                </div>
            </div>
        </div>

        <div class="col-xs-2">
            <div class="form-group">
                <label for="adr">Aderência</label>
                <div class="input-group">
                    <input id="adr" v-model="vm.adr" type="number"  min="0" @change="getTarget()" max="100" class="form-control" placeholder="Aderência" aria-describedby="adr-addon1">
                    <span class="input-group-addon" id="adr-addon1">%</span>
                </div>
            </div>
        </div>

        <div class="col-xs-2">
            <div class="form-group">
                <label for="monitoria">Monitoria</label>
                <div class="input-group">
                    <input v-model="vm.monitoria"  id="monitoria" type="number" @change="getTarget()" min="0" max="100" class="form-control" placeholder="Monitoria" aria-describedby="fcr-addon1">
                    <span class="input-group-addon" id="monitoria-addon1"><span class="glyphicon glyphicon-headphones" aria-hidden="true"></span></span>
                </div>
            </div>
        </div>

        <div class="col-xs-2">
            <div class="form-group">
                <label for="tma">TMA</label>
                <div class="input-group">
                    <input v-model="vm.tma" id="tma" type="time" class="form-control" @change="getTarget()" aria-describedby="tma-addon1">
                    <span class="input-group-addon" id="basic-tma"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span></span>
                </div>
            </div>
        </div>


        <div class="col-xs-2">
            <div class="form-group">
                <label for="tma">Faltas</label>
                <div class="input-group">
                    <input v-model="vm.faltas" id="faltas" type="number" class="form-control" @change="getTarget()">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-alert" aria-hidden="true"></span></span>
                </div>
            </div>
        </div>

        <div class="col-xs-1"></div>

        <div class="col-xs-4"></div>

        <div class="col-xs-4">
            <div class="form-group">
                <label for="tma">Target</label>
                <div class="panel panel-default">
                    <div class="panel-body">
                        <h2 class="text-center"><span v-text="normalizedTarget"></span>%</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xs-4"></div>


    </div>

</script>

<script src="${pageContext.request.contextPath}/resources/vue-components/simuladorpiv/simulador.js"></script>
