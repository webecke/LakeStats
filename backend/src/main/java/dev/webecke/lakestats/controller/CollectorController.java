package dev.webecke.lakestats.controller;

import dev.webecke.lakestats.model.RunLakeCollectorResult;
import dev.webecke.lakestats.model.RunSystemResult;
import dev.webecke.lakestats.service.DataCollectionService;
import dev.webecke.lakestats.service.LakeStatsLogger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collector")
public class CollectorController {
    private final DataCollectionService service;
    private final LakeStatsLogger logger = new LakeStatsLogger(CollectorController.class);

    public CollectorController(DataCollectionService service) {
        this.service = service;
    }

    //TODO: change this to a POST or UPDATE request, its just a GET request right now for ease of testing
    @GetMapping
    public ResponseEntity<RunSystemResult> runCollectors() {
        logger.info("Running collectors for all lakes...");

        RunSystemResult result = service.dailyDataCollection();

        switch (result.status()) {
            case SUCCESS -> {
                List<String> lakeIds = result.lakeResults().stream()
                        .map(RunLakeCollectorResult::lakeId)
                        .toList();
                logger.info("Collectors have been run in %d milliseconds for lakes: %s".formatted(result.durationInMillis(), lakeIds));
                return ResponseEntity.ok(result);
            }
            case SOURCE_DATA_NOT_UPDATED -> {
                return ResponseEntity.status(503).body(result);
            }
            case CONFIGURATION_ERROR -> {
                return ResponseEntity.badRequest().body(result);
            }
            case SYSTEM_EXCEPTION -> {
                return ResponseEntity.status(500).body(result);
            }
            default -> throw new IllegalStateException("Unexpected value: " + result.status());
        }
    }

    @GetMapping("/{lakeId}")
    public ResponseEntity<RunLakeCollectorResult> runCollector(@PathVariable String lakeId) {
        logger.info("Running collector for lake: %s".formatted(lakeId));

        RunLakeCollectorResult result = service.collectDataForLake(lakeId);

        switch (result.status()) {
            case SUCCESS -> {
                logger.info("Collector completed successfully for lake %s in %d milliseconds"
                        .formatted(lakeId, result.durationInMillis()));
                return ResponseEntity.ok(result);
            }
            case SOURCE_DATA_NOT_UPDATED -> {
                return ResponseEntity.status(503).body(result);
            }
            case CONFIGURATION_ERROR -> {
                return ResponseEntity.badRequest().body(result);
            }
            case SYSTEM_EXCEPTION -> {
                return ResponseEntity.status(500).body(result);
            }
            default -> throw new IllegalStateException("Unexpected value: " + result.status());
        }
    }
}
