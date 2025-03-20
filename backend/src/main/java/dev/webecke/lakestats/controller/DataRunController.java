package dev.webecke.lakestats.controller;

import dev.webecke.lakestats.model.RunResult;
import dev.webecke.lakestats.service.DataRunService;
import dev.webecke.lakestats.service.LakeStatsLogger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/datarun")
public class DataRunController {
    private final LakeStatsLogger logger = new LakeStatsLogger(DataRunController.class);

    private final DataRunService dataRunService;

    public DataRunController(DataRunService dataRunService) {
        this.dataRunService = dataRunService;
    }

    @GetMapping
    public ResponseEntity<RunResult> triggerAllDataRunners() {
        return ResponseEntity.ok(dataRunService.triggerAllDataRunners());
    }
}
