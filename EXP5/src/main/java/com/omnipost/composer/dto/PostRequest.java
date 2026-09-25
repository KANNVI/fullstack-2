package com.omnipost.composer.dto;

import com.omnipost.composer.model.Platform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class PostRequest {

    @NotNull(message = "Platform is required")
    private Platform platform;

    @NotBlank(message = "Content must not be blank")
    @Size(max = 3000, message = "Content must not exceed 3000 characters")
    private String content;

    private LocalDateTime scheduledAt;

    public PostRequest() {
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }
}
