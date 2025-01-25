package dev.webecke.powellstats.collector;

import com.fasterxml.jackson.databind.JsonNode;
import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.LakeLevelDataset;
import dev.webecke.powellstats.network.NetworkClient;
import dev.webecke.powellstats.network.NetworkException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PowellLakeLevelCollector implements Collector<LakeLevelDataset> {
    private final NetworkClient networkClient;

    @Value("${app.collectors.powell.waterlevelurl}")
    private String dataSourceUrl;

    public PowellLakeLevelCollector(NetworkClient networkClient) {
        this.networkClient = networkClient;
    }

    @Override
    public CollectorResponse<LakeLevelDataset> collectData() {
        try {
            JsonNode response = networkClient.getRequest(dataSourceUrl);

            JsonNode dataArray = response.get("data");
            List<LakeLevelDataset.LakeLevelEntry> entries = new ArrayList<>();

            for (JsonNode entry : dataArray) {
                LocalDate date = LocalDate.parse(entry.get(0).asText());
                float level = entry.get(1).floatValue();
                entries.add(new LakeLevelDataset.LakeLevelEntry(level, date));
            }

            LakeLevelDataset data = new LakeLevelDataset("Lake Powell", entries);

            return new CollectorResponse<>(data, true, LocalDateTime.now());

        } catch (NetworkException e) {
            //TODO: Connect to ErrorAggregator
            return new CollectorResponse<>(null, false, LocalDateTime.now());
        }
    }
}
