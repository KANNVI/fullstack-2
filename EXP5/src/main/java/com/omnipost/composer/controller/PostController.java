package com.omnipost.composer.controller;

import com.omnipost.composer.dto.ApiResponse;
import com.omnipost.composer.dto.PostRequest;
import com.omnipost.composer.dto.PostResponse;
import com.omnipost.composer.model.Platform;
import com.omnipost.composer.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ApiResponse<PostResponse> createPost(@Valid @RequestBody PostRequest request) {
        PostResponse response = postService.createPost(request);
        return ApiResponse.success("Post created successfully", response);
    }

    @GetMapping
    public ApiResponse<List<PostResponse>> getAllPosts() {
        return ApiResponse.success(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPostById(@PathVariable Long id) {
        return ApiResponse.success(postService.getPostById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<PostResponse> updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest request) {
        PostResponse response = postService.updatePost(id, request);
        return ApiResponse.success("Post updated successfully", response);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ApiResponse.success("Post deleted successfully", null);
    }

    @PutMapping("/{id}/schedule")
    public ApiResponse<PostResponse> schedulePost(@PathVariable Long id, @RequestBody Map<String, String> body) {
        LocalDateTime scheduledAt = LocalDateTime.parse(body.get("scheduledAt"));
        PostResponse response = postService.schedulePost(id, scheduledAt);
        return ApiResponse.success("Post scheduled successfully", response);
    }

    @GetMapping("/platforms")
    public ApiResponse<List<Map<String, Object>>> getPlatforms() {
        List<Map<String, Object>> platforms = Arrays.stream(Platform.values())
                .map(p -> Map.<String, Object>of("name", p.name(), "wordLimit", p.getWordLimit()))
                .collect(Collectors.toList());
        return ApiResponse.success(platforms);
    }
}
