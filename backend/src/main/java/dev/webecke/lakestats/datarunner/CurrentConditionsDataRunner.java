package dev.webecke.lakestats.datarunner;

import dev.webecke.lakestats.model.UsgsTimeSeriesData;
import dev.webecke.lakestats.model.LakeStatsException;
import dev.webecke.lakestats.model.features.CurrentConditions;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.network.NetworkException;
import dev.webecke.lakestats.service.DataFormatingException;
import dev.webecke.lakestats.service.LakeStatsLogger;
import dev.webecke.lakestats.service.UsgsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZonedDateTime;

@Service
public class CurrentConditionsDataRunner {
    private final LakeStatsLogger logger = new LakeStatsLogger(CurrentConditionsDataRunner.class);
    private final UsgsService usgsService;

    public CurrentConditionsDataRunner(UsgsService usgsService) {
        this.usgsService = usgsService;
    }

    public CurrentConditions runCurrentConditionsData(Lake lake) {
        logger.info("Running current conditions data collection for lake: " + lake.id());

        try {
            UsgsTimeSeriesData last48Hours = usgsService.getInstantElevationData(lake.usgsSiteNumber(), LocalDate.now().minusDays(2), LocalDate.now());
            UsgsTimeSeriesData twoWeeksAgo = usgsService.getInstantElevationData(lake.usgsSiteNumber(), LocalDate.now().minusDays(14), LocalDate.now().minusDays(14));

            if (last48Hours.getNewestEntry().isEmpty()) {
                logger.warn("No data found for lake: " + lake.id());
                throw new LakeStatsException("No data found for lake: " + lake.id());
            }
            ZonedDateTime readingTime = last48Hours.getNewestEntry().get().date();

            return new CurrentConditions(
                    lake.id(),
                    last48Hours.sourceLabel(),
                    ZonedDateTime.now(),
                    readingTime,
                    last48Hours.dateIndex().get(readingTime).value(),
                    last48Hours.dateIndex().get(readingTime.minusDays(1)).value(),
                    twoWeeksAgo.dateIndex().get(readingTime.minusDays(14)).value(),
                    -1,
                    -1
            );
        } catch (NetworkException e) {
            throw new RuntimeException(e);
        } catch (DataFormatingException e) {
            throw new RuntimeException("df",e);
        }
    }
}
