package com.fiftyhertz.domain;
import java.util.Collection;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.roo.addon.json.RooJson;
import org.springframework.transaction.annotation.Transactional;
import flexjson.JSONSerializer;

@RooJavaBean
@RooToString
@RooJson
@RooJpaActiveRecord(finders = { "findConsumptionsByConsYear", "findConsumptionsByStateNameEquals" })
public class Consumption {

    /**
     */
    private String stateName;

    /**
     */
    private int consYear;

    /**
     */
    private double nuclear;

    /**
     */
    private double hydro;

    /**
     */
    private double thermal;

    public static List<Consumption> findAllConsumptions() {
        return entityManager().createQuery("SELECT o FROM Consumption o ORDER BY o.stateName ASC", Consumption.class).getResultList();
    }

    public static List<String> getDistinctState() {
        return entityManager().createQuery("SELECT DISTINCT(o.stateName) as stateName FROM Consumption o", String.class).getResultList();
    }

    public static String stringToJsonArray(Collection<String> Name) {
        return new JSONSerializer().exclude("*.class").serialize(Name);
    }

    public static TypedQuery<Consumption> findConsumptionsByConsYear(int consYear) {
        EntityManager em = Consumption.entityManager();
        TypedQuery<Consumption> q = em.createQuery("SELECT o FROM Consumption AS o WHERE o.consYear = :consYear ORDER BY o.stateName ASC", Consumption.class);
        q.setParameter("consYear", consYear);
        return q;
    }

    public static TypedQuery<Consumption> findConsumptionsByStateNameEquals(String stateName) {
        if (stateName == null || stateName.length() == 0) throw new IllegalArgumentException("The stateName argument is required");
        EntityManager em = Consumption.entityManager();
        TypedQuery<Consumption> q = em.createQuery("SELECT o FROM Consumption AS o WHERE o.stateName = :stateName ORDER BY o.consYear ASC", Consumption.class);
        q.setParameter("stateName", stateName);
        return q;
    }
}
