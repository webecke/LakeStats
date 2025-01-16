package dev.webecke.powellstats.controller;

import dev.webecke.powellstats.model.LakeLevelData;
import dev.webecke.powellstats.service.DataCollectionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/collector")
public class CollectorController {
    DataCollectionService service;

    public CollectorController(DataCollectionService service) {
        this.service = service;
    }

    //TODO: change this to a POST or UPDATE request, its just a GET request right now for ease of testing
    @GetMapping
    public LakeLevelData runCollectors() {
        return service.dailyDataCollection();
    }
}
