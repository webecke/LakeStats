package dev.webecke.lakestats.model.geography;

import org.springframework.lang.Nullable;
import dev.webecke.lakestats.model.measurements.DataType;
import java.time.LocalDate;
import java.util.Map;

public record Lake(
        String id,
        String name,
        String description,
        @Nullable LocalDate fillDate,
        String googleMapsLinkToDam,
        int fullPoolElevation,
        int minPowerPoolElevation,
        int deadPoolElevation,
        String usgsSiteNumber,
        Map<DataType, String> dataSources,
        Map<String, LakeRegion> regions
) {
    public String getDataSourceUrl(DataType type) {  // Moved the getUrl method here
        String url = dataSources.get(type);
        if (url == null) {
            throw new IllegalArgumentException("No URL found for data type: " + type);
        }
        return url;
    }
}
