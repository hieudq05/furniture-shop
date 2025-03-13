package org.labpoly.sof3022.controller;

import org.labpoly.sof3022.exception.ApiException;
import org.labpoly.sof3022.exception.ErrorCode;
import org.labpoly.sof3022.model.Category;
import org.labpoly.sof3022.dto.ApiResponse;
import org.labpoly.sof3022.service.AuthenticationToken;
import org.labpoly.sof3022.service.UploadService;
import org.labpoly.sof3022.service.category.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/category")
public class CategoryController {

    private final CategoryService categoryService;
    private final UploadService uploadService;
    private final AuthenticationToken authenticationToken;

    public CategoryController(CategoryService categoryService, UploadService uploadService, AuthenticationToken authenticationToken) {
        this.categoryService = categoryService;
        this.uploadService = uploadService;
        this.authenticationToken = authenticationToken;
    }

    @GetMapping("get/all")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("get/{category_id}")
    public Category getCategoryById(@PathVariable("category_id") Integer category_id) {
        return categoryService.getCategoryById(category_id);
    }

    @PutMapping("save")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@RequestPart(name = "imageFile", required = false) MultipartFile imageFile, @ModelAttribute Category category, @RequestHeader("Authorization") String token) {
        String urlImage = null;
        authenticationToken.authenticateCustomer(token);
        if (imageFile != null) {
            try {
                urlImage = uploadService.uploadFile(imageFile);
            } catch (IOException e) {
                throw new ApiException(ErrorCode.UPLOAD_FILE_ERROR);
            }
        } else {
            Category categoryBeforeUpdate = categoryService.getCategoryById(category.getId());
            if (categoryBeforeUpdate == null) {
                throw new ApiException(ErrorCode.CATEGORY_NOT_FOUND);
            }
            category.setImage(categoryBeforeUpdate.getImage());
        }
        category.setImage(urlImage);
        Category categoryAfterUpdate = categoryService.save(category);
        if (categoryAfterUpdate == null) {
            throw new ApiException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return ResponseEntity.ok(ApiResponse.<Category>builder()
                .code("UPDATE_CATEGORY_200")
                .message("Category updated successfully")
                .data(new Category())
                .build());
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<ApiResponse<Integer>> deleteCategoryById(@PathVariable("id") Integer id, @RequestHeader("Authorization") String token) {
        authenticationToken.authenticateCustomer(token);
        Category category = categoryService.getCategoryById(id);
        if (category == null) {
            throw new ApiException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        Integer rowEffected = categoryService.deleteCategoryById(id);
        if (rowEffected == null || rowEffected == 0) {
            throw new ApiException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        return ResponseEntity.ok(ApiResponse.<Integer>builder()
                .code("DELETE_CATEGORY_200")
                .message("Category deleted successfully")
                .data(id)
                .build());
    }
}
