package dev.webecke.lakestats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class LakeStatsApplication {

	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("America/Denver"));
	}

	public static void main(String[] args) {
		SpringApplication.run(LakeStatsApplication.class, args);
	}

}
