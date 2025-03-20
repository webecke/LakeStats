package dev.webecke.lakestats.utils;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class Serializer {
    private final Gson gson;

    public Serializer() {
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (date, type, context) ->
                        new JsonPrimitive(date.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)))
                .registerTypeAdapter(LocalDate.class, (JsonSerializer<LocalDate>) (date, type, context) ->
                        new JsonPrimitive(date.format(DateTimeFormatter.ISO_LOCAL_DATE)))
                .registerTypeAdapter(LocalDateTime.class, (JsonDeserializer<LocalDateTime>) (json, type, context) ->
                        json.getAsString().isEmpty() ? null : LocalDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .registerTypeAdapter(LocalDate.class, (JsonDeserializer<LocalDate>) (json, type, context) ->
                        json.getAsString().isEmpty() ? null : LocalDate.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE))
                .registerTypeAdapter(new TypeToken<Map<DataType, String>>(){}.getType(),
                        (JsonDeserializer<Map<DataType, String>>) (json, type, context) -> {
                            Map<DataType, String> map = new HashMap<>();
                            JsonObject jsonObject = json.getAsJsonObject();

                            for (Map.Entry<String, JsonElement> entry : jsonObject.entrySet()) {
                                try {
                                    DataType dataType = DataType.valueOf(entry.getKey());
                                    String url = entry.getValue().getAsString();
                                    map.put(dataType, url);
                                } catch (IllegalArgumentException e) {
                                    System.err.println("Skipping invalid data type: " + entry.getKey());
                                }
                            }
                            return map;
                        })
                .registerTypeAdapter(ZonedDateTime.class, (JsonSerializer<ZonedDateTime>) (date, type, context) ->
                        new JsonPrimitive(date.format(DateTimeFormatter.ISO_ZONED_DATE_TIME)))
                .registerTypeAdapter(ZonedDateTime.class, (JsonDeserializer<ZonedDateTime>) (json, type, context) ->
                        json.getAsString().isEmpty() ? null : ZonedDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_ZONED_DATE_TIME))
                // Add custom exception adapter to access only public fields
                .registerTypeHierarchyAdapter(Throwable.class, new ThrowableSerializer())
                .create();
    }

    // Custom serializer for Throwable classes
    private static class ThrowableSerializer implements JsonSerializer<Throwable> {
        @Override
        public JsonElement serialize(Throwable src, Type typeOfSrc, JsonSerializationContext context) {
            JsonObject result = new JsonObject();

            // Add basic exception information
            result.addProperty("message", src.getMessage());
            result.addProperty("class", src.getClass().getName());

            // Add stack trace as a string array
            JsonArray stackTraceJson = new JsonArray();
            for (StackTraceElement element : src.getStackTrace()) {
                stackTraceJson.add(element.toString());
            }
            result.add("stackTrace", stackTraceJson);

            // Include cause if present (but only one level deep to avoid recursion issues)
            if (src.getCause() != null && src.getCause() != src) {
                JsonObject causeJson = new JsonObject();
                causeJson.addProperty("message", src.getCause().getMessage());
                causeJson.addProperty("class", src.getCause().getClass().getName());
                result.add("cause", causeJson);
            }

            return result;
        }
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

    public Gson getGson() {
        return gson;
    }
}
