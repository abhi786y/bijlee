// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.fiftyhertz;

import com.fiftyhertz.ConsumptionController;
import com.fiftyhertz.domain.Consumption;
import java.io.UnsupportedEncodingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriUtils;
import org.springframework.web.util.WebUtils;

privileged aspect ConsumptionController_Roo_Controller {
    
    @RequestMapping(method = RequestMethod.POST, produces = "text/html")
    public String ConsumptionController.create(@Valid Consumption consumption, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest) {
        if (bindingResult.hasErrors()) {
            populateEditForm(uiModel, consumption);
            return "consumptions/create";
        }
        uiModel.asMap().clear();
        consumption.persist();
        return "redirect:/consumptions/" + encodeUrlPathSegment(consumption.getId().toString(), httpServletRequest);
    }
    
    @RequestMapping(params = "form", produces = "text/html")
    public String ConsumptionController.createForm(Model uiModel) {
        populateEditForm(uiModel, new Consumption());
        return "consumptions/create";
    }
    
    @RequestMapping(value = "/{id}", produces = "text/html")
    public String ConsumptionController.show(@PathVariable("id") Long id, Model uiModel) {
        uiModel.addAttribute("consumption", Consumption.findConsumption(id));
        uiModel.addAttribute("itemId", id);
        return "consumptions/show";
    }
    
    @RequestMapping(produces = "text/html")
    public String ConsumptionController.list(@RequestParam(value = "page", required = false) Integer page, @RequestParam(value = "size", required = false) Integer size, Model uiModel) {
        if (page != null || size != null) {
            int sizeNo = size == null ? 10 : size.intValue();
            final int firstResult = page == null ? 0 : (page.intValue() - 1) * sizeNo;
            uiModel.addAttribute("consumptions", Consumption.findConsumptionEntries(firstResult, sizeNo));
            float nrOfPages = (float) Consumption.countConsumptions() / sizeNo;
            uiModel.addAttribute("maxPages", (int) ((nrOfPages > (int) nrOfPages || nrOfPages == 0.0) ? nrOfPages + 1 : nrOfPages));
        } else {
            uiModel.addAttribute("consumptions", Consumption.findAllConsumptions());
        }
        return "consumptions/list";
    }
    
    @RequestMapping(method = RequestMethod.PUT, produces = "text/html")
    public String ConsumptionController.update(@Valid Consumption consumption, BindingResult bindingResult, Model uiModel, HttpServletRequest httpServletRequest) {
        if (bindingResult.hasErrors()) {
            populateEditForm(uiModel, consumption);
            return "consumptions/update";
        }
        uiModel.asMap().clear();
        consumption.merge();
        return "redirect:/consumptions/" + encodeUrlPathSegment(consumption.getId().toString(), httpServletRequest);
    }
    
    @RequestMapping(value = "/{id}", params = "form", produces = "text/html")
    public String ConsumptionController.updateForm(@PathVariable("id") Long id, Model uiModel) {
        populateEditForm(uiModel, Consumption.findConsumption(id));
        return "consumptions/update";
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "text/html")
    public String ConsumptionController.delete(@PathVariable("id") Long id, @RequestParam(value = "page", required = false) Integer page, @RequestParam(value = "size", required = false) Integer size, Model uiModel) {
        Consumption consumption = Consumption.findConsumption(id);
        consumption.remove();
        uiModel.asMap().clear();
        uiModel.addAttribute("page", (page == null) ? "1" : page.toString());
        uiModel.addAttribute("size", (size == null) ? "10" : size.toString());
        return "redirect:/consumptions";
    }
    
    void ConsumptionController.populateEditForm(Model uiModel, Consumption consumption) {
        uiModel.addAttribute("consumption", consumption);
    }
    
    String ConsumptionController.encodeUrlPathSegment(String pathSegment, HttpServletRequest httpServletRequest) {
        String enc = httpServletRequest.getCharacterEncoding();
        if (enc == null) {
            enc = WebUtils.DEFAULT_CHARACTER_ENCODING;
        }
        try {
            pathSegment = UriUtils.encodePathSegment(pathSegment, enc);
        } catch (UnsupportedEncodingException uee) {}
        return pathSegment;
    }
    
}
