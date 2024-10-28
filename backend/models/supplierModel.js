const connectDB = require("../config/dbConfig");

const getAllSuppliers = async () => {
  const connection = await connectDB();
  const query = "SELECT * FROM supplier_details"; 
  const result = await connection.query(query);
  await connection.close();
  return result.rows ? result.rows : result;
};

const getSupplierById = async (supplierId) => {
  const connection = await connectDB();
  const query = `
    SELECT supplierCode, supplierName, supplierNumber, address, balanceAmount, debitAmount, contactPersonName, contactPersonNumber, supplierStatus, notes
    FROM supplier_details
    WHERE id = ?
  `;

  try {
    const result = await connection.query(query, [supplierId]);
    if (result.length > 0) {
      console.log("Supplier found:", result[0]);
      return result[0];
    } else {
      console.log("Supplier not found....");
      return null;
    }
  } catch (error) {
    console.error("Error fetching supplier:", error);
  } finally {
    await connection.close();
  }
};

const createSupplier = async (supplier) => {
  const connection = await connectDB();
  const query = `
    INSERT INTO supplier_details (
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    supplier.supplierCode || null, 
    supplier.supplierName || null, 
    supplier.supplierNumber || null, 
    supplier.address || null, 
    typeof supplier.balanceAmount === 'number' ? supplier.balanceAmount : parseInt(supplier.balanceAmount, 10) || null, 
    typeof supplier.debitAmount === 'number' ? supplier.debitAmount : parseInt(supplier.debitAmount, 10) || null, 
    supplier.contactPersonName || null, 
    supplier.contactPersonNumber || null, 
    supplier.supplierStatus || null, 
    supplier.notes || null 
  ];

  console.log("Executing query:", query);
  console.log("With values:", values);

  try {
    await connection.query(query, values);
    console.log("Supplier inserted successfully.");
  } catch (error) {
    console.error("Error inserting supplier:", error);
  } finally {
    await connection.close();
  }
};

const updateSupplier = async (supplierId, supplierUpdates) => {
  const connection = await connectDB();

  const balanceAmount = supplierUpdates.balanceAmount ? parseFloat(supplierUpdates.balanceAmount) : null;
  const debitAmount = supplierUpdates.debitAmount ? parseFloat(supplierUpdates.debitAmount) : null;

  const query = `
    UPDATE supplier_details
    SET supplierCode = ?, supplierName = ?, supplierNumber = ?, address = ?, balanceAmount = ?, debitAmount = ?, contactPersonName = ?, contactPersonNumber = ?, supplierStatus = ?, notes = ?
    WHERE id = ?
  `;

  const values = [
    supplierUpdates.supplierCode || null,
    supplierUpdates.supplierName || null,
    supplierUpdates.supplierNumber || null,
    supplierUpdates.address || null,
    balanceAmount,  
    debitAmount,   
    supplierUpdates.contactPersonName || null,
    supplierUpdates.contactPersonNumber || null,
    supplierUpdates.supplierStatus || null,
    supplierUpdates.notes || null,
    supplierId,
  ];

  try {
    const result = await connection.query(query, values);
    const rowsAffected = result.rowsAffected || result.affectedRows || 0;
    if (rowsAffected > 0) {
      console.log("Supplier updated successfully.");
      return true;
    }
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw error;
  } finally {
    await connection.close();
  }
};


// const updateSupplier = async (supplierId, supplierUpdates) => {
//   const connection = await connectDB();
  
//   const balanceAmount = parseFloat(supplierUpdates.balanceAmount);
//   const debitAmount = parseFloat(supplierUpdates.debitAmount);
  
//   const query = `
//     UPDATE supplier_details
//     SET supplierCode = ?, supplierName = ?, supplierNumber = ?, address = ?, balanceAmount = ?, debitAmount = ?, contactPersonName = ?, contactPersonNumber = ?, supplierStatus = ?, notes = ?
//     WHERE id = ?
//   `;
  
//   const values = [
//     supplierUpdates.supplierCode,
//     supplierUpdates.supplierName,
//     supplierUpdates.supplierNumber,
//     supplierUpdates.address,
//     balanceAmount,  
//     debitAmount,   
//     supplierUpdates.contactPersonName,
//     supplierUpdates.contactPersonNumber,
//     supplierUpdates.supplierStatus,
//     supplierUpdates.notes,
//     supplierId,
//   ];
  
//   try {
//     const result = await connection.query(query, values);
//     const rowsAffected = result.rowsAffected || result.affectedRows || 0;
//     if (rowsAffected > 0) {
//       console.log("Supplier updated successfully.");
//       return true;
//     }
//   } catch (error) {
//     console.error("Error updating supplier:", error);
//     throw error;
//   } finally {
//     await connection.close();
//   }
// };

// const updateSupplier = async (supplierId, supplierUpdates) => {
//   const connection = await connectDB();
//   const query = `
//     UPDATE supplier_details
//     SET supplierCode = ?, supplierName = ?, supplierNumber = ?, address = ?, balanceAmount = ?, debitAmount = ?, contactPersonName = ?, contactPersonNumber = ?, supplierStatus = ?, notes = ?
//     WHERE id = ?
//   `;

//   const values = [
//     supplierUpdates.supplierCode,
//     supplierUpdates.supplierName,
//     supplierUpdates.supplierNumber,
//     supplierUpdates.address,
//     supplierUpdates.balanceAmount,
//     supplierUpdates.debitAmount,
//     supplierUpdates.contactPersonName,
//     supplierUpdates.contactPersonNumber,
//     supplierUpdates.supplierStatus,
//     supplierUpdates.notes,
//     supplierId,
//   ];

//   try {
//     const result = await connection.query(query, values);
//     const rowsAffected = result.rowsAffected || result.affectedRows || 0;
//     if (rowsAffected > 0) {
//       console.log("Supplier updated successfully.");
//       return true;
//     }
//   } catch (error) {
//     console.error("Error updating supplier:", error);
//   } finally {
//     await connection.close();
//   }
// };

const deleteSupplier = async (supplierId) => {
  const connection = await connectDB();
  const query = 'DELETE FROM supplier_details WHERE id = ?';
  const result = await connection.query(query, [supplierId]);
  await connection.close();
  return result;
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
