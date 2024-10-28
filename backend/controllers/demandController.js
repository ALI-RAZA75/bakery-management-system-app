const demandModel = require('../models/demandModel');

const getAllDemands = async (req, res) => {
  try {
    const demands = await demandModel.getAllDemands();
    res.status(200).json(demands);
  } catch (error) {
    console.error('Error fetching demands:', error);
    res.status(500).json({ message: 'Error fetching demands', error: error.message });
  }
};

const getDemandByDmdId = async (req, res) => {
  try {
    const { dmdID } = req.params;

    if (!dmdID || typeof dmdID !== 'string' || dmdID.trim() === '') {
      return res.status(400).json({ message: 'Invalid dmdID' });
    }

    const demands = await demandModel.getDemandByDmdId(dmdID);
    if (demands.length === 0) {  
      return res.status(404).json({ message: 'No demands found for this dmdID' });
    }
    res.status(200).json(demands);  
  } catch (error) {
    res.status(500).json({ message: 'Error fetching demand', error: error.message });
  }
};





const getNextDemandId = async (req, res) => {
  try {
    const nextDmdId = await demandModel.getNextDemandId();
    res.status(200).json({ nextDmdId });
  } catch (error) {
    console.error('Error fetching next demand ID:', error);
    res.status(500).json({ message: 'Error fetching next demand ID', error: error.message });
  }
};



const getDemand = async (req, res) => {
  try {
    const demandId = parseInt(req.params.id, 10);
    if (isNaN(demandId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const demand = await demandModel.getDemandById(demandId);
    if (!demand) {
      return res.status(404).json({ message: 'Demand not found' });
    }
    res.status(200).json(demand);
  } catch (error) {
    console.error('Error fetching demand:', error);
    res.status(500).json({ message: 'Error fetching demand', error: error.message });
  }
};

const createDemand = async (req, res) => {
  try {
    await demandModel.createDemand(req.body);
    res.status(201).json({ message: 'Demand created successfully' });
  } catch (error) {
    console.error('Error creating demand:', error);
    res.status(500).json({ message: 'Error creating demand', error: error.message });
  }
};


const updateDemand = async (req, res) => {
  try {
    const demandId = parseInt(req.params.id, 10);
    if (isNaN(demandId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const updated = await demandModel.updateDemand(demandId, req.body);
    if (updated) {
      res.status(200).json({ message: 'Demand updated successfully' });
    } else {
      res.status(404).json({ message: 'Demand not found' });
    }
  } catch (error) {
    console.error('Error updating demand:', error);
    res.status(500).json({ message: 'Error updating demand', error: error.message });
  }
};

const deleteDemand = async (req, res) => {
  try {
    const demandId = parseInt(req.params.id, 10);
    if (isNaN(demandId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const deleted = await demandModel.deleteDemand(demandId);
    if (deleted) {
      res.status(200).json({ message: 'Demand deleted successfully' });
    } else {
      res.status(404).json({ message: 'Demand not found' });
    }
  } catch (error) {
    console.error('Error deleting demand:', error);
    res.status(500).json({ message: 'Error deleting demand', error: error.message });
  }
};

module.exports = {
  getAllDemands,
  getDemandByDmdId,
  getNextDemandId,
  getDemand,
  createDemand,
  updateDemand,
  deleteDemand
};
