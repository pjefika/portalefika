/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package testes.string;

import portalefika.util.StringUtil;

/**
 *
 * @author G0042204
 */
public class Tests {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        java.lang.String oi = "DEV.xls";

        System.out.println(StringUtil.getArquivoSuffix(oi));
    }

}
