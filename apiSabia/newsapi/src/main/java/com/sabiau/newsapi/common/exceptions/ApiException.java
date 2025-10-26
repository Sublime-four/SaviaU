package com.sabiau.newsapi.common.exceptions;

import lombok.*;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiException {
    private String message;
    private HttpStatus status;
    private LocalDateTime timestamp;
    private String path;
}