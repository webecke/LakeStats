package dev.webecke.lakestats.dao.firebase;

import com.google.cloud.firestore.DocumentReference;
import dev.webecke.lakestats.dao.DataAccessException;
import dev.webecke.lakestats.dao.DatabaseAccess;
import dev.webecke.lakestats.model.features.CurrentConditions;

import com.google.cloud.firestore.Firestore;
import dev.webecke.lakestats.model.LakeSystemSettings;
import dev.webecke.lakestats.model.SystemError;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.utils.Serializer;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        firestore.collection(conditions.lakeId()).document("current_conditions").set(serializer.serializeToMap(conditions));
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
}
