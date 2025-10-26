package com.sabiau.newsapi.news.service;

import com.sabiau.newsapi.common.exceptions.BadRequestException;
import com.sabiau.newsapi.common.exceptions.ResourceNotFoundException;
import com.sabiau.newsapi.news.dto.NewsRequestDto;
import com.sabiau.newsapi.news.dto.NewsResponseDto;
import com.sabiau.newsapi.news.model.NewsModel;
import com.sabiau.newsapi.news.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsResponseDto createNews(NewsRequestDto dto) {

        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new BadRequestException("El título no puede estar vacío.");
        }

        if (dto.getDescription() == null || dto.getDescription().isBlank()) {
            throw new BadRequestException("La descripción es obligatoria.");
        }

        if (dto.getVideoUrl() == null && dto.getImageUrl() == null) {
            throw new BadRequestException("Debes incluir al menos un video o una imagen para la noticia.");
        }

        NewsModel news = NewsModel.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .videoUrl(dto.getVideoUrl())
                .imageUrl(dto.getImageUrl())
                .referenceUrl(dto.getReferenceUrl())
                .build();

        NewsModel saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    public List<NewsResponseDto> getNewsPage(LocalDateTime cursor, int limit) {
        if (limit <= 0 || limit > 50) {
            throw new BadRequestException("El parámetro 'limit' debe estar entre 1 y 50.");
        }

        List<NewsModel> newsList = newsRepository.findNewsPage(cursor, PageRequest.of(0, limit));

        if (newsList.isEmpty()) {
            throw new ResourceNotFoundException("No hay noticias disponibles en este momento.");
        }

        return newsList.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private NewsResponseDto mapToDto(NewsModel news) {
        return NewsResponseDto.builder()
                .id(news.getId())
                .title(news.getTitle())
                .description(news.getDescription())
                .videoUrl(news.getVideoUrl())
                .imageUrl(news.getImageUrl())
                .referenceUrl(news.getReferenceUrl())
                .createdAt(news.getCreatedAt())
                .build();
    }
}
