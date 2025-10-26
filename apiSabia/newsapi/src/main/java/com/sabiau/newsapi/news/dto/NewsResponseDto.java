package com.sabiau.newsapi.news.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsResponseDto {
    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private String imageUrl;
    private String referenceUrl;
    private LocalDateTime createdAt;
}
