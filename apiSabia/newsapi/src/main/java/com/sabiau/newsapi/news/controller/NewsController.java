package com.sabiau.newsapi.news.controller;

import com.sabiau.newsapi.news.dto.NewsRequestDto;
import com.sabiau.newsapi.news.dto.NewsResponseDto;
import com.sabiau.newsapi.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    /**
     * Crea una nueva noticia con imágenes y un video opcional.
     */
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<NewsResponseDto> createNews(
            @RequestPart("data") NewsRequestDto newsRequest,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "video", required = false) MultipartFile video) {

        NewsResponseDto createdNews = newsService.createNews(newsRequest, images, video);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNews);
    }

    /**
     * Obtiene noticias usando paginación basada en cursor.
     *
     * @param cursor Fecha de creación de la última noticia recibida (opcional).
     * @param limit Cantidad máxima de resultados (por defecto: 10).
     */
    @GetMapping
    public ResponseEntity<List<NewsResponseDto>> getNews(
            @RequestParam(required = false) LocalDateTime cursor,
            @RequestParam(defaultValue = "10") int limit) {

        List<NewsResponseDto> newsList = newsService.getNewsPage(cursor, limit);
        return ResponseEntity.ok(newsList);
    }

    /**
     * Obtiene una noticia específica por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDto> getNewsById(@PathVariable Long id) {
        NewsResponseDto news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    /**

     * Elimina una noticia por ID.

    // @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    */
}
