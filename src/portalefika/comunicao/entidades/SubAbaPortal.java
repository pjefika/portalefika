package portalefika.comunicao.entidades;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "PE_SUBABA")
public class SubAbaPortal extends ComponentePortal {

    
    @ManyToOne
    private Conteudo conteudo;

    @ManyToOne
    private AbaPortal abaPortal;

    public SubAbaPortal() {
//        conteudo = new Conteudo();
    }

    public Conteudo getConteudo() {
        return conteudo;
    }

    public void setConteudo(Conteudo conteudo) {
        this.conteudo = conteudo;
    }

    public AbaPortal getAbaPortal() {
        return abaPortal;
    }

    public void setAbaPortal(AbaPortal abaPortal) {
        this.abaPortal = abaPortal;
    }

}
