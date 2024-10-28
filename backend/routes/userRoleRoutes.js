const express = require('express');
const userRoleController = require('../controllers/userRoleController');
const router = express.Router();

router.get('/', userRoleController.getUserRole);
router.get('/:id', userRoleController.getUserRoleById);
router.post('/add', userRoleController.createUserRole);
router.put('/:id', userRoleController.updateUserRole);
router.delete('/:id', userRoleController.deleteUserRole);

module.exports = router;
