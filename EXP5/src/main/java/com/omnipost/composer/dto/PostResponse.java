package com.omnipost.composer.dto;

import com.omnipost.composer.model.Platform;
import com.omnipost.composer.model.Post;
import com.omnipost.composer.model.PostStatus;
import java.time.LocalDateTime;

public class PostResponse {

    private Long id;
    private Platform platform;
    private String content;
    private int wordCount;
    private int wordLimit;
    private PostStatus status;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse fromEntity(Post post) {
        PostResponse response = new PostResponse();
        response.id = post.getId();
        response.platform = post.getPlatform();
        response.content = post.getContent();
        response.wordCount = countWords(post.getContent());
        response.wordLimit = post.getPlatform().getWordLimit();
        response.status = post.getStatus();
        response.scheduledAt = post.getScheduledAt();
        response.createdAt = post.getCreatedAt();
        response.updatedAt = post.getUpdatedAt();
        return response;
    }

    private static int countWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }

    // Getters

    public Long getId() {
        return id;
    }

    public Platform getPlatform() {
        return platform;
    }

    public String getContent() {
        return content;
    }

    public int getWordCount() {
        return wordCount;
    }

    public int getWordLimit() {
        return wordLimit;
    }

    public PostStatus getStatus() {
        return status;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
