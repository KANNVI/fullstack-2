package com.example.fullstack.service.impl;

import com.example.fullstack.dto.PostRequestDTO;
import com.example.fullstack.dto.PostResponseDTO;
import com.example.fullstack.entity.Post;
import com.example.fullstack.exception.BusinessRuleException;
import com.example.fullstack.exception.ResourceNotFoundException;
import com.example.fullstack.repository.PostRepository;
import com.example.fullstack.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Override
    @Transactional
    public PostResponseDTO createPost(PostRequestDTO request) {
        log.info("Creating post with title='{}'", request.getTitle());

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(request.getAuthor())
                .scheduledAt(request.getScheduledAt())
                .build();

        Post saved = postRepository.save(post);
        log.info("Post created with id={}", saved.getId());
        return toResponseDTO(saved);
    }

    @Override
    public PostResponseDTO getPostById(Long id) {
        log.debug("Fetching post id={}", id);
        Post post = findByIdOrThrow(id);
        return toResponseDTO(post);
    }

    @Override
    public List<PostResponseDTO> getAllPosts() {
        log.debug("Fetching all posts");
        return postRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public PostResponseDTO updatePost(Long id, PostRequestDTO request) {
        log.info("Updating post id={}", id);
        Post post = findByIdOrThrow(id);

        if (request.getScheduledAt() != null && post.getCreatedAt() != null
                && request.getScheduledAt().isBefore(post.getCreatedAt())) {
            // demonstrates a custom business-rule exception handled globally
            throw new BusinessRuleException("scheduledAt cannot be before the post's creation time");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        post.setScheduledAt(request.getScheduledAt());

        Post updated = postRepository.save(post);
        log.info("Post id={} updated", updated.getId());
        return toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        log.info("Deleting post id={}", id);
        Post post = findByIdOrThrow(id);
        postRepository.delete(post);
        log.info("Post id={} deleted", id);
    }

    private Post findByIdOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    private PostResponseDTO toResponseDTO(Post post) {
        return PostResponseDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .scheduledAt(post.getScheduledAt())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
