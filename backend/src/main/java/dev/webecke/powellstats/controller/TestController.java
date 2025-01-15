package dev.webecke.powellstats.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    @GetMapping("/1")
    public String getCurrentConditions() {
        return "Oh hey, this is a test! And you got a string!";
    }
}
