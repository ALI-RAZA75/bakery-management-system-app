const express = require('express');
const demandController = require('../controllers/demandController');
const router = express.Router();


router.get('/next', demandController.getNextDemandId);  
router.get('/', demandController.getAllDemands);         
router.get('/:id', demandController.getDemand);
router.get('/dmd/:dmdID', demandController.getDemandByDmdId);
router.post('/add', demandController.createDemand);      
router.put('/:id', demandController.updateDemand);       
router.delete('/:id', demandController.deleteDemand);     

module.exports = router;
