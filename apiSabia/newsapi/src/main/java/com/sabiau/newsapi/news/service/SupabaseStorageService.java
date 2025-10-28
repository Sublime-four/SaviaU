package com.sabiau.newsapi.news.service;

import com.sabiau.newsapi.common.config.SupabaseConfig;
import com.sabiau.newsapi.common.exceptions.FileUploadException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    private final SupabaseConfig supabaseConfig;
    private final WebClient supabaseWebClient;



    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/webp");
    private static final List<String> ALLOWED_VIDEO_TYPES = List.of("video/mp4", "video/webm", "video/ogg");
    private static final long MAX_FILE_SIZE_MB = 20;
    private static final int MAX_VIDEO_DURATION_SEC = 60;


    public String uploadFile(MultipartFile file) {
        validateFile(file);

        boolean isVideo = ALLOWED_VIDEO_TYPES.contains(file.getContentType());
        String bucket = isVideo ? supabaseConfig.getVideosBucket() : supabaseConfig.getImagesBucket();
        String fileName = UUID.randomUUID() + "_" + Objects.requireNonNull(file.getOriginalFilename());
        String uploadUrl = supabaseConfig.getSupabaseUrl() + "/storage/v1/object/" + bucket + "/" + fileName;

        try {
            String response = supabaseWebClient.post()
                    .uri(uploadUrl)
                    .header("Authorization", "Bearer " + supabaseConfig.getSupabaseKey())
                    .header("apikey", supabaseConfig.getSupabaseKey())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .bodyValue(file.getBytes())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, r -> r.bodyToMono(String.class)
                            .map(body -> new RuntimeException("Supabase error: " + body)))
                    .bodyToMono(String.class)
                    .block();

            return supabaseConfig.getPublicUrlBase() + bucket + "/" + fileName;

        } catch (Exception e) {
            System.err.println("Error completo de Supabase:");
            e.printStackTrace();

            if (e.getCause() != null)
                System.err.println("➡️ Causa raíz: " + e.getCause().getMessage());

            throw new FileUploadException("Error al subir el archivo a Supabase: " + e.getMessage(), e);
        }
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null)
            throw new FileUploadException("El archivo no tiene un tipo MIME válido");

        long sizeMB = file.getSize() / (1024 * 1024);
        if (sizeMB > MAX_FILE_SIZE_MB)
            throw new FileUploadException("El archivo supera el tamaño máximo de " + MAX_FILE_SIZE_MB + " MB");

        boolean isImage = ALLOWED_IMAGE_TYPES.contains(contentType);
        boolean isVideo = ALLOWED_VIDEO_TYPES.contains(contentType);

        if (!isImage && !isVideo)
            throw new FileUploadException("Tipo de archivo no permitido: " + contentType);

        if (isVideo)
            validateVideoDuration(file);
    }

    private void validateVideoDuration(MultipartFile file) {
        File tempFile = null;
        try {
            tempFile = File.createTempFile("video_", ".mp4");
            try (OutputStream os = new FileOutputStream(tempFile)) {
                os.write(file.getBytes()); // 👈 copiamos los bytes del archivo al temporal
            }

            ProcessBuilder builder = new ProcessBuilder(
                    "ffprobe", "-v", "error",
                    "-show_entries", "format=duration",
                    "-of", "default=noprint_wrappers=1:nokey=1",
                    tempFile.getAbsolutePath()
            );

            Process process = builder.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String durationStr = reader.readLine();
                process.waitFor();

                if (durationStr != null) {
                    double durationSec = Double.parseDouble(durationStr.trim());
                    if (durationSec > MAX_VIDEO_DURATION_SEC) {
                        throw new FileUploadException(
                                "El video excede la duración máxima de " + MAX_VIDEO_DURATION_SEC + " segundos");
                    }
                }
            }

        } catch (Exception e) {
            throw new FileUploadException("Error al validar la duración del video: " + e.getMessage());
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }


    public void deleteFile(String bucketName, String fileName) {
        String deleteUrl = supabaseConfig.getStorageBaseUrl() + "/" + bucketName + "/" + fileName;

        supabaseWebClient.delete()
                .uri(deleteUrl)
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(err -> {
                    throw new FileUploadException("Error al eliminar el archivo: " + err.getMessage());
                })
                .block();
    }
}
