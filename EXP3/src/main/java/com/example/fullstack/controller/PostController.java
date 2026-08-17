package com.example.fullstack.controller;

import com.example.fullstack.dto.ApiResponse;
import com.example.fullstack.dto.PostRequestDTO;
import com.example.fullstack.dto.PostResponseDTO;
import com.example.fullstack.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.fullstack.filter.CorrelationIdFilter.MDC_KEY;

/**
 * Experiment 2.1.1: resource-based CRUD API for posts, following standard REST
 * conventions (GET/POST/PUT/DELETE on /api/posts) with validated request bodies
 * and a standardized ApiResponse envelope for every response.
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    private String correlationId() {
        String id = MDC.get(MDC_KEY);
        return id != null ? id : "N/A";
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponseDTO>> createPost(@Valid @RequestBody PostRequestDTO request) {
        PostResponseDTO created = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created successfully", created, correlationId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponseDTO>> getPost(@PathVariable Long id) {
        PostResponseDTO post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.success("Post retrieved successfully", post, correlationId()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponseDTO>>> getAllPosts() {
        List<PostResponseDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(ApiResponse.success("Posts retrieved successfully", posts, correlationId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponseDTO>> updatePost(@PathVariable Long id,
                                                                     @Valid @RequestBody PostRequestDTO request) {
        PostResponseDTO updated = postService.updatePost(id, request);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", updated, correlationId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null, correlationId()));
    }
}
