const connectDB = require("../config/dbConfig");

const getAllDemands = async () => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT 
        id, 
        dmdID, 
        userID, 
        productID, 
        categoryID,
        quantity, 
        demandDate 
      FROM 
        all_demands;
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
  } catch (error) {
    console.error("Error fetching demands:", error);
    throw error;
  }
};



const getDemandByDmdId = async (dmdID, productID) => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT 
        id, 
        dmdID, 
        userID, 
        productID, 
        categoryID,
        quantity, 
        demandDate 
      FROM 
        all_demands 
      WHERE 
        dmdID = ?
      AND 
      productID = ?
    `;
    console.log("Executing query with dmdID:", dmdID); 
    const result = await connection.query(query, [dmdID, productID]); 
    await connection.close();
    return result;
  } catch (error) {
    console.error("Error fetching demand by dmdID:", error);
    throw error;
  }
};




const getNextDemandId = async () => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT MAX(CAST(SUBSTRING(dmdID, 4, LEN(dmdID)) AS INT)) AS lastId
      FROM all_demands;
    `;
    const result = await connection.query(query);
    await connection.close();

    const lastId = result[0].lastId || 0; 
    const nextId = lastId + 1;
    const nextDmdId = 'DMD' + nextId.toString().padStart(4, '0'); 
    return nextDmdId;
  } catch (error) {
    console.error("Error fetching next demand ID:", error);
    throw error;
  }
};

const getDemandById = async (demandId) => {
  try {
    const connection = await connectDB();
    const query = `
      SELECT 
        id, 
        dmdID, 
        userID, 
        productID, 
        categoryID,
        quantity, 
        demandDate 
      FROM 
        all_demands 
      WHERE 
        id = ?;
    `;
    const result = await connection.query(query, [demandId]);
    await connection.close();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching demand by ID:", error);
    throw error;
  }
};

// Update an existing demand

const createDemand = async (demand) => {
  const connection = await connectDB();


  const nextDmdId = await getNextDemandId();

  const demandQuery = `
    INSERT INTO all_demands (dmdID, userID, productID, categoryID, quantity, demandDate)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  try {
    for (const product of demand.products) {
      if (!product.productID) {
        console.error("Product ID is undefined, skipping this product.");
        continue;
      }

      const values = [
        nextDmdId,               
        demand.userID,           
        product.productID,      
        product.categoryID || null,
        product.quantity || null,    
        demand.demandDate       
      ];

      try {
        await connection.query(demandQuery, values);
        console.log("Demand created successfully for product ID:", product.productID);
      } catch (error) {
        console.error("Error creating demand for product ID:", product.productID, error);
      }
    }
  } catch (error) {
    console.error("Error creating demand:", error);
  } finally {
    await connection.close();
  }
};






const updateDemand = async (demandId, demandData) => {
  const { userID, productID, unit, demandDate } = demandData;
  try {
    const connection = await connectDB();
    const query = `
      UPDATE all_demands
      SET userID = ?, productID = ?, unit = ?, demandDate = ?
      WHERE id = ?;
    `;
    const result = await connection.query(query, [userID, productID, unit, demandDate, demandId]);
    await connection.close();
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating demand:", error);
    throw error;
  }
};

const deleteDemand = async (demandId) => {
  try {
    const connection = await connectDB();
    const query = 'DELETE FROM all_demands WHERE id = ?';
    const result = await connection.query(query, [demandId]);
    await connection.close();
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting demand:", error);
    throw error;
  }
};

module.exports = {
  getAllDemands,
  getDemandByDmdId,
  getNextDemandId,
  getDemandById,
  createDemand,
  updateDemand,
  deleteDemand
};

