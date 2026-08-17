package com.example.fullstack.service;

import com.example.fullstack.dto.PostRequestDTO;
import com.example.fullstack.dto.PostResponseDTO;

import java.util.List;

public interface PostService {
    PostResponseDTO createPost(PostRequestDTO request);
    PostResponseDTO getPostById(Long id);
    List<PostResponseDTO> getAllPosts();
    PostResponseDTO updatePost(Long id, PostRequestDTO request);
    void deletePost(Long id);
}
