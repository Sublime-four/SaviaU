package com.sabiau.newsapi.news.repository;

import com.sabiau.newsapi.news.model.NewsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NewsRepository extends JpaRepository<NewsModel, Long> {

    @Query("SELECT n FROM NewsModel n ORDER BY n.createdAt DESC")
    List<NewsModel> findAllOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT n FROM NewsModel n WHERE n.createdAt < :cursor ORDER BY n.createdAt DESC")
    List<NewsModel> findNewsBeforeCursor(@Param("cursor") LocalDateTime cursor, org.springframework.data.domain.Pageable pageable);
}
