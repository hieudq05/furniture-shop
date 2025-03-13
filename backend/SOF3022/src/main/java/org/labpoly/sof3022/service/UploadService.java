package org.labpoly.sof3022.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class UploadService {

    private static final String UPLOAD_DIR = "uploads/";

    public Path generateExistedFolderUpload() throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }
        return uploadPath;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = generateExistedFolderUpload().resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "http://localhost:8080/" + UPLOAD_DIR + fileName;
    }
}
