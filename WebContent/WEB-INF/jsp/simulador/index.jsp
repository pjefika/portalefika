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
                    <p>
                    <component  v-bind:op="vm.piv.op" v-bind:is="currentViewForm"></component>
                    </p>
                    <simulador-form v-bind:vm="vm"></simulador-form>
                </div>
                <div v-show="!show">
                    <p>
                        <img class="center-block" src="/simuladorpiv/resources/custom/gif/rolling.gif">
                    </p>
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
    <div>
        <mensagem-piv texto="Indicadores indisponíveis no momento, preencha-os manualmente."></mensagem-piv>
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
        <tbody v-if="indicador.nome != 'TMA'">
            <tr v-for="r in indicador.regua" v-bind:class="{success: r.flagged}">
                <td>{{ (r.realizado * 100).toFixed(1) }}<span v-if="indicador.nome != 'MONITORIA'">%</span></td>
                <td>{{ (r.atingimento * 100).toFixed(0) }}</td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="r in indicador.regua"  v-bind:class="{success: r.flagged}">
                <td>{{ secondsToTime(r.realizado) }}</td>
                <td>{{ r.atingimento }}</td>
            </tr>
        </tbody>
    </table>
</script>


<script type="text/html" id="indicadores-form">

    <div v-show="show">
        <div v-bind:show="currentViewForm == 'dados-form'">
            <hr>
            <p><botoes-acao v-bind:dados="currentViewForm == 'dados-form'" v-bind:show="showBotoes"></botoes-acao></p>
        </div>

        <div>
            <mensagem-piv v-for="msg in mensagens" v-bind:texto="msg.texto"></mensagem-piv>

            <div class="panel panel-default">
                <div class="panel-heading" v-text="header"></div>
                <div class="panel-body">
                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="fcr">FCR</label>
                            <a v-show="showRegua" data-placement="bottom" data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="fcr.meta"></tabela-meta>
                                    <tabela-regua v-bind:indicador="fcr"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input v-bind:disabled="disabled" id="fcr" step="0.01" type="number" v-model="fcr.realizado" min="0" @change="getTarget()" max="100" class="form-control" placeholder="FCR" aria-describedby="fcr-addon1">
                                <span class="input-group-addon" id="fcr-addon1">%</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="adr">Aderência</label>
                            <a data-placement="bottom" v-show="showRegua"  data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="adr.meta"></tabela-meta>
                                    <tabela-regua v-bind:indicador="adr"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input v-bind:disabled="disabled" id="adr" step="0.01" v-model="adr.realizado" type="number"  min="0" @change="getTarget()" max="100" class="form-control" placeholder="Aderência" aria-describedby="adr-addon1">
                                <span class="input-group-addon" id="adr-addon1">%</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="monitoria">Monitoria</label>
                            <a data-placement="bottom" v-show="showRegua"  data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="monitoria.meta"></tabela-meta>
                                    <tabela-regua v-bind:indicador="monitoria"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input v-bind:disabled="disabled" step="0.01"  v-model="monitoria.realizado"  id="monitoria" type="number" @change="getTarget()" max="100" class="form-control" placeholder="Monitoria">
                                <span class="input-group-addon" id="monitoria-addon1"><span class="glyphicon glyphicon-headphones" aria-hidden="true"></span></span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="tma">TMA</label>
                            <a data-placement="bottom" v-show="showRegua"  data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">
                                    <tabela-meta v-bind:meta="tma.meta"></tabela-meta>
                                    <tabela-regua v-bind:indicador="tma"></tabela-regua>
                                </div>
                            </a>
                            <div class="input-group">
                                <input v-bind:disabled="disabled"  v-model="tma.realizado" id="tma" type="text" placeholder="TMA" class="form-control time" maxlength="8" @change="getTarget()">
                                <span class="input-group-addon" id="basic-tma"><span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span></span>
                            </div>
                        </div>
                    </div>


                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="tma">Faltas</label>
                            <a data-placement="bottom" v-show="showRegua"  data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
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
                                <input v-bind:disabled="disabled" v-model="faltas" id="faltas" type="number" placeholder="Faltas" class="form-control" @change="getTarget()">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-alert" aria-hidden="true"></span></span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="form-group">
                            <label for="fcr">Target</label>
                            <a data-placement="bottom" v-show="showRegua"  data-toggle="popover"  data-html="true" title="Informações" data-container="body" type="button">
                                <span class="glyphicon glyphicon-info-sign"></span>
                                <div class="hide conteudoPopOver">

                                </div>
                            </a>
                            <h4 class="text-center"><span v-text="normalizedTarget"></span>%</h4>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</script>


<script src="${pageContext.request.contextPath}/resources/vue-components/simuladorpiv/simulador.js"></script>
