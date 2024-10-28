const supplierModel = require('../models/supplierModel');

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.getAllSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplierId = parseInt(req.params.id, 10);

    if (isNaN(supplierId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const supplier = await supplierModel.getSupplierById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Error fetching supplier', error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const {
      supplierCode,
      supplierName,
      supplierNumber,
      address,
      balanceAmount,
      debitAmount,
      contactPersonName,
      contactPersonNumber,
      supplierStatus,
      notes
    } = req.body;

    const newSupplier = await supplierModel.createSupplier({
      supplierCode,
      supplierName,
      supplierNumber,
      address,
      balanceAmount,
      debitAmount,
      contactPersonName,
      contactPersonNumber,
      supplierStatus,
      notes
    });

    res.status(201).json({ message: 'Supplier created successfully', newSupplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Error creating supplier', error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await supplierModel.updateSupplier(req.params.id, req.body);
    res.status(200).json({ message: 'Supplier updated successfully', updatedSupplier });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Error updating supplier', error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    await supplierModel.deleteSupplier(req.params.id);
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Error deleting supplier', error: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
