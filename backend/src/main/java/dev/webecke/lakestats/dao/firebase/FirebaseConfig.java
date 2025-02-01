package dev.webecke.lakestats.dao.firebase;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
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

    public FirebaseConfig() {}

    @Bean
    public Firestore firestore() throws IOException {
        try {
            logger.info("==== Starting Firestore initialization ====");

            GoogleCredentials credentials = GoogleCredentials
                    .fromStream(new ByteArrayInputStream(firebaseCredentials.getBytes()));
            logger.info("Successfully loaded Firebase credentials from environment");

            FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder()
                    .setCredentials(credentials);

            if ("dev".equals(activeProfile)) {
                optionsBuilder.setFirestoreOptions(
                        FirestoreOptions.newBuilder()
                                .setDatabaseId("development")
                                .build()
                );
                logger.info("Starting Firebase in Development Mode");
            } else {
                logger.info("Starting Firebase in Production Mode");
            }

            FirebaseOptions options = optionsBuilder.build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            return FirestoreClient.getFirestore();
        } catch (Exception e) {
            logger.error("Error occurred while initializing Firestore", e);
            throw e;
        }
    }
}
