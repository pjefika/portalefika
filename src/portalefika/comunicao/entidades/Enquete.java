/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package portalefika.comunicao.entidades;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;


@Entity
@Table(name = "PE_ENQUETE")
public class Enquete extends ComponenteExpiravel {

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "enquete", fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Pergunta> perguntas;

    public Enquete() {
        this.perguntas = new ArrayList<>();
    }

    public List<Pergunta> getPerguntas() {
        return perguntas;
    }

    public void setPerguntas(List<Pergunta> perguntas) {
        this.perguntas = perguntas;
    }
    
    

}
