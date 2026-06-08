package com.example.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );

        return uploadResult.get("secure_url").toString();
    }

    public void deleteFile(String imageUrl) throws IOException {

        String publicId = extractPublicId(imageUrl);

        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.emptyMap()
        );
    }

    private String extractPublicId(String imageUrl) {

        String[] parts = imageUrl.split("/");

        String fileName = parts[parts.length - 1];

        return fileName.substring(
                0,
                fileName.lastIndexOf(".")
        );
    }
}