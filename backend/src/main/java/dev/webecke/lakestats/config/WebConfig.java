package dev.webecke.lakestats.config;

import dev.webecke.lakestats.utils.Serializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Serializer serializer;

    @Autowired
    public WebConfig(Serializer serializer) {
        this.serializer = serializer;
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        // Clear existing converters to avoid conflicts (optional)
        converters.clear();

        // Create Gson HTTP message converter that uses your custom serializer
        GsonHttpMessageConverter gsonConverter = new GsonHttpMessageConverter();
        gsonConverter.setGson(serializer.getGson());

        // Add it as the primary converter
        converters.add(gsonConverter);
    }
}
