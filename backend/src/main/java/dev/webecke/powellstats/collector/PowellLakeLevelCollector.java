package dev.webecke.powellstats.collector;

import com.fasterxml.jackson.databind.JsonNode;
import dev.webecke.powellstats.model.LakeLevelData;
import dev.webecke.powellstats.network.NetworkClient;
import dev.webecke.powellstats.network.NetworkException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PowellLakeLevelCollector implements LakeLevelCollector {
    private final NetworkClient networkClient;

    @Value("${app.collectors.powell.waterlevelurl}")
    private String dataSourceUrl;

    public PowellLakeLevelCollector(NetworkClient networkClient) {
        this.networkClient = networkClient;
    }

    @Override
    public LakeLevelData collectData() {
        try {
            JsonNode response = networkClient.getRequest(dataSourceUrl);

            JsonNode dataArray = response.get("data");
            List<LakeLevelData.LakeLevelEntry> entries = new ArrayList<>();

            for (JsonNode entry : dataArray) {
                LocalDate date = LocalDate.parse(entry.get(0).asText());
                float level = entry.get(1).floatValue();
                entries.add(new LakeLevelData.LakeLevelEntry(level, date));
            }

            return new LakeLevelData("Lake Powell", entries);

        } catch (NetworkException e) {
            System.out.println("France");
            return null;
        }
    }
}
