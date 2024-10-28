const receivedModel = require('../models/receivedModel');

// Get all received records
const getAllReceived = async (req, res) => {
  try {
    const receivedRecords = await receivedModel.getAllReceived();
    res.status(200).json(receivedRecords);
  } catch (error) {
    console.error('Error fetching received records:', error);
    res.status(500).json({ message: 'Error fetching received records', error: error.message });
  }
};

// Get received record by ID
const getReceivedById = async (req, res) => {
  try {
    const { id } = req.params;
    const receivedRecord = await receivedModel.getReceivedById(id);
    if (!receivedRecord) {
      return res.status(404).json({ message: 'Received record not found' });
    }
    res.status(200).json(receivedRecord);
  } catch (error) {
    console.error('Error fetching received record by ID:', error);
    res.status(500).json({ message: 'Error fetching received record', error: error.message });
  }
};

const getReceivedByDmdId = async (req, res) => {
  try {
    const { dmdID } = req.params; // Get dmdID from request parameters
    const receivedRecord = await receivedModel.getReceivedByDmdId(dmdID); // Call the model function

    if (!receivedRecord) {
      return res.status(404).json({ message: 'Received record not found' });
    }

    res.status(200).json(receivedRecord); // Return the found record
  } catch (error) {
    console.error('Error fetching received record by dmdID:', error);
    res.status(500).json({ message: 'Error fetching received record', error: error.message });
  }
};

// const getSummOfReceivedByDmdId = async (req, res) => {
//   try {
//     const { dmdID } = req.params; 
//     const totalReceived = await receivedModel.getSumOfReceivedByDmdIdAndProductId(dmdID); 

//     res.status(200).json({ dmdID, totalReceived }); 
//   } catch (error) {
//     console.error('Error fetching sum of received quantities by dmdID:', error);
//     res.status(500).json({ message: 'Error fetching total received quantity', error: error.message });
//   }
// };

const getTotalReceivedByProductId = async (req, res) => {
  try {
    const { productID } = req.params;
    const totalReceived = await receivedModel.getTotalReceivedByProductId(productID); // Call the updated model function

    res.status(200).json({ productID, totalReceived }); 
  } catch (error) {
    console.error('Error fetching total received quantity by productID:', error);
    res.status(500).json({ message: 'Error fetching total received quantity', error: error.message });
  }
};

const getTotalReceivedByDmdIdProductId = async (req, res) => {
  try {
    const { productID } = req.params;
    const totalReceived = await receivedModel.getTotalReceivedByProductId(dmdID, productID); 

    res.status(200).json({ dmdID, productID, totalReceived }); 
  } catch (error) {
    console.error('Error fetching total received quantity by productID:', error);
    res.status(500).json({ message: 'Error fetching total received quantity', error: error.message });
  }
};




// Add a new received record

// const getSumOfReceivedByDmdIdAndProductIdHandler = async (req, res) => {
//   const dmdID = req.query.dmdID; // dmdID is a string (varchar)
//   const productID = parseInt(req.query.productID, 10); // Ensure productID is an integer

//   // Validate input parameters
//   if (!dmdID || typeof dmdID !== 'string' || dmdID.trim() === '') {
//     return res.status(400).json({ message: 'Invalid dmdID' });
//   }
//   if (isNaN(productID)) {
//     return res.status(400).json({ message: 'Invalid productID' });
//   }

//   console.log('dmdID:', dmdID, 'productID:', productID); // Debugging line

//   try {
//     const totalReceived = await receivedModel.getSumOfReceivedByDmdIdAndProductId(dmdID, productID); // Call the model function

//     if (totalReceived === 0) {
//       return res.status(404).json({ message: 'No records found for the provided dmdID and productID' });
//     }

//     res.status(200).json({ productID, totalReceived }); // Return the total received for the specified product
//   } catch (error) {
//     console.error('Error fetching sum of received quantities:', error);
//     res.status(500).json({ message: 'Error fetching received quantities', error: error.message });
//   }
// };

const addReceived = async (req, res) => {
  try {
    await receivedModel.addReceived(req.body);
    res.status(201).json({ message: 'Received record added successfully' });
  } catch (error) {
    console.error('Error adding received record:', error);
    res.status(500).json({ message: 'Error adding received record', error: error.message });
  }
};

// Update an existing received record
// const updateReceived = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await receivedModel.updateReceived(id, req.body);
//     if (updated) {
//       res.status(200).json({ message: 'Received record updated successfully' });
//     } else {
//       res.status(404).json({ message: 'Received record not found' });
//     }
//   } catch (error) {
//     console.error('Error updating received record:', error);
//     res.status(500).json({ message: 'Error updating received record', error: error.message });
//   }
// };

const updateReceived = async (req, res) => {
  try {

    const { dmdID, userID, categoryID, productID } = req.params;

    const receivedData = req.body;

    const updated = await receivedModel.updateReceived(
      `${dmdID}:${userID}:${categoryID}:${productID}`, 
      receivedData
    );

    if (updated) {
      res.status(200).json({ message: 'Received record updated successfully' });
    }
  } catch (error) {
    console.error('Error updating received record:', error);
    res.status(500).json({ message: 'Error updating received record', error: error.message });
  }
};

const checkReceived = async (req, res) => {
  try {
    const criteria = req.body; 
    const receivedRecord = await receivedModel.checkReceived(criteria); // Call the model function

    if (!receivedRecord) {
      return res.status(404).json({ message: 'No received records found for the provided criteria' });
    }

    res.status(200).json(receivedRecord); // Return the found record
  } catch (error) {
    console.error('Error checking received records:', error);
    res.status(500).json({ message: 'Error checking received records', error: error.message });
  }
};


const checkReceivedByDmdIdAndProductId = async (req, res) => {
  try {
    const { dmdID, productID } = req.params; 
    const receivedRecord = await receivedModel.checkReceivedByDmdIdAndProductId(dmdID, productID); // Call the model function

    if (!receivedRecord) {
      return res.status(404).json({ message: 'No received record found for the provided dmdID and productID' });
    }

    res.status(200).json(receivedRecord); 
  } catch (error) {
    console.error('Error checking received record by dmdID and productID:', error);
    res.status(500).json({ message: 'Error checking received record', error: error.message });
  }
};



const deleteReceived = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await receivedModel.deleteReceived(id);
    if (deleted) {
      res.status(200).json({ message: 'Received record deleted successfully' });
    } else {
      res.status(404).json({ message: 'Received record not found' });
    }
  } catch (error) {
    console.error('Error deleting received record:', error);
    res.status(500).json({ message: 'Error deleting received record', error: error.message });
  }
};

module.exports = {
  getAllReceived,
  getReceivedById,
  getReceivedByDmdId,
  getTotalReceivedByDmdIdProductId,
  getTotalReceivedByProductId,
  addReceived,
  updateReceived,
  checkReceived,
  checkReceivedByDmdIdAndProductId,
  deleteReceived
};
