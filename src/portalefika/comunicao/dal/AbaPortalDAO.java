package portalefika.comunicao.dal;

import javax.transaction.Transactional;
import portalefika.comunicao.entidades.AbaPortal;
import portalefika.comunicao.entidades.ComponentePortal;

public class AbaPortalDAO extends ComponentePortalDAO {

    @Override
    @Transactional
    public void cadastrar(ComponentePortal c) {
        super.cadastrar((AbaPortal) c);
    }

}
