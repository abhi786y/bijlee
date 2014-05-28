package com.fiftyhertz;
import java.util.List;

import com.fiftyhertz.domain.Consumption;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.roo.addon.web.mvc.controller.json.RooWebJson;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.roo.addon.web.mvc.controller.scaffold.RooWebScaffold;
import org.springframework.roo.addon.web.mvc.controller.finder.RooWebFinder;

@RooWebJson(jsonObject = Consumption.class)
@Controller
@RequestMapping("/consumptions")
@RooWebScaffold(path = "consumptions", formBackingObject = Consumption.class)
@RooWebFinder
public class ConsumptionController {

    @RequestMapping(params = "find=ByState", headers = "Accept=application/json")
    @ResponseBody
    public ResponseEntity<String> listDistinctState() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        List<String> result = Consumption.getDistinctState();
        return new ResponseEntity<String>(Consumption.stringToJsonArray(result), headers, HttpStatus.OK);
    }

    @RequestMapping(params = "find=ByStateNameEquals", headers = "Accept=application/json")
    @ResponseBody
    public ResponseEntity<String> findConsumptionsByStateNameEquals(@RequestParam("stateName") String stateName) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        List<Consumption> result = Consumption.findConsumptionsByStateNameEquals(stateName).getResultList();
        double total = 0;
        Consumption c = new Consumption(), c1 = new Consumption();
        int i;
        for (i = 0; i < result.size(); i++) {
            c = (Consumption) result.get(i);
            total = total + c.getThermal() + c.getNuclear() + c.getHydro();
        }
        int year = c.getConsYear();
        c1.setConsYear(year + 1);
        total = total / i;
        c1.setThermal(total / 3);
        c1.setHydro(total / 3);
        c1.setNuclear(total / 3);
        result.add(c1);
        return new ResponseEntity<String>(Consumption.toJsonArray(result), headers, HttpStatus.OK);
    }
    
    @RequestMapping(params = "find=ByConsYear", headers = "Accept=application/json")
    @ResponseBody
    public ResponseEntity<String> jsonFindConsumptionsyConsYear(@RequestParam("consYear") int consYear) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        return new ResponseEntity<String>(Consumption.toJsonArray(Consumption.findConsumptionsByConsYear(consYear).getResultList()), headers, HttpStatus.OK);
    }
    
}
