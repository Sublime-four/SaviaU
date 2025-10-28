package com.sabiau.newsapi.news.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class NewsResponseDto {
    private Long id;
    private String title;
    private String description;
    private String referenceUrl;
    private List<String> imageUrls;
    private String videoUrl;
    private LocalDateTime createdAt;
}
