package dev.webecke.powellstats.controller;

import dev.webecke.powellstats.aggregator.ErrorAggregator;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.service.DataCollectionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/collector")
public class CollectorController {
    private final DataCollectionService service;
    private final ErrorAggregator errorAggregator;

    public CollectorController(DataCollectionService service, ErrorAggregator errorAggregator) {
        this.service = service;
        this.errorAggregator = errorAggregator;
    }

    //TODO: change this to a POST or UPDATE request, its just a GET request right now for ease of testing
    @GetMapping
    public CurrentConditions runCollectors() {
        errorAggregator.flushErrors();
        return service.dailyDataCollection();
    }
}
