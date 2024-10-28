const issuanceModel = require('../models/issuanceModel');


const getAllIssuances = async (req, res) => {
  try {
    const issuances = await issuanceModel.getAllIssuances();
    res.status(200).json(issuances);
  } catch (error) {
    console.error('Error fetching issuances:', error);
    res.status(500).json({ message: 'Error fetching issuances', error: error.message });
  }
};

const getIssuanceById = async (req, res) => {
  try {
    const issuanceId = parseInt(req.params.id, 10);
    if (isNaN(issuanceId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const issuance = await issuanceModel.getIssuancById(issuanceId);
    if (!issuance) {
      return res.status(404).json({ message: 'Issuance not found' });
    }
    res.status(200).json(issuance);
  } catch (error) {
    console.error('Error fetching issuance:', error);
    res.status(500).json({ message: 'Error fetching issuance', error: error.message });
  }
};

const getNextIssuedIdAPI = async (req, res) => {
  try {

    const nextIssuedId = await issuanceModel.getNextIssuedId();
    res.status(200).json({ nextIssuedId });
  } catch (error) {
    console.error('Error fetching next issued ID:', error);
    res.status(500).json({ message: 'Error fetching next issued ID', error: error.message });
  }
};

const createIssuance = async (req, res) => {
  try {
    await issuanceModel.createIssuance(req.body);
    res.status(201).json({ message: 'Issuance created successfully' });
  } catch (error) {
    console.error('Error creating issuance:', error);
    res.status(500).json({ message: 'Error creating issuance', error: error.message });
  }
};

const getTotalIssuedByProductId = async (req, res) => {
  try {
    const { productID } = req.params;
    const totalIssued = await issuanceModel.getTotalIssuedByProductId(productID); // Call the updated model function

    res.status(200).json({ productID, totalIssued }); 
  } catch (error) {
    console.error('Error fetching total issued quantity by productID:', error);
    res.status(500).json({ message: 'Error fetching total issued quantity', error: error.message });
  }
};




const deleteIssuance = async (req, res) => {
  try {
    const issuanceId = parseInt(req.params.id, 10);
    if (isNaN(issuanceId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const deleted = await issuanceModel.deleteIssuance(issuanceId);
    if (deleted) {
      res.status(200).json({ message: 'Issuance deleted successfully' });
    } else {
      res.status(404).json({ message: 'Issuance not found' });
    }
  } catch (error) {
    console.error('Error deleting issuance:', error);
    res.status(500).json({ message: 'Error deleting issuance', error: error.message });
  }
};

module.exports = {
  getAllIssuances,
  getIssuanceById,
  getNextIssuedIdAPI,
  createIssuance,
  getTotalIssuedByProductId,
  deleteIssuance,
};
