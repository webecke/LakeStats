package dev.webecke.powellstats.network;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;

@Service
public class NetworkClient {
    private final WebClient webClient;

    public NetworkClient() {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(5 * 1024 * 1024)) // 5MB buffer size
                .build();

        this.webClient = WebClient.builder()
                .exchangeStrategies(strategies)
                .build();
    }
    public JsonNode getRequest(String sourceUrl) throws NetworkException {
        try {
            JsonNode response = webClient.get()
                    .uri(new URI(sourceUrl))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
            return response;
        } catch (Exception e) {
            throw new NetworkException("Failed to fetch data from " + sourceUrl, e);
        }
    }
}
