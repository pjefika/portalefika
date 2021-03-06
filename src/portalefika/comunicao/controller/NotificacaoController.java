/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package portalefika.comunicao.controller;

import br.com.caelum.vraptor.Consumes;
import br.com.caelum.vraptor.Controller;
import br.com.caelum.vraptor.Get;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.view.Results;
import java.util.List;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import portalefika.autenticacao.controller.SessionUsuarioEfika;
import portalefika.comunicao.dal.NotificacaoDAO;
import portalefika.comunicao.entidades.Notificacao;
import portalefika.controller.AbstractController;

/**
 *
 * @author G0034481
 */
@Controller
@RequestScoped
public class NotificacaoController extends AbstractController {
    
    @Inject
    private NotificacaoDAO notificacaoDAO;
    
    @Inject
    private SessionUsuarioEfika session;

    public NotificacaoController() {
        
    }
    
    public void create() {
        
    }
    
    @Post
    @Consumes("application/json")
    @Path("/comunicacao/notificacao/cadastrar")
    public void cadastrar(Notificacao notificacao) {        
        try {            
            notificacao.setUsuario(this.session.getUsuario().getLogin());            
            this.notificacaoDAO.cadastrar(notificacao);
            this.result.use(Results.json()).from(notificacao).serialize();            
        } catch (Exception e) {            
            this.result.use(Results.json()).from(e).serialize();            
        }        
    }
    
    @Post
    @Consumes("application/json")
    @Path("/comunicacao/notificacao/modificar")
    public void modificar(Notificacao notificacao) {        
        try {            
            this.notificacaoDAO.editar(notificacao);
            this.result.use(Results.json()).from(notificacao).serialize();            
        } catch (Exception e) {            
            this.result.use(Results.json()).from(e).serialize();            
        }        
    }
    
    @Get
    @Path("/comunicacao/notificacao/listar")
    public void listar() {        
        List<Notificacao> l = this.notificacaoDAO.listar();        
        if (l != null) {           
            this.result.use(Results.json()).from(l).include("conteudo").serialize();            
        }        
    }
    
    @Get
    @Path("/comunicacao/notificacao/listarEsp")
    public void listarEsp() {
        
        List<Notificacao> l = this.notificacaoDAO.listarEsp();        
        if (l != null) {           
            this.result.use(Results.json()).from(l).include("conteudo").serialize();            
        } 
        
    }
    
    @Post
    @Consumes("application/json")
    @Path("/comunicacao/notificacao/excluir")
    public void excluir(Notificacao notificacao) {        
        try {            
            this.notificacaoDAO.excluir(notificacao);
            this.result.use(Results.json()).from(notificacao).serialize();            
        } catch (Exception e) {            
            this.result.use(Results.json()).from(e).serialize();            
        }
    }
    
}
