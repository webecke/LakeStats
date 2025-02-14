package dev.webecke.lakestats.utils;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class Serializer {
    private final Gson gson;

    public Serializer() {
        this.gson = new GsonBuilder()
                // Keep existing date adapters
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (date, type, context) ->
                        new JsonPrimitive(date.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)))
                .registerTypeAdapter(LocalDate.class, (JsonSerializer<LocalDate>) (date, type, context) ->
                        new JsonPrimitive(date.format(DateTimeFormatter.ISO_LOCAL_DATE)))
                .registerTypeAdapter(LocalDateTime.class, (JsonDeserializer<LocalDateTime>) (json, type, context) ->
                        json.getAsString().isEmpty() ? null : LocalDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .registerTypeAdapter(LocalDate.class, (JsonDeserializer<LocalDate>) (json, type, context) ->
                        json.getAsString().isEmpty() ? null : LocalDate.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE))
                // Add integer handling
                .registerTypeAdapter(Integer.class, (JsonDeserializer<Integer>) (json, type, context) -> {
                    if (json.isJsonNull()) return 0;
                    try {
                        return json.getAsInt();
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .registerTypeAdapter(int.class, (JsonDeserializer<Integer>) (json, type, context) -> {
                    if (json.isJsonNull()) return 0;
                    try {
                        return json.getAsInt();
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .registerTypeAdapter(Lake.DataSources.class, (JsonDeserializer<Lake.DataSources>) (json, type, context) -> {
                    Map<DataType, String> sourcesMap = new HashMap<>();
                    JsonObject jsonObject = json.getAsJsonObject();

                    for (Map.Entry<String, JsonElement> entry : jsonObject.entrySet()) {
                        try {
                            DataType dataType = DataType.valueOf(entry.getKey());
                            String url = entry.getValue().getAsString();
                            sourcesMap.put(dataType, url);
                        } catch (IllegalArgumentException e) {
                            System.err.println("Skipping invalid data type: " + entry.getKey());
                        }
                    }

                    return new Lake.DataSources(sourcesMap);
                })
                .create();
    }

    public String serialize(Object object) {
        return gson.toJson(object);
    }

    public <T> T deserialize(String json, Class<T> type) {
        return gson.fromJson(json, type);
    }

    public Map<String, Object> serializeToMap(Object object) {
        Type type = new TypeToken<Map<String, Object>>(){}.getType();
        return gson.fromJson(serialize(object), type);
    }
}
