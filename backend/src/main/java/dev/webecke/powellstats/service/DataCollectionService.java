package dev.webecke.powellstats.service;

import dev.webecke.powellstats.aggregator.CurrentConditionsAggregator;
import dev.webecke.powellstats.aggregator.ErrorAggregator;
import dev.webecke.powellstats.collector.BureauOfReclamationDataCollector;
import dev.webecke.powellstats.dao.PublishingDao;
import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.TimeSeriesData;
import dev.webecke.powellstats.model.geography.AccessPoint;
import dev.webecke.powellstats.model.geography.AccessType;
import dev.webecke.powellstats.model.geography.Lake;
import dev.webecke.powellstats.model.geography.LakeRegion;
import dev.webecke.powellstats.model.measurements.DataType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DataCollectionService {
    private final ErrorAggregator errorAggregator;
    private final BureauOfReclamationDataCollector bureauOfReclamationDataCollector;
    private final CurrentConditionsAggregator currentConditionsAggregator;
    private final PublishingDao publishingDao;

    public DataCollectionService(ErrorAggregator errorAggregator,
                                 BureauOfReclamationDataCollector bureauOfReclamationDataCollector,
                                 CurrentConditionsAggregator currentConditionsAggregator,
                                 PublishingDao publishingDao) {
        this.errorAggregator = errorAggregator;
        this.bureauOfReclamationDataCollector = bureauOfReclamationDataCollector;
        this.currentConditionsAggregator = currentConditionsAggregator;
        this.publishingDao = publishingDao;
    }

    public CurrentConditions dailyDataCollection() {
        List<Lake> lakesToCollect = List.of(makeLakePowellRecord());

        for (Lake lake : lakesToCollect) {
            try {
                CollectorResponse<TimeSeriesData> elevationData = bureauOfReclamationDataCollector.collectData(lake, DataType.ELEVATION);

                CurrentConditions currentConditions = currentConditionsAggregator.aggregateCurrentConditions(elevationData);
                publishingDao.publishCurrentConditions(currentConditions);
                errorAggregator.add("Testing the error aggregator", lake.id());
            } catch (Exception e) {
                errorAggregator.add("Unknown error while collecting data for lakeId: " + lake.id(), e, lake.id());
            }
        }

        publishingDao.publishErrors(errorAggregator.flushErrors());

        return null;
    }

    public Lake makeLakePowellRecord() {
        ArrayList<AccessPoint> southAccess = new ArrayList<>();
        southAccess.add(new AccessPoint("antelope", "Antelope Point Marina", AccessType.MARINA,3700, 3590, "https://maps.app.goo.gl/7Q5Z9"));

        ArrayList<AccessPoint> northAccess = new ArrayList<>();
        northAccess.add(new AccessPoint("bullfrog", "Bullfrog Marina", AccessType.MARINA,3700, 3590, "https://maps.app.goo.gl/7Q5Z9"));

        Map<String, LakeRegion> regions = Map.of(
                "upper", new LakeRegion("upper", "Upper Lake Powell", "The upper region of Lake Powell", northAccess),
                "lower", new LakeRegion("lower", "Lower Lake Powell", "The lower region of Lake Powell", southAccess));

        return new Lake(
                "lake-powell",
                "Lake Powell",
                "Lake Powell is a reservoir on the Colorado River, straddling the border between Utah and Arizona.",
                LocalDate.of(1963, 6, 22),
                "https://maps.app.goo.gl/EHVfByomwz1Pnb5CA",
                3700,
                3590,
                3370,
                new Lake.DataSources(Map.of(
                        DataType.ELEVATION, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/49.json",
                        DataType.INFLOW, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/29.json",
                        DataType.TOTAL_RELEASE, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/42.json",
                        DataType.SPILLWAY_RELEASE, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/46.json",
                        DataType.BYPASS_RELEASE, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/1197.json",
                        DataType.POWER_RELEASE, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/39.json",
                        DataType.EVAPORATION, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/25.json",
                        DataType.ACTIVE_STORAGE, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/17.json",
                        DataType.BANK_STORAGE, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/15.json",
                        DataType.DELTA_STORAGE, "https://www.usbr.gov/uc/water/hydrodata/reservoir_data/919/json/47.json"
                )),
                regions
        );
    }
}
