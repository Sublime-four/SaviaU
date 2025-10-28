package com.sabiau.newsapi.common.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;


@Getter
@Configuration
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket.images}")
    private String imagesBucket;

    @Value("${supabase.bucket.videos}")
    private String videosBucket;


    public String getStorageBaseUrl() {
        return supabaseUrl + "/storage/v1/object";
    }

    public String getPublicUrlBase() {
        return supabaseUrl + "/storage/v1/object/public/";
    }


    @Bean
    public WebClient supabaseWebClient() {
        return WebClient.builder()
                .baseUrl(getStorageBaseUrl())
                .defaultHeader("apikey", supabaseKey)
                .defaultHeader("Authorization", "Bearer " + supabaseKey)
                .build();
    }
}
