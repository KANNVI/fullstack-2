package com.omnipost.composer.service;

import com.omnipost.composer.dto.PostRequest;
import com.omnipost.composer.dto.PostResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface PostService {

    PostResponse createPost(PostRequest request);

    List<PostResponse> getAllPosts();

    PostResponse getPostById(Long id);

    PostResponse updatePost(Long id, PostRequest request);

    void deletePost(Long id);

    PostResponse schedulePost(Long id, LocalDateTime scheduledAt);
}
