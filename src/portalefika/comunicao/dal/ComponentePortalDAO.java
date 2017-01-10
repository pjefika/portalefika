package portalefika.comunicao.dal;

import java.util.ArrayList;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import portalefika.comunicao.dal.exception.PersistenciaException;
import portalefika.comunicao.entidades.Component;
import portalefika.comunicao.entidades.ComponentePortal;

@Stateless
public class ComponentePortalDAO {

    @PersistenceContext
    protected EntityManager entityManager;

    public ComponentePortalDAO() {
    }

    @Transactional
    public void cadastrar(Component c) throws PersistenciaException {
        try {
            this.entityManager.persist(c);
        } catch (Exception e) {
            throw new PersistenciaException(e.getMessage());
            //throw new PersistenciaException("Falha ao cadastrar " + c.getClass().getSimpleName() + ".");
        }
    }

    @Transactional
    public void editar(Component c) throws PersistenciaException {
        try {
            this.entityManager.merge(c);
        } catch (Exception e) {
            throw new PersistenciaException("Falha ao editar " + c.getClass().getSimpleName() + ".");
        }
    }

    @Transactional
    public void excluir(Component c) throws PersistenciaException {
        try {
            this.entityManager.remove(this.entityManager.merge(c));
        } catch (Exception e) {
            throw new PersistenciaException("Falha ao excluir " + c.getClass().getSimpleName() + ".");
        }
    }

    public List<Component> listar(Component a) {
        try {
            return (List<Component>) this.entityManager.createQuery("SELECT a FROM " + a.getClass().getSimpleName() + " a ORDER BY id ASC", a.getClass()).getResultList();
        } catch (Exception e) {
            return new ArrayList<Component>();
        }
    }

    public List<ComponentePortal> listarAtivos(ComponentePortal a) {
        try {
            return (List<ComponentePortal>) this.entityManager.createQuery("SELECT a FROM " + a.getClass().getSimpleName() + " a WHERE a.ativo=true ORDER BY id ASC", a.getClass()).getResultList();
        } catch (Exception e) {
            return new ArrayList<ComponentePortal>();
        }
    }

    public Component buscarPorId(Component c) {

        try {
            Query query;
            query = this.entityManager.createQuery("SELECT a FROM " + c.getClass().getSimpleName() + " a WHERE a.id =:param1", c.getClass());
            query.setParameter("param1", c.getId());
            return (Component) query.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

}
