package com.sabiau.newsapi.news.controller;

import com.sabiau.newsapi.news.dto.NewsRequestDto;
import com.sabiau.newsapi.news.dto.NewsResponseDto;
import com.sabiau.newsapi.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsResponseDto>> getNews(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime cursor,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(newsService.getNewsPage(cursor, limit));
    }

    @PostMapping
    public ResponseEntity<NewsResponseDto> createNews(@RequestBody NewsRequestDto dto) {
        return ResponseEntity.ok(newsService.createNews(dto));
    }
}