package com.example.fullstack.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostRequestDTO {

    @NotBlank(message = "Title must not be blank")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Content must not be blank")
    @Size(max = 2000, message = "Content must not exceed 2000 characters")
    private String content;

    @NotBlank(message = "Author must not be blank")
    private String author;

    @Future(message = "scheduledAt must be a future date-time")
    private LocalDateTime scheduledAt;
}
