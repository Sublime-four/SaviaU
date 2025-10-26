package com.sabiau.newsapi.news.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsRequestDto {
    private String title;
    private String description;
    private String videoUrl;     // Supabase public URL
    private String imageUrl;     // Supabase public URL
    private String referenceUrl;
}
