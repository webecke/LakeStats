package dev.webecke.lakestats.model.geography;

import org.springframework.lang.Nullable;
import dev.webecke.lakestats.model.measurements.DataType;
import java.time.LocalDate;
import java.util.Map;

public record Lake(
        String id,
        String description,
        @Nullable LocalDate fillDate,
        String googleMapsLinkToDam,
        int fullPoolElevation,
        int minPowerPoolElevation,
        int deadPoolElevation,
        DataSources dataSources,
        Map<String, LakeRegion> regions
) {
    public record DataSources(Map<DataType, String> sources) {
        public String getUrl(DataType type) {
            String url = sources.get(type);
            if (url == null) {
                throw new IllegalArgumentException("No URL found for data type: " + type);
            }
            return url;
        }
    }
}
