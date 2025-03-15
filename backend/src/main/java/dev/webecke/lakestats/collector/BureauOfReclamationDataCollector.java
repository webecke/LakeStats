package dev.webecke.lakestats.collector;

import com.fasterxml.jackson.databind.JsonNode;
import dev.webecke.lakestats.model.CollectorResponse;
import dev.webecke.lakestats.model.LakeStatsException;
import dev.webecke.lakestats.model.ResultStatus;
import dev.webecke.lakestats.model.TimeSeriesData;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import dev.webecke.lakestats.network.NetworkClient;
import dev.webecke.lakestats.network.NetworkException;
import dev.webecke.lakestats.service.LakeStatsLogger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BureauOfReclamationDataCollector {
    private final NetworkClient networkClient;
    private final LakeStatsLogger logger = new LakeStatsLogger(BureauOfReclamationDataCollector.class);

    public BureauOfReclamationDataCollector(NetworkClient networkClient) {
        this.networkClient = networkClient;
    }

    public CollectorResponse<TimeSeriesData> collectData(Lake lake, DataType type) {
        String dataSourceUrl;
        try {
            dataSourceUrl = lake.getDataSourceUrl(type);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("No URL found for data type: " + type + " while collecting data");
        }

        try {
            JsonNode response = networkClient.getRequest(dataSourceUrl);

            JsonNode dataArray = response.get("data");
            List<TimeSeriesData.TimeSeriesEntry> entries = new ArrayList<>();

            for (JsonNode entry : dataArray) {
                LocalDate date = LocalDate.parse(entry.get(0).asText());
                float level = entry.get(1).floatValue();
                entries.add(new TimeSeriesData.TimeSeriesEntry(level, date));
            }

            TimeSeriesData data = new TimeSeriesData(lake.id(), entries, type);

            return new CollectorResponse<>(data, true, LocalDateTime.now());

        } catch (NetworkException e) {
            throw new LakeStatsException("Network exception while collecting %s data for %s".formatted(type, lake.id()), ResultStatus.SYSTEM_EXCEPTION, e);
        }
    }
}
