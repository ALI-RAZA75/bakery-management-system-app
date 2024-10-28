const express = require('express');
const router = express.Router();
const issuanceController = require('../controllers/issuanceController');

router.get('/next', issuanceController.getNextIssuedIdAPI);
router.get('/sum/:productID', issuanceController.getTotalIssuedByProductId);
router.get('/', issuanceController.getAllIssuances);
router.get('/:id', issuanceController.getIssuanceById);
router.post('/add', issuanceController.createIssuance);
router.delete('/:id', issuanceController.deleteIssuance);

module.exports = router;
