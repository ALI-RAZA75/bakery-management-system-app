const connectDB = require("../config/dbConfig");

const getAllProducts = async () => {
  const connection = await connectDB();
  const query ="SELECT * FROM products";
  try {
    const result = await connection.query(query);
    return result.rows || result; 
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  } finally {
    await connection.close();
  }
};

const getProductById = async (productId) => {
  const connection = await connectDB();
  const query = `
    SELECT itemCode, barCode, boxBarCode, itemName, supplierName, category, parentCategory, boxQuantity, quantity, unit, accountHead, date, costPerUnit, expirationDate, StockKeepingUnit
    FROM products
    WHERE id = ?
  `;
  try {
    const result = await connection.query(query, [productId]);
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  } finally {
    await connection.close();
  }
};

const createProduct = async (product) => {
    const connection = await connectDB();
    const query = `
      INSERT INTO products (itemCode, barCode, boxBarCode, itemName, supplierName, category, parentCategory, boxQuantity, quantity, unit, accountHead, date, costPerUnit, expirationDate, StockKeepingUnit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      product.itemCode,
      product.barCode,
      product.boxBarCode,
      product.itemName,
      product.supplierName,
      product.category,
      product.parentCategory,
      product.boxQuantity,
      product.quantity,
      product.unit,
      product.accountHead,
      product.date,
      product.costPerUnit,
      product.expirationDate,
      product.StockKeepingUnit,
    ];
  
    console.log('Values being inserted:', values); 
  
    try {
      await connection.query(query, values);
      console.log('Product inserted successfully.');
    } catch (error) {
      console.error('Error inserting product:', error);
      throw error;
    } finally {
      await connection.close();
    }
  };

  const updateProduct = async (productId, productUpdates) => {
    const connection = await connectDB();
    
    try {
      const [existingProduct] = await connection.query(
        `SELECT id FROM products WHERE id = ?`,
        [productId]
      );
  
      if (!existingProduct) {
        return { success: false, message: 'Product not found' };
      }
  
      const query = `
        UPDATE products
        SET itemCode = ?, barCode = ?, boxBarCode = ?, itemName = ?, supplierName = ?, category = ?, parentCategory = ?, boxQuantity = ?, quantity = ?, unit = ?, accountHead = ?, date = ?, costPerUnit = ?, expirationDate = ?, StockKeepingUnit = ?
        WHERE id = ?
      `;
      const values = [
        productUpdates.itemCode,
        productUpdates.barCode,
        productUpdates.boxBarCode,
        productUpdates.itemName,
        productUpdates.supplierName,
        productUpdates.category,
        productUpdates.parentCategory,
        productUpdates.boxQuantity,
        productUpdates.quantity,
        productUpdates.unit,
        productUpdates.accountHead,
        productUpdates.date,
        productUpdates.costPerUnit,
        productUpdates.expirationDate,
        productUpdates.StockKeepingUnit,
        productId,
      ];
  
      const result = await connection.query(query, values);
      if (result) {
        return { success: true };
      } else {
        return { success: false, message: 'No changes made' };
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product');
    } finally {
      await connection.close();
    }
  };
  

const deleteProduct = async (productId) => {
  const connection = await connectDB();
  const query = 'DELETE FROM products WHERE id = ?';
  try {
    const result = await connection.query(query, [productId]);
    if (result) {
      console.log('Product deleted successfully.');
      return true;
    } else {
      console.log('No rows affected.');
      return false;
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  } finally {
    await connection.close();
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
