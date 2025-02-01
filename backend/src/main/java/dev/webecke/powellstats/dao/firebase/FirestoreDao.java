package dev.webecke.powellstats.dao.firebase;

import dev.webecke.powellstats.dao.DataAccessException;
import dev.webecke.powellstats.dao.PublishingDao;
import dev.webecke.powellstats.model.CurrentConditions;

import com.google.cloud.firestore.Firestore;
import dev.webecke.powellstats.model.SystemError;
import dev.webecke.powellstats.utils.Serializer;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FirestoreDao implements PublishingDao {
    public static final String SYSTEM_ERRORS_ID = "system-errors";
    public static final String GENERAL_ID = "general";

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
    public void publishErrors(List<SystemError> errors) throws DataAccessException {
        Map<String, List<SystemError>> errorsByLake = errors.stream()
                .collect(Collectors.groupingBy(
                        SystemError::lakeId
                ));

        // Get timestamp for archiving
        String timestamp = LocalDateTime.now().toString();

        errorsByLake.forEach((lakeId, lakeErrors) -> {
            Map<String, Object> errorData = Map.of("errors", lakeErrors);

            // First, move 'recent' to archived
            firestore.collection(SYSTEM_ERRORS_ID)
                    .document(timestamp)
                    .collection(lakeId)  // new collection named with timestamp
                    .document("errors")
                    .set(serializer.serializeToMap(errorData));

            // Then clear and update 'recent'
            firestore.collection(SYSTEM_ERRORS_ID)
                    .document("recent")
                    .collection(lakeId)
                    .document("errors")
                    .set(serializer.serializeToMap(errorData));
        });
    }
}
