package dev.webecke.lakestats.controller;

import dev.webecke.lakestats.aggregator.ErrorAggregator;
import dev.webecke.lakestats.model.SystemError;
import dev.webecke.lakestats.service.DataCollectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public String runCollectors() {
        errorAggregator.flushErrors();
        int numOfErrors = service.dailyDataCollection();
        return "Collectors have been run with %d errors.".formatted(numOfErrors);
    }

    @GetMapping("/{lakeId}")
    public String runCollectors(@PathVariable String lakeId) {
        errorAggregator.flushErrors();
        service.collectDataForLake(lakeId);
        List<SystemError> errors = errorAggregator.flushErrors();
        return "Collectors have been run for lake %s with %d errors.\n\n%s".formatted(lakeId, errors.size(), errors.toString());
    }
}
