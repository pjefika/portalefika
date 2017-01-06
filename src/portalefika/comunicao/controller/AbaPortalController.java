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
import portalefika.comunicao.dal.AbaPortalDAO;
import portalefika.comunicao.dal.exception.PersistenciaException;
import portalefika.comunicao.entidades.AbaPortal;
import portalefika.comunicao.entidades.Component;
import portalefika.comunicao.entidades.ComponentePortal;
import portalefika.controller.AbstractController;

@Controller
@RequestScoped
public class AbaPortalController extends AbstractController {

    @Inject
    private AbaPortalDAO abaDao;

    public AbaPortalController() {

    }

    @Get
    @Path("/comunicacao/aba/{a.id}")
    public void visualiza(AbaPortal a) {
        AbaPortal a1 = (AbaPortal) abaDao.buscarPorId(a);

        if (a1 != null) {
            includeSerializer(a1);
        }
    }

    @Post
    @Consumes("application/json")
    @Path("/comunicacao/aba/")
    public void adiciona(AbaPortal abaPortal) {
        try {
            abaDao.cadastrar(abaPortal);
            includeSerializer(abaPortal);
        } catch (PersistenciaException e) {
            result.use(Results.json()).from(e).serialize();
        }
    }

    @Get
    @Path("/comunicacao/aba/")
    public void lista() {

        List<Component> l = abaDao.listar(new AbaPortal());

        if (l != null) {
            includeSerializer(l);
        }
    }

    @Get
    @Path("/comunicacao/aba/listAtivos/")
    public void listAtivos() {

        List<ComponentePortal> l = abaDao.listarAtivos(new AbaPortal());

        if (l != null) {
            includeSerializer(l);
        }
    }
    
    
    @Consumes("application/json")
    @Path("/comunicacao/aba/delete")
    @Post
    public void remove(AbaPortal abaPortal) {
        try {
            this.abaDao.excluir(abaPortal);
        } catch (PersistenciaException e) {
            result.use(Results.json()).from(e).serialize();
        }
    }

    @Consumes("application/json")
    @Path("/comunicacao/aba/update")
    @Post
    public void atualiza(AbaPortal abaPortal) {
        try {
            abaDao.editar(abaPortal);
            includeSerializer(abaPortal);
        } catch (PersistenciaException e) {
            result.use(Results.json()).from(e).serialize();
        }
    }

    /**
     * Serializa Objeto com Padrão Definido
     *
     * @param a
     */
    protected void includeSerializer(Object a) {
        result.use(Results.json()).from(a).include("subAbas").include("subAbas.conteudo").serialize();
    }

}