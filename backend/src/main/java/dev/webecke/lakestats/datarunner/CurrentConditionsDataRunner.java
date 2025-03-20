package dev.webecke.lakestats.datarunner;

import dev.webecke.lakestats.model.ContinuousTimeSeriesData;
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
            ContinuousTimeSeriesData twoDayData = usgsService.getInstantElevationData(lake.usgsSiteNumber(), LocalDate.now().minusDays(2), LocalDate.now());
            ContinuousTimeSeriesData twoWeekData = usgsService.getDailyElevationData(lake.usgsSiteNumber(), LocalDate.now().minusDays(14));

            if (twoDayData.getNewestEntry().isEmpty()) {
                logger.warn("No data found for lake: " + lake.id());
                throw new LakeStatsException("No data found for lake: " + lake.id());
            }
            ZonedDateTime readingTime = twoDayData.getNewestEntry().get().date();

            return new CurrentConditions(
                    lake.id(),
                    twoDayData.sourceLabel(),
                    ZonedDateTime.now(),
                    readingTime,
                    twoDayData.dateIndex().get(readingTime).value(),
                    twoDayData.dateIndex().get(readingTime.minusDays(1)).value(),
                    twoWeekData.dateIndex().get(readingTime.minusWeeks(2).truncatedTo(java.time.temporal.ChronoUnit.DAYS)).value(),
                    -1,
                    -1,
                    lake.fullPoolElevation(),
                    lake.minPowerPoolElevation(),
                    lake.deadPoolElevation()
            );
        } catch (NetworkException e) {
            throw new RuntimeException(e);
        } catch (DataFormatingException e) {
            throw new RuntimeException("df",e);
        }
    }
}
