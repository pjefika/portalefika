package portalefika.comunicao.controller;

import br.com.caelum.vraptor.Consumes;
import br.com.caelum.vraptor.Controller;
import br.com.caelum.vraptor.Delete;
import br.com.caelum.vraptor.Get;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Put;
import br.com.caelum.vraptor.serialization.gson.WithRoot;
import br.com.caelum.vraptor.view.Results;
import java.util.List;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import portalefika.comunicao.dal.AbaPortalDAO;
import portalefika.comunicao.entidades.AbaPortal;
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
            result.use(Results.json()).from(a1).serialize();
        }
    }

    @Post
    public void adiciona() {
        AbaPortal a = new AbaPortal();
        a.setTitulo("Nova Aba");
        a.setAtivo(false);
        abaDao.cadastrar(a);
    }

    @Get
    @Path("/comunicacao/aba/")
    public void lista() {

        List<ComponentePortal> l = abaDao.listar(new AbaPortal());

        if (l != null) {
            result.use(Results.json()).from(l).serialize();
        }
    }

    @Delete("/comunicacao/aba/{a.id}")
    public void remove(AbaPortal a) {
    }

    @Consumes("application/json")
    @Post
    public void atualiza(AbaPortal abaPortal) {
        abaDao.editar(abaPortal);
    }

}
