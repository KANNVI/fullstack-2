package com.omnipost.composer.service.impl;

import com.omnipost.composer.dto.PostRequest;
import com.omnipost.composer.dto.PostResponse;
import com.omnipost.composer.exception.ResourceNotFoundException;
import com.omnipost.composer.exception.WordLimitExceededException;
import com.omnipost.composer.model.Post;
import com.omnipost.composer.model.PostStatus;
import com.omnipost.composer.repository.PostRepository;
import com.omnipost.composer.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private static final Logger log = LoggerFactory.getLogger(PostServiceImpl.class);

    private final PostRepository postRepository;

    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public PostResponse createPost(PostRequest request) {
        validateWordLimit(request.getContent(), request.getPlatform().getWordLimit(), request.getPlatform().name());

        Post post = new Post();
        post.setPlatform(request.getPlatform());
        post.setContent(request.getContent());
        post.setScheduledAt(request.getScheduledAt());
        post.setStatus(request.getScheduledAt() != null ? PostStatus.SCHEDULED : PostStatus.DRAFT);

        Post saved = postRepository.save(post);
        log.info("Created post id={} for platform={}", saved.getId(), saved.getPlatform());
        return PostResponse.fromEntity(saved);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    @Override
    public PostResponse getPostById(Long id) {
        Post post = findPostOrThrow(id);
        return PostResponse.fromEntity(post);
    }

    @Override
    public PostResponse updatePost(Long id, PostRequest request) {
        Post post = findPostOrThrow(id);
        validateWordLimit(request.getContent(), request.getPlatform().getWordLimit(), request.getPlatform().name());

        post.setPlatform(request.getPlatform());
        post.setContent(request.getContent());
        post.setScheduledAt(request.getScheduledAt());

        Post updated = postRepository.save(post);
        log.info("Updated post id={}", updated.getId());
        return PostResponse.fromEntity(updated);
    }

    @Override
    public void deletePost(Long id) {
        Post post = findPostOrThrow(id);
        postRepository.delete(post);
        log.info("Deleted post id={}", id);
    }

    @Override
    public PostResponse schedulePost(Long id, LocalDateTime scheduledAt) {
        Post post = findPostOrThrow(id);
        post.setScheduledAt(scheduledAt);
        post.setStatus(PostStatus.SCHEDULED);
        Post saved = postRepository.save(post);
        log.info("Scheduled post id={} for {}", id, scheduledAt);
        return PostResponse.fromEntity(saved);
    }

    private Post findPostOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    private void validateWordLimit(String content, int limit, String platformName) {
        int wordCount = content.trim().isEmpty() ? 0 : content.trim().split("\\s+").length;
        if (wordCount > limit) {
            throw new WordLimitExceededException(
                    String.format("Content has %d words, exceeding the %d word limit for %s", wordCount, limit, platformName));
        }
    }
}
