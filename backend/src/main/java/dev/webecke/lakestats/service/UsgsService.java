package dev.webecke.lakestats.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import dev.webecke.lakestats.model.ContinuousTimeSeriesData;
import dev.webecke.lakestats.model.ContinuousTimeSeriesEntry;
import dev.webecke.lakestats.network.NetworkClient;
import dev.webecke.lakestats.network.NetworkException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UsgsService {
    private final LakeStatsLogger logger = new LakeStatsLogger(UsgsService.class);
    private final NetworkClient networkClient;

    // USGS API constants
    private final String USGS_BASE_URL = "https://waterservices.usgs.gov/nwis/";
    private final String USGS_FORMAT_PARAM = "?format=json";
    private final String USGS_INSTANT_VALUE_SUFFIX = "iv/";
    private final String USGS_DAILY_VALUE_SUFFIX = "dv/";
    private final String USGS_SITE_PREFIX = "&site=";
    private final String USGS_PARAMETER_PREFIX = "&parameterCd=";
    private final String USGS_START_DATE_PREFIX = "&startDT=";
    private final String USGS_END_DATE_PREFIX = "&endDT=";

    // USGS API query parameters
    private final String USGS_ELEVATION_CODE = "62614";

    // API Formatters
    private final DateTimeFormatter API_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final DateTimeFormatter API_DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public UsgsService(NetworkClient networkClient) {
        this.networkClient = networkClient;
    }

    public ContinuousTimeSeriesData getInstantElevationData(String siteId, LocalDate start, LocalDate end) throws NetworkException, DataFormatingException {
        return getInstantTimeSeriesData(siteId, start, end, USGS_ELEVATION_CODE);
    }

    public ContinuousTimeSeriesData getDailyElevationData(String siteId, LocalDate day) throws NetworkException, DataFormatingException {
        return getDailyElevationData(siteId, day, day);
    }

    public ContinuousTimeSeriesData getDailyElevationData(String siteId, LocalDate start, LocalDate end) throws NetworkException, DataFormatingException {
        return getDailyTimeSeriesData(siteId, start, end, USGS_ELEVATION_CODE);
    }

    private ContinuousTimeSeriesData getDailyTimeSeriesData(String siteId, LocalDate start, LocalDate end, String parameterCode) throws NetworkException, DataFormatingException {
        String queryUrl = getDailyValueUrl(siteId, parameterCode, start, end);
        JsonNode result = networkClient.getRequest(queryUrl);
        return extractTimeSeriesData(result);
    }

    private ContinuousTimeSeriesData getInstantTimeSeriesData(String siteId, LocalDate start, LocalDate end, String parameterCode) throws NetworkException, DataFormatingException {
        String queryUrl = getInstantValueUrl(siteId, parameterCode, start, end);
        JsonNode result = networkClient.getRequest(queryUrl);
        return extractTimeSeriesData(result);
    }

    /**
     * Constructs the URL to get all instant values for a given site and parameter code within a currentReadingTimestamp range.
     * The currentReadingTimestamp range is inclusive of both start and end dates.
     */
    private String getInstantValueUrl(String siteId, String parameterCode, LocalDate startDate, LocalDate endDate) {
        return USGS_BASE_URL + USGS_INSTANT_VALUE_SUFFIX + USGS_FORMAT_PARAM + USGS_SITE_PREFIX + siteId +
                USGS_PARAMETER_PREFIX + parameterCode + USGS_START_DATE_PREFIX + startDate.format(API_DATE_FORMAT) +
                USGS_END_DATE_PREFIX + endDate.format(API_DATE_FORMAT);
    }

    private String getDailyValueUrl(String siteId, String parameterCode, LocalDate startDate, LocalDate endDate) {
        return USGS_BASE_URL + USGS_DAILY_VALUE_SUFFIX + USGS_FORMAT_PARAM + USGS_SITE_PREFIX + siteId +
                USGS_PARAMETER_PREFIX + parameterCode + USGS_START_DATE_PREFIX + startDate.format(API_DATE_FORMAT) +
                USGS_END_DATE_PREFIX + endDate.format(API_DATE_FORMAT);
    }

    private String extractSourceSiteName(JsonNode data) throws DataFormatingException {
        try {
            return data.get("value").get("timeSeries").get(0).get("sourceInfo").get("siteName").asText();
        } catch (NullPointerException e) {
            throw new DataFormatingException("Source site name not found in data");
        }
    }

    private String extractSourceSiteNumber(JsonNode data) throws DataFormatingException {
        try {
            return data.get("value").get("timeSeries").get(0).get("sourceInfo").get("siteCode").get(0).get("value").asText();
        } catch (NullPointerException e) {
            throw new DataFormatingException("Source site number not found in data");
        }
    }

    private ZoneId extractTimezoneInfo(JsonNode data) throws DataFormatingException {
        try {
            JsonNode timeZoneInfo = data.get("value")
                    .get("timeSeries")
                    .get(0)
                    .get("sourceInfo")
                    .get("timeZoneInfo");

            // TODO: This doesn't handle daylight savings. Consider adding a helper to do this
            String defaultOffset = timeZoneInfo.get("defaultTimeZone").get("zoneOffset").asText();

            return ZoneId.of(defaultOffset);
        } catch (NullPointerException e) {
            logger.error("Timezone information not found in response");
            throw new DataFormatingException("Timezone information not found in response");
        }
    }

    private ContinuousTimeSeriesData extractTimeSeriesData(JsonNode data) throws DataFormatingException {
        JsonNode timeSeries;
        try {
            timeSeries = data.get("value").get("timeSeries").get(0).get("values").get(0).get("value");
        } catch (NullPointerException e) {
            throw new DataFormatingException("Time series data not found in response");
        }

        if (!timeSeries.isArray()) {
            logger.error("Data is not formatted as expected");
            throw new DataFormatingException("Data is not formatted as expected");
        }
        ArrayNode timeSeriesArrayNode = (ArrayNode) timeSeries;

        ZoneId siteZoneId = extractTimezoneInfo(data);

        List<ContinuousTimeSeriesEntry> entries = new ArrayList<>();

        for (int i = 0; i < timeSeriesArrayNode.size(); i++) {
            JsonNode node = timeSeriesArrayNode.get(i);

            if (!node.has("value") || !node.has("dateTime")) {
                logger.error("Node does not contain expected fields: " + node);
                throw new DataFormatingException("Node does not contain expected fields: " + node);
            }

            float value = Float.parseFloat(node.get("value").asText());

            String dateTimeStr = node.get("dateTime").asText();
            ZonedDateTime zonedDateTime;

            try {
                // Try to parse as ZonedDateTime first (if it has timezone info)
                zonedDateTime = ZonedDateTime.parse(dateTimeStr);
            } catch (DateTimeParseException e) {
                // If that fails, parse as LocalDateTime and add the timezone
                LocalDateTime localDateTime = LocalDateTime.parse(dateTimeStr);
                zonedDateTime = localDateTime.atZone(siteZoneId);
            }

            entries.add(new ContinuousTimeSeriesEntry(value, zonedDateTime));
        }

        return new ContinuousTimeSeriesData(
                entries,
                "USGS Site [%s] - %s".formatted(
                        extractSourceSiteNumber(data),
                        extractSourceSiteName(data))
        );
    }
}
