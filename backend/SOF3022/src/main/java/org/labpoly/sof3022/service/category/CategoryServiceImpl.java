package org.labpoly.sof3022.service.category;

import org.labpoly.sof3022.model.Category;
import org.labpoly.sof3022.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepository.findCategoryById(id);
    }

    @Override
    public List<Category> getCategoriesByName(String name) {
        return categoryRepository.findCategoryByName(name);
    }

    @Override
    public List<Category> getCategoriesLikeName(String name) {
        return categoryRepository.findCategoryByNameLike(name);
    }

    @Override
    public List<Category> getCategoriesByDescription(String description) {
        return categoryRepository.findCategoryByDescription(description);
    }

    @Override
    public List<Category> getCategoriesLikeDescription(String description) {
        return categoryRepository.findCategoryByDescriptionLike(description);
    }

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Integer deleteCategoryById(Integer id) {
        return categoryRepository.deleteCategoryById(id);
    }

}
