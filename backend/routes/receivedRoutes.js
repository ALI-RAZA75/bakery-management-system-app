const express = require('express');
const receivedController = require('../controllers/receivedController');
const router = express.Router();

router.get('/', receivedController.getAllReceived);  
router.get('/:id', receivedController.getReceivedById); 
router.get('/dmd/:dmdID', receivedController.getReceivedByDmdId);
router.get('/sum/:dmdID/:productID', receivedController.getTotalReceivedByDmdIdProductId);
router.get('/sum/:productID', receivedController.getTotalReceivedByProductId);
router.post('/add', receivedController.addReceived);  
router.put('/:dmdID/:userID/:categoryID/:productID', receivedController.updateReceived);  
router.delete('/:id', receivedController.deleteReceived);  
router.post('/check', receivedController.checkReceived);  
router.get('/check/:dmdID/:productID', receivedController.checkReceivedByDmdIdAndProductId);

module.exports = router;
