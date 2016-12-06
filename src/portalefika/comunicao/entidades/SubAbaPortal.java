package portalefika.comunicao.entidades;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "PE_SUBABA")
public class SubAbaPortal extends ComponentePortal {

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "subAba", cascade = CascadeType.REMOVE)
    private List<Conteudo> conteudos;

    @ManyToOne
    private AbaPortal abaPortal;

    public SubAbaPortal() {
        this.conteudos = new ArrayList<>();
    }

    public void setConteudos(List<Conteudo> conteudos) {
        this.conteudos = conteudos;
    }

    public List<Conteudo> getConteudos() {
        return conteudos;
    }

    public void setAbaPortal(AbaPortal abaPortal) {
        this.abaPortal = abaPortal;
    }

    public AbaPortal getAbaPortal() {
        return abaPortal;
    }
}
