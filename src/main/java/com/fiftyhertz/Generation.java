package com.fiftyhertz;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.roo.addon.json.RooJson;

@RooJavaBean
@RooToString
@RooJson
@RooJpaActiveRecord(finders = { "findGenerationsByGenYear", "findGenerationsByStateNameEquals" })
public class Generation {

    /**
     */
    private String stateName;

    /**
     */
    private int genYear;

    /**
     */
    private double thermal;

    /**
     */
    private double nuclear;

    /**
     */
    private double hydro;

    /**
     */
    private double naturalGen;

    public static List<Generation> findAllGenerations() {
        return entityManager().createQuery("SELECT o FROM Generation o ORDER BY o.stateName ASC", Generation.class).getResultList();
    }

    public static TypedQuery<Generation> findGenerationsByGenYear(int genYear) {
        EntityManager em = Generation.entityManager();
        TypedQuery<Generation> q = em.createQuery("SELECT o FROM Generation AS o WHERE o.genYear = :genYear ORDER BY o.stateName ASC", Generation.class);
        q.setParameter("genYear", genYear);
        return q;
    }

    public static TypedQuery<Generation> findGenerationsByStateNameEquals(String stateName) {
        if (stateName == null || stateName.length() == 0) throw new IllegalArgumentException("The stateName argument is required");
        EntityManager em = Generation.entityManager();
        TypedQuery<Generation> q = em.createQuery("SELECT o FROM Generation AS o WHERE o.stateName = :stateName ORDER BY o.genYear ASC", Generation.class);
        q.setParameter("stateName", stateName);
        return q;
    }
}
