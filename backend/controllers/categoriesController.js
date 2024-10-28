const categoriesModel = require('../models/categoriesModel');

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const getParentCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.getParentCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    res.status(500).json({ message: 'Error fetching parent categories', error: error.message });
  }
};


const getCategories = async (req, res) => {
    try {
      const categoriesId = parseInt(req.params.id, 10);
  
      if (isNaN(categoriesId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const categories = await categoriesModel.getCategoriesById(categoriesId);
      if (!categories) {
        return res.status(404).json({ message: 'Categories not found' });
      }
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching Categories:', error);
      res.status(500).json({ message: 'Error fetching Categories', error: error.message });
    }
  };


  const createCategory = async (req, res) => {
    try {
      await categoriesModel.createCategory(req.body);
      res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'Error adding category', error: error.message });
    }
  };


  const updateCategory = async (req, res) => {
    try {
      const updatedCategory = await categoriesModel.updateCategory(req.params.id, req.body);
      res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    } catch (error) {
      console.error('Error updating Category:', error);
      res.status(500).json({ message: 'Error updating Category', error: error.message });
    }
  };

  const deleteCategory = async (req, res) => {
    try {
      await categoriesModel.deleteCategory(req.params.id);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting Category:', error);
      res.status(500).json({ message: 'Error deleting Category', error: error.message });
    }
  };


module.exports = {
    getAllCategories,
    getCategories,
    createCategory,
    getParentCategories,
    updateCategory,
    deleteCategory
  };