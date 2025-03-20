package dev.webecke.lakestats.service;

import dev.webecke.lakestats.model.BorTimeSeriesData;
import dev.webecke.lakestats.model.LakeStatsException;
import dev.webecke.lakestats.model.ResultStatus;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import dev.webecke.lakestats.network.NetworkClient;
import com.fasterxml.jackson.databind.JsonNode;
import dev.webecke.lakestats.network.NetworkException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BorService {
    private static final Logger logger = LoggerFactory.getLogger(BorService.class);
    private static final Duration CACHE_EXPIRATION = Duration.ofMinutes(10);

    private final NetworkClient networkClient;

    // Cache structure using records for storing both data and timestamp
    private record CacheEntry(BorTimeSeriesData data, LocalDateTime timestamp) {}
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public BorService(NetworkClient networkClient) {
        this.networkClient = networkClient;
    }

    public float getOneYearAgo(Lake lake, DataType type) {
        BorTimeSeriesData data = collectData(lake, type);
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        return data.dateIndex().getOrDefault(oneYearAgo, new BorTimeSeriesData.BorTimeSeriesEntry(-1, oneYearAgo)).value();
    }

    public float getTenYearDateAverage(Lake lake, DataType type) {
        return multiYearAverageOnThisDate(LocalDate.now(), 10, collectData(lake, type));
    }

    private float multiYearAverageOnThisDate(LocalDate startDate, Integer years, BorTimeSeriesData dataset) {
        Map<LocalDate, BorTimeSeriesData.BorTimeSeriesEntry> indexedData = dataset.dateIndex();

        float runningSum = 0;
        for (int i = 0; i < years; i++) {
            BorTimeSeriesData.BorTimeSeriesEntry entry = indexedData.get(startDate.minusYears(i + 1));

            if (entry == null) {
                logger.warn(
                        "Less than %d years of data found for %s while calculating multiYearAverageOnThisDate"
                                .formatted(years, dataset.lakeId()), dataset.lakeId());
                break;
            }

            runningSum += entry.value();
        }

        return runningSum / years;
    }

    /**
     * Get time series data for the specified lake and data type.
     * Data will be fetched from cache if available and fresh (less than 10 minutes old),
     * otherwise it will be fetched from the network.
     *
     * @param lake The lake to get data for
     * @param type The data type to collect
     * @return The time series data
     */
    public BorTimeSeriesData collectData(Lake lake, DataType type) {
        String cacheKey = createCacheKey(lake.id(), type);

        // Check if we have a cached entry that's still fresh
        CacheEntry cachedEntry = cache.get(cacheKey);
        if (cachedEntry != null && isCacheFresh(cachedEntry.timestamp())) {
            logger.debug("Cache hit for {}/{}", lake.id(), type);
            return cachedEntry.data();
        }

        // Cache miss or expired, get fresh data
        logger.debug("Cache miss for {}/{}, fetching fresh data", lake.id(), type);
        BorTimeSeriesData freshData = fetchData(lake, type);

        // Update cache
        cache.put(cacheKey, new CacheEntry(freshData, LocalDateTime.now()));

        return freshData;
    }

    /**
     * Forcefully clear the cache for a specific lake and data type.
     * Useful when data needs to be refreshed regardless of cache status.
     *
     * @param lakeId The lake ID
     * @param type The data type
     */
    public void invalidateCache(String lakeId, DataType type) {
        String cacheKey = createCacheKey(lakeId, type);
        cache.remove(cacheKey);
        logger.debug("Cache invalidated for {}/{}", lakeId, type);
    }

    /**
     * Clear all cached data
     */
    public void clearCache() {
        cache.clear();
        logger.debug("Cache cleared");
    }

    private BorTimeSeriesData fetchData(Lake lake, DataType type) {
        String dataSourceUrl;
        try {
            dataSourceUrl = lake.getDataSourceUrl(type);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("No URL found for data type: " + type + " while collecting data");
        }

        try {
            JsonNode response = networkClient.getRequest(dataSourceUrl);

            JsonNode dataArray = response.get("data");
            List<BorTimeSeriesData.BorTimeSeriesEntry> entries = new ArrayList<>();

            for (JsonNode entry : dataArray) {
                LocalDate date = LocalDate.parse(entry.get(0).asText());
                float level = entry.get(1).floatValue();
                entries.add(new BorTimeSeriesData.BorTimeSeriesEntry(level, date));
            }

            return new BorTimeSeriesData(lake.id(), entries, type);

        } catch (NetworkException e) {
            throw new LakeStatsException(
                    "Network exception while collecting %s data for %s".formatted(type, lake.id()),
                    ResultStatus.SYSTEM_EXCEPTION,
                    e
            );
        }
    }

    private String createCacheKey(String lakeId, DataType type) {
        return lakeId + "::" + type.name();
    }

    private boolean isCacheFresh(LocalDateTime timestamp) {
        return Duration.between(timestamp, LocalDateTime.now()).compareTo(CACHE_EXPIRATION) < 0;
    }
}
