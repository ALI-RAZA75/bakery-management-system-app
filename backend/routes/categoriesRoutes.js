const express = require('express');
const categoriesController = require('../controllers/categoriesController');
const router = express.Router();

router.get('/', categoriesController.getAllCategories);
router.get('/parent', categoriesController.getParentCategories);
router.get('/:id', categoriesController.getCategories);
router.post('/add', categoriesController.createCategory);
router.put('/:id', categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;