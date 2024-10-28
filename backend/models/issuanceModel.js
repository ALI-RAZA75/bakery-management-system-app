const connectDB = require("../config/dbConfig");

const getAllIssuances = async () => {
  try {
    const connection = await connectDB();
    const query = `
        SELECT 
          id, 
          issuedId, 
          issuanceDate, 
          issuedTo, 
          issuedBy, 
          issuancePurpose, 
          itemCode, 
          productID, 
         
          issuedQuantity, 
          remainingQuantity 
        FROM 
          issuance;
      `;
    const result = await connection.query(query);
    await connection.close();
    return result;
  } catch (error) {
    console.error("Error fetching issuance details:", error);
    throw error;
  }
};


const getIssuancById = async (issuanceId) => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT 
        id, 
        issuedId, 
        issuanceDate, 
        issuedTo, 
        issuedBy, 
        issuancePurpose, 
        itemCode, 
        productID, 
       
        issuedQuantity, 
        remainingQuantity
      FROM 
        issuance 
      WHERE 
        id = ?;
    `;
    const result = await connection.query(query, [issuanceId]);
    await connection.close();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching issuance by ID:", error);
    throw error;
  }
};



const getNextIssuedId = async () => {

  try {
    const connection = await connectDB();
    const query = `
      SELECT MAX(CAST(SUBSTRING(issuedId, 4, LEN(issuedId)) AS INT)) AS lastId
      FROM issuance;
    `;
    const result = await connection.query(query);
    await connection.close();

    const lastId = result[0].lastId || 0; 
    const nextId = lastId + 1;
    const nextissuedId = 'ISS' + nextId.toString().padStart(4, '0'); 
    return nextissuedId;

  } catch (error) {
    console.error("Error fetching next demand ID:", error);
    throw error;
  }
};

const createIssuance = async (issuance) => {
  const connection = await connectDB();
  const nextIssuedId = await getNextIssuedId();
  try {
    await connection.beginTransaction(); 

    for (const item of issuance.items) {
      const issuanceQuery = `
        INSERT INTO issuance 
        (issuedId, issuanceDate, issuedTo, issuedBy, issuancePurpose, itemCode, productID, issuedQuantity, remainingQuantity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const values = [
        nextIssuedId, 
        issuance.issuanceDate, 
        issuance.issuedTo, 
        issuance.issuedBy, 
        issuance.issuancePurpose, 
        item.itemCode, 
        item.productID, 
        item.issuedQuantity, 
        item.remainingQuantity
      ];

      await connection.query(issuanceQuery, values);
    }

    await connection.commit(); 
  } catch (error) {
    await connection.rollback(); 
    console.error("Error creating issuance:", error);
  } finally {
    await connection.close();
  }
};

const getTotalIssuedByProductId = async (productID) => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT SUM(issuedQuantity) as totalIssued
      FROM issuance
      WHERE productID = ?;
    `; 
    const result = await connection.query(query, [productID]);
    await connection.close();

    const totalIssued = result.length > 0 ? result[0].totalIssued || 0 : 0;
    return totalIssued;
  } catch (error) {
    console.error("Error fetching total issued quantity for productID:", error);
    throw error;
  }
};


const deleteIssuance = async (issuanceId) => {
  try {
    const connection = await connectDB();
    const query = 'DELETE FROM issuance WHERE id = ?';
    const result = await connection.query(query, [issuanceId]);
    await connection.close();
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting issuance:", error);
    throw error;
  }
};

module.exports = {
  getAllIssuances,
  getIssuancById,
  getNextIssuedId,
  createIssuance,
  getTotalIssuedByProductId,
  deleteIssuance,
};
