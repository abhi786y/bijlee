package com.fiftyhertz;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.roo.addon.web.mvc.controller.json.RooWebJson;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.roo.addon.web.mvc.controller.scaffold.RooWebScaffold;
import org.springframework.roo.addon.web.mvc.controller.finder.RooWebFinder;
import com.fiftyhertz.domain.Consumption;

@RooWebJson(jsonObject = Generation.class)
@Controller
@RequestMapping("/generations")
@RooWebScaffold(path = "generations", formBackingObject = Generation.class)
@RooWebFinder
public class GenerationController {

    @RequestMapping(params = "find=ByStateNameEquals", headers = "Accept=application/json")
    @ResponseBody
    public ResponseEntity<String> findGenerationsByStateNameEquals(@RequestParam("stateName") String stateName) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        List<Generation> result = Generation.findGenerationsByStateNameEquals(stateName).getResultList();
        double total = 0;
        Generation c = new Generation(), c1 = new Generation();
        int i;
        for (i = 0; i < result.size(); i++) {
            c = (Generation) result.get(i);
            total = total + c.getThermal() + c.getNuclear() + c.getHydro();
        }
        int year = c.getGenYear();
        c1.setGenYear(year + 1);
        total = total / i;
        c1.setThermal(total / 3);
        c1.setHydro(total / 3);
        c1.setNuclear(total / 3);
        result.add(c1);
        return new ResponseEntity<String>(Generation.toJsonArray(result), headers, HttpStatus.OK);
    }

	
	@RequestMapping(params = "find=ByGenYear", headers = "Accept=application/json")
    @ResponseBody
    public ResponseEntity<String> jsonFindGenerationsyGenYear(@RequestParam("genYear") int genYear) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        return new ResponseEntity<String>(Generation.toJsonArray(Generation.findGenerationsByGenYear(genYear).getResultList()), headers, HttpStatus.OK);
    }
}
