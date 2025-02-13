package dev.webecke.lakestats.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@RestController
public class SystemWarmUpController {
    private static final ZoneId MOUNTAIN_TIME = ZoneId.of("America/Denver");

    @GetMapping("/")
    public ResponseEntity<String> healthCheck() {
        ZonedDateTime now = ZonedDateTime.now(MOUNTAIN_TIME);
        String formattedTime = now.format(DateTimeFormatter.ofPattern("MMM d, yyyy HH:mm:ss z"));
        return ResponseEntity.ok("Hello! Thanks for checking in.\n" +
                "The LakeStats server is warmed-up and healthy.\n" +
                "Current time: " + formattedTime);
    }
}
