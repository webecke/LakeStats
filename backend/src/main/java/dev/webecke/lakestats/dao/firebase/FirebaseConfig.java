package dev.webecke.lakestats.dao.firebase;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.cloud.FirestoreClient;
import dev.webecke.lakestats.aggregator.ErrorAggregator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.stream.Collectors;

@Configuration
public class FirebaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @PostConstruct
    public void logEnvironment() {
        logger.info("Environment variables present: " +
                System.getenv().keySet().stream()
                        .collect(Collectors.joining(", ")));
    }

    @Value("${spring.profiles.active:prod}")
    private String activeProfile;

    @Value("${FIREBASE_CREDENTIALS}")
    private String firebaseCredentials;

    private final ErrorAggregator errorAggregator;

    public FirebaseConfig(ErrorAggregator errorAggregator) {
        this.errorAggregator = errorAggregator;
    }

    @Bean
    public Firestore firestore() throws IOException {
        try {
            logger.info("==== Starting Firestore initialization ====");
            GoogleCredentials credentials;

            // Add this check for credentials
            if (!firebaseCredentials.isEmpty()) {
                // Use environment variable in Cloud Run
                credentials = GoogleCredentials
                        .fromStream(new ByteArrayInputStream(firebaseCredentials.getBytes()));
                System.out.println("Using Firebase credentials from environment");
            } else {
                // Use file locally
                InputStream serviceAccount = getClass().getResourceAsStream("/firebase-key.json");
                credentials = GoogleCredentials.fromStream(serviceAccount);
                System.out.println("Using Firebase credentials from file");
            }

            logger.info("Credentials length: " + firebaseCredentials.length());
            logger.info("First 20 chars: " + firebaseCredentials.substring(0, 20));


            FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder()
                    .setCredentials(credentials);

            // Your existing profile logic
            if ("dev".equals(activeProfile)) {
                optionsBuilder.setFirestoreOptions(
                        FirestoreOptions.newBuilder()
                                .setDatabaseId("development")
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
