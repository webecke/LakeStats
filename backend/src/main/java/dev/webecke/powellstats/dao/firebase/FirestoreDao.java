package dev.webecke.powellstats.dao.firebase;

import dev.webecke.powellstats.dao.DataAccessException;
import dev.webecke.powellstats.dao.PublishingDao;
import dev.webecke.powellstats.model.CurrentConditions;

import com.google.cloud.firestore.Firestore;
import dev.webecke.powellstats.utils.Serializer;
import org.springframework.stereotype.Service;

@Service
public class FirestoreDao implements PublishingDao {
    private final Firestore firestore;
    private final Serializer serializer;

    public FirestoreDao(Firestore firestore, Serializer serializer) {
        this.firestore = firestore;
        this.serializer = serializer;
    }

    @Override
    public void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException {
        firestore.collection(conditions.lake()).document("current_conditions").set(serializer.serializeToMap(conditions));
    }
}
