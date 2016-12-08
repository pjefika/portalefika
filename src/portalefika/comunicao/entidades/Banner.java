package portalefika.comunicao.entidades;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import javax.validation.constraints.NotNull;


@Entity
@Table(name = "PE_COMUNICACAO_BANNER")
public class Banner extends ComponentePortalExpiravel {

    @NotNull
    private BannerLocal local;
    
    @NotNull
    private Conteudo conteudo;
    
    private Integer ordem;
    
    @NotNull
    private ImagemPortal imagem;
    

    public Banner() {

    }

    public void setLocal(BannerLocal local) {
        this.local = local;
    }

    public BannerLocal getLocal() {
        return local;
    }

    public void setOrdem(Integer ordem) {
        this.ordem = ordem;
    }

    public Integer getOrdem() {
        return ordem;
    }

    public void setConteudo(Conteudo conteudo) {
        this.conteudo = conteudo;
    }

    public Conteudo getConteudo() {
        return conteudo;
    }

    public void setImagem(ImagemPortal imagem) {
        this.imagem = imagem;
    }

    public ImagemPortal getImagem() {
        return imagem;
    }
}
