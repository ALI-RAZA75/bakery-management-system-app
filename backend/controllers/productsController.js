const productModel = require('../models/productsModel');

const getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {itemCode, barCode, boxBarCode, itemName, supplierName, category, parentCategory, boxQuantity, quantity, unit, accountHead, date, costPerUnit, expirationDate, StockKeepingUnit } = req.body;

    if (!itemCode || !barCode || !itemName || !supplierName || !category || !unit || !accountHead || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = await productModel.createProduct({
        itemCode,
      barCode,
      boxBarCode,
      itemName,
      supplierName,
      category,
      parentCategory,
      boxQuantity,
      quantity,
      unit,
      accountHead,
      date,
      costPerUnit,
      expirationDate,
      StockKeepingUnit,
    });

    res.status(201).json({ message: 'Product created successfully', newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const result = await productModel.updateProduct(productId, req.body);

    if (result.success) {
      return res.status(200).json({ message: 'Product updated successfully' });
    } else {
      return res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: error.message });
  }
};


// const updateProduct = async (req, res) => {
//   try {
//     const productId = parseInt(req.params.id, 10);
//     if (isNaN(productId)) {
//       return res.status(400).json({ message: 'Invalid ID format' });
//     }

//     const updatedProduct = await productModel.updateProduct(productId, req.body);
//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found or no changes made' });
//     }

//     res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Error updating product', error: error.message });
//   }
// };

const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const result = await productModel.deleteProduct(productId);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
