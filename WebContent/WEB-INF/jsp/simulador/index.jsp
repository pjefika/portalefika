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
                    <component v-bind:op="vm.piv.op" v-bind:is="currentViewForm"></component>
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

    <div class="row">
        <table class="table small table-bordered table-condensed">
            <tbody>
                <tr>
                    <th class="row"><label for="nome">Nome:</label></th>
                    <td><span id="nome" v-text="op.nome"></span></td>
                </tr>
                <tr>
                    <th class="row"><label for="super">Supervisão:</label></th>
                    <td><span id="super" v-text="op.nomeSupervisor"></span></td>
                </tr>
                <tr>
                    <th class="row"><label for="equipe">Equipe:</label></th>
                    <td><span id="equipe" v-text="op.equipe"></span></td>
                </tr>
            </tbody>
        </table>
    </div>

</script>


<script type="text/html" id="celula-form">
    <div class="row">
        <label>Selecione a Equipe</label>
        <select class="form-control" v-model="vm.piv.op.equipe" @change="getTarget()">
            <option value="" disabled>Selecione</option>
            <option v-for="eqp in equipes" v-bind:value="eqp.equipe">
                {{ eqp.nomeEquipe }}
            </option>
        </select>
    </div>
</script>



<script type="text/html" id="tabela-meta">
    <div>
        <table class="table small table-bordered table-condensed">
            <thead>
                <tr>
                    <th>Meta</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{meta}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</script>

<script type="text/html" id="tabela-regua">
    <table class="table small table-bordered table-condensed">
        <thead>
            <tr>
                <th>Realizado</th>
                <th>Atingimento</th>
            </tr>
        </thead>
        <tbody v-if="indicador != 'TMA'">
            <tr v-for="r in regua" v-bind:class="{success: (r.atingimento * 100).toFixed(0) == 100}">
                <td>{{ (r.realizado * 100).toFixed(1) }}<span v-if="indicador != 'MONITORIA'">%</span></td>
                <td>{{ (r.atingimento * 100).toFixed(0) }}</td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="r in regua"  v-bind:class="{success: (r.atingimento * 100).toFixed(0) == 100}">
                <td>{{ secondsToTime(r.realizado) }}</td>
                <td>{{ r.atingimento }}</td>
            </tr>
        </tbody>
    </table>
</script>


<script type="text/html" id="indicadores-form">

    <div class="row" v-show="vm.piv.op.equipe">

        <div v-bind:show="currentViewForm == 'dados-form'">
            <botoes-acao v-bind:show="currentViewForm == 'dados-form'"></botoes-acao>
            <hr>
        </div>

        <div class="row">
            <mensagem-piv v-for="msg in vm.piv.mensagens" v-bind:texto="msg.texto"></mensagem-piv>

            <div class="panel panel-default">
                <div class="panel-heading">Indicadores</div>
                <div class="panel-body">
                    <div class="col-xs-1"></div>
                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="fcr">FCR</label>
                            <a data-placement="bottom" data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="vm.fcr.meta"></tabela-meta>
                                    <tabela-regua indicador="FCR" v-bind:regua="vm.fcr.regua"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input id="fcr" step="0.01" type="number" v-model="vm.fcr.realizado" min="0" @change="getTarget()" max="100" class="form-control" placeholder="FCR" aria-describedby="fcr-addon1">
                                <span class="input-group-addon" id="fcr-addon1">%</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="adr">Aderência</label>
                            <a data-placement="bottom" data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="vm.adr.meta"></tabela-meta>
                                    <tabela-regua indicador="ADERENCIA" v-bind:regua="vm.adr.regua"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input id="adr" step="0.01" v-model="vm.adr.realizado" type="number"  min="0" @change="getTarget()" max="100" class="form-control" placeholder="Aderência" aria-describedby="adr-addon1">
                                <span class="input-group-addon" id="adr-addon1">%</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="monitoria">Monitoria</label>
                            <a data-placement="bottom" data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="vm.monitoria.meta"></tabela-meta>
                                    <tabela-regua  indicador="MONITORIA" v-bind:regua="vm.monitoria.regua"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input v-model="vm.monitoria.realizado"  id="monitoria" type="number" @change="getTarget()" min="0" max="100" class="form-control" placeholder="Monitoria" aria-describedby="fcr-addon1">
                                <span class="input-group-addon" id="monitoria-addon1"><span class="glyphicon glyphicon-headphones" aria-hidden="true"></span></span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="tma">TMA</label>
                            <a data-placement="bottom" data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="vm.tma.meta"></tabela-meta>
                                    <tabela-regua  indicador="TMA" v-bind:regua="vm.tma.regua"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input v-model="vm.tma.realizado" id="tma" type="text" placeholder="TMA" class="form-control time" maxlength="8" @change="getTarget()">
                                <span class="input-group-addon" id="basic-tma"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span></span>
                            </div>
                        </div>
                    </div>


                    <div class="col-xs-2">
                        <div class="form-group">
                            <label for="tma">Faltas</label>
                            <a data-placement="bottom" data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <table class="table small table-bordered table-condensed">
                                        <thead>
                                            <tr>
                                                <th>Realizado</th>
                                                <th>Desconto</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr>
                                                <td>1</td>
                                                <td>30</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>60</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>200</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </a>
                            <div class="input-group">
                                <input v-model="vm.faltas" id="faltas" type="number" placeholder="Faltas" class="form-control" @change="getTarget()">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-alert" aria-hidden="true"></span></span>
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-1"></div>
                </div>
            </div>

        </div>

        <div class="row center-block">

            <div class="col-xs-4"></div>

            <div class="col-xs-4">
                <div class="form-group">
                    <div class="panel panel-default">
                        <div for="tma" class="panel-heading">Target</div>
                        <div class="panel-body">
                            <h2 class="text-center"><span v-text="normalizedTarget"></span>%</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xs-4"></div>

        </div>
    </div>
</script>


<script src="${pageContext.request.contextPath}/resources/vue-components/simuladorpiv/simulador.js"></script>
