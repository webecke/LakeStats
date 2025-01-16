package dev.webecke.powellstats.collector;

import com.fasterxml.jackson.databind.JsonNode;
import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.RawLakeLevelData;
import dev.webecke.powellstats.network.NetworkClient;
import dev.webecke.powellstats.network.NetworkException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PowellLakeLevelCollector implements Collector<RawLakeLevelData> {
    private final NetworkClient networkClient;

    @Value("${app.collectors.powell.waterlevelurl}")
    private String dataSourceUrl;

    public PowellLakeLevelCollector(NetworkClient networkClient) {
        this.networkClient = networkClient;
    }

    @Override
    public CollectorResponse<RawLakeLevelData> collectData() {
        try {
            JsonNode response = networkClient.getRequest(dataSourceUrl);

            JsonNode dataArray = response.get("data");
            List<RawLakeLevelData.LakeLevelEntry> entries = new ArrayList<>();

            for (JsonNode entry : dataArray) {
                LocalDate date = LocalDate.parse(entry.get(0).asText());
                float level = entry.get(1).floatValue();
                entries.add(new RawLakeLevelData.LakeLevelEntry(level, date));
            }

            RawLakeLevelData data = new RawLakeLevelData("Lake Powell", entries.reversed());

            return new CollectorResponse<>(data, true, LocalDateTime.now());

        } catch (NetworkException e) {
            //TODO: Connect to ErrorAggregator
            return new CollectorResponse<RawLakeLevelData>(null, false, LocalDateTime.now());
        }
    }
}
