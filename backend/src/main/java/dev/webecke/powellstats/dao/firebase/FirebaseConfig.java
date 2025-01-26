package dev.webecke.powellstats.dao.firebase;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.cloud.FirestoreClient;
import dev.webecke.powellstats.aggregator.ErrorAggregator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    @Value("${spring.profiles.active:prod}")  // Default to prod if not specified
    private String activeProfile;

    private final ErrorAggregator errorAggregator;

    public FirebaseConfig(ErrorAggregator errorAggregator) {
        this.errorAggregator = errorAggregator;
    }

    @Bean
    public Firestore firestore() throws IOException {
        try {
            InputStream serviceAccount = getClass().getResourceAsStream("/firebase-key.json");
            GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);

            FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder()
                    .setCredentials(credentials);

            // Set database based on profile
            if ("dev".equals(activeProfile)) {
                optionsBuilder.setFirestoreOptions(
                        FirestoreOptions.newBuilder()
                                .setDatabaseId("development")  // Use dev database
                                .build()
                );
                System.out.println("Starting Firebase in Development Mode");
            } else {
                System.out.println("Starting Firebase in Production Mode");
            }

            FirebaseOptions options = optionsBuilder.build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            return FirestoreClient.getFirestore();
        } catch (Exception e) {
            errorAggregator.add("Error occurred while initializing Firestore", e);
            System.out.println("Error occurred while initializing Firestore: " + e.getMessage());
            throw e;
        }
    }
}
