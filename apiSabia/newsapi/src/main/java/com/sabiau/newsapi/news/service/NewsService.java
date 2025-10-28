package com.sabiau.newsapi.news.service;

import com.sabiau.newsapi.common.exceptions.BadRequestException;
import com.sabiau.newsapi.news.dto.NewsRequestDto;
import com.sabiau.newsapi.news.dto.NewsResponseDto;
import com.sabiau.newsapi.news.model.NewsModel;
import com.sabiau.newsapi.news.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final SupabaseStorageService supabaseStorageService;

    /**
     * Crea una noticia y sube archivos (varias imágenes o un video).
     */
    public NewsResponseDto createNews(NewsRequestDto dto, List<MultipartFile> images, MultipartFile video) {

        validateNews(dto, images, video);

        List<String> imageUrls = new ArrayList<>();
        String videoUrl = null;

        // Subir imágenes (si no hay video)
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String url = supabaseStorageService.uploadFile(image);
                imageUrls.add(url);
            }
        }

        // Subir video (si no hay imágenes)
        if (video != null && !video.isEmpty()) {
            videoUrl = supabaseStorageService.uploadFile(video);
        }

        NewsModel news = NewsModel.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .referenceUrl(dto.getReferenceUrl())
                .imageUrls(imageUrls)
                .videoUrl(videoUrl)
                .createdAt(LocalDateTime.now())
                .build();

        NewsModel saved = newsRepository.save(news);
        return mapToDto(saved);
    }

    /**
     * Paginación cursor-based de noticias.
     */
    public List<NewsResponseDto> getNewsPage(LocalDateTime cursor, int limit) {
        if (limit <= 0 || limit > 50) {
            throw new BadRequestException("El parámetro 'limit' debe estar entre 1 y 50.");
        }

        var newsList = (cursor == null)
                ? newsRepository.findAllOrderByCreatedAtDesc(PageRequest.of(0, limit))
                : newsRepository.findNewsBeforeCursor(cursor, PageRequest.of(0, limit));

        return newsList.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Validaciones de campos y archivos.
     */
    private void validateNews(NewsRequestDto dto, List<MultipartFile> images, MultipartFile video) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new BadRequestException("El título no puede estar vacío.");
        }

        if (dto.getDescription() == null || dto.getDescription().isBlank()) {
            throw new BadRequestException("La descripción es obligatoria.");
        }

        boolean hasImages = images != null && !images.isEmpty();
        boolean hasVideo = video != null && !video.isEmpty();

        if (!hasImages && !hasVideo) {
            throw new BadRequestException("Debes incluir al menos una imagen o un video para la noticia.");
        }

        if (hasImages && hasVideo) {
            throw new BadRequestException("No puedes subir imágenes y video al mismo tiempo.");
        }
    }

    /**
     * Convierte el modelo en DTO de respuesta.
     */
    private NewsResponseDto mapToDto(NewsModel news) {
        return NewsResponseDto.builder()
                .id(news.getId())
                .title(news.getTitle())
                .description(news.getDescription())
                .referenceUrl(news.getReferenceUrl())
                .imageUrls(news.getImageUrls())
                .videoUrl(news.getVideoUrl())
                .createdAt(news.getCreatedAt())
                .build();
    }

    public NewsResponseDto getNewsById(Long id) {
        return newsRepository.findById(id).map(this::mapToDto).orElse(null);
    }

}
