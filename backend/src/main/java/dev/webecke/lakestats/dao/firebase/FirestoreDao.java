package dev.webecke.lakestats.dao.firebase;

import com.google.cloud.firestore.DocumentReference;
import dev.webecke.lakestats.dao.DataAccessException;
import dev.webecke.lakestats.dao.DatabaseAccess;
import dev.webecke.lakestats.model.HistoricalPeriodData;
import dev.webecke.lakestats.model.RunLakeCollectorResult;
import dev.webecke.lakestats.model.features.CurrentConditions;

import com.google.cloud.firestore.Firestore;
import dev.webecke.lakestats.model.LakeSystemSettings;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.utils.Serializer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FirestoreDao implements DatabaseAccess {
    public static final String SYSTEM_ERRORS_ID = "system-errors";
    public static final String GENERAL_ID = "system";
    public static final String LAKE_INFO_ID = "lake-info";

    private final Firestore firestore;
    private final Serializer serializer;

    public FirestoreDao(Firestore firestore, Serializer serializer) {
        this.firestore = firestore;
        this.serializer = serializer;
    }

    @Override
    public void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException {
        try {
            firestore.collection(conditions.lakeId()).document("current_conditions").set(serializer.serializeToMap(conditions));
        } catch (Exception e) {
            throw new DataAccessException("Failed to publish current conditions for " + conditions.lakeId(), e);
        }
    }

    @Override
    public void publishLakeInfo(Lake lake) throws DataAccessException {
        firestore.collection(lake.id()).document(LAKE_INFO_ID).set(serializer.serializeToMap(lake));
    }


    public List<String> getAllLakeIds() throws DataAccessException {
        try {
            List<String> lakeIds = new ArrayList<>();
            Iterable<DocumentReference> documents = firestore.collection(GENERAL_ID).listDocuments();

            for (DocumentReference doc : documents) {
                lakeIds.add(doc.getId());
            }

            return lakeIds;
        } catch (Exception e) {
            throw new DataAccessException("Failed to fetch lake IDs", e);
        }
    }

    public LakeSystemSettings getLakeSystemSettings(String lakeId) throws DataAccessException {
        try {
            var documentSnapshot = firestore.collection(GENERAL_ID)
                    .document(lakeId)
                    .get()
                    .get(); // blocking call to get()

            if (!documentSnapshot.exists()) {
                return null;
            }

            return serializer.deserialize(
                    serializer.serialize(documentSnapshot.getData()),
                    LakeSystemSettings.class
            );
        } catch (Exception e) {
            throw new DataAccessException("Failed to fetch lake system settings for " + lakeId, e);
        }
    }

    public Lake getLakeDetails(String lakeId) throws DataAccessException {
        try {
            var documentSnapshot = firestore.collection(lakeId)
                    .document(LAKE_INFO_ID)
                    .get()
                    .get(); // blocking call to get()

            if (!documentSnapshot.exists()) {
                return null;
            }

            return serializer.deserialize(
                    serializer.serialize(documentSnapshot.getData()),
                    Lake.class
            );
        } catch (Exception e) {
            throw new DataAccessException("Failed to fetch lake details for " + lakeId, e);
        }
    }

    @Override
    public void publishLastRunResult(RunLakeCollectorResult result) throws DataAccessException {
        try {
            firestore.collection(result.lakeId()).document("last_run_result").set(serializer.serializeToMap(result));
        } catch (Exception e) {
            throw new DataAccessException("Failed to publish last run result for " + result.lakeId(), e);
        }
    }

    @Override
    public void publishPast365Days(HistoricalPeriodData data) throws DataAccessException {
        try {
            firestore.collection(data.lakeId()).document("past_365_days").set(serializer.serializeToMap(data));
        } catch (Exception e) {
            throw new DataAccessException("Failed to publish past 365 dats for " + data.lakeId(), e);
        }
    }

    @Override
    public RunLakeCollectorResult getLastRunResult(String lakeId) throws DataAccessException {
        try {
            var documentSnapshot = firestore.collection(lakeId)
                    .document("last_run_result")
                    .get()
                    .get(); // blocking call to get()

            if (!documentSnapshot.exists()) {
                return null;
            }

            return serializer.deserialize(
                    serializer.serialize(documentSnapshot.getData()),
                    RunLakeCollectorResult.class
            );
        } catch (Exception e) {
            throw new DataAccessException("Failed to fetch last run result for " + lakeId, e);
        }
    }
}
