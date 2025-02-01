package dev.webecke.lakestats.collector;

import com.fasterxml.jackson.databind.JsonNode;
import dev.webecke.lakestats.aggregator.ErrorAggregator;
import dev.webecke.lakestats.model.CollectorResponse;
import dev.webecke.lakestats.model.TimeSeriesData;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import dev.webecke.lakestats.network.NetworkClient;
import dev.webecke.lakestats.network.NetworkException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BureauOfReclamationDataCollector {
    private final NetworkClient networkClient;
    private final ErrorAggregator errorAggregator;

    public BureauOfReclamationDataCollector(NetworkClient networkClient, ErrorAggregator errorAggregator) {
        this.networkClient = networkClient;
        this.errorAggregator = errorAggregator;
    }

    public CollectorResponse<TimeSeriesData> collectData(Lake lake, DataType type) {
        String dataSourceUrl;
        try {
            dataSourceUrl = lake.dataSources().getUrl(type);
        } catch (IllegalArgumentException e) {
            errorAggregator.add("No URL found for data type: " + type + " while collecting data", e, lake.id());
            throw new RuntimeException(e);
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
            errorAggregator.add("Network exception while collecting %s data for lakeId %s".formatted(type, lake.id()), e, lake.id());
            return new CollectorResponse<>(null, false, LocalDateTime.now());
        }
    }
}
