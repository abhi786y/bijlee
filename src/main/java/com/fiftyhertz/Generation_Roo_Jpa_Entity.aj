// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.fiftyhertz;

import com.fiftyhertz.Generation;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

privileged aspect Generation_Roo_Jpa_Entity {
    
    declare @type: Generation: @Entity;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long Generation.id;
    
    @Version
    @Column(name = "version")
    private Integer Generation.version;
    
    public Long Generation.getId() {
        return this.id;
    }
    
    public void Generation.setId(Long id) {
        this.id = id;
    }
    
    public Integer Generation.getVersion() {
        return this.version;
    }
    
    public void Generation.setVersion(Integer version) {
        this.version = version;
    }
    
}
