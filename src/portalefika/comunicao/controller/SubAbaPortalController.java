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
import portalefika.comunicao.dal.SubAbaPortalDAO;
import portalefika.comunicao.dal.exception.PersistenciaException;
import portalefika.comunicao.entidades.Component;
import portalefika.comunicao.entidades.SubAbaPortal;
import portalefika.controller.AbstractController;

@Controller
@RequestScoped
public class SubAbaPortalController extends AbstractController {

    @Inject
    private SubAbaPortalDAO saDao;

    public SubAbaPortalController() {

    }

    @Get
    @Path("/comunicacao/subAba/{a.id}")
    public void visualiza(SubAbaPortal a) {
        SubAbaPortal a1 = (SubAbaPortal) saDao.buscarPorId(a);

        if (a1 != null) {
            result.use(Results.json()).from(a1).include("abaPortal").include("conteudo").serialize();
        }
    }

    @Post
    @Consumes("application/json")
    @Path("/comunicacao/subAba/")
    public void adiciona(SubAbaPortal subAbaPortal) {
        try {
            saDao.cadastrar(subAbaPortal);
            result.use(Results.json()).from(subAbaPortal).include("conteudo").include("abaPortal").serialize();
        } catch (PersistenciaException e) {
            e.printStackTrace();
            result.use(Results.json()).from(e).serialize();
        }
    }

    @Get
    @Path("/comunicacao/subAba/")
    public void lista() {

        List<Component> l = saDao.listar(new SubAbaPortal());

        if (l != null) {
            result.use(Results.json()).from(l).include("abaPortal").include("conteudo").serialize();
        }
    }

    @Consumes("application/json")
    @Path("/comunicacao/subAba/delete")
    @Post
    public void remove(SubAbaPortal a) {
        try {
            this.saDao.excluir(a);
        } catch (PersistenciaException e) {
            result.use(Results.json()).from(a).serialize();
        }
    }

    @Consumes("application/json")
    @Path("/comunicacao/subAba/update")
    @Post
    public void atualiza(SubAbaPortal subAbaPortal) {

        try {
            this.saDao.editar(subAbaPortal);
            this.result.use(Results.json()).from(subAbaPortal).include("abaPortal").include("conteudo").serialize();
        } catch (PersistenciaException e) {
            this.result.use(Results.json()).from(e).serialize();
        }
    }

}
